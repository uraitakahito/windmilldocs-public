/**
 * 訳から**落ちた**ものを見つける。
 *
 * 訳の良し悪しは機械には見えない。だが**落ちた**ことは見える —— 節を丸ごと訳し
 * 忘れる、リンクを 1 本落とす、画像を消す。読む人が気づくのは、その先で困った
 * ときになる。
 *
 * ## やりかた
 *
 * 原文から骨組みを **その場で作り直し**、訳と構造を突き合わせる。生成器
 * (`mdx-to-ja.mjs`) は冪等なので、同じ原文からは同じものが出る。
 *
 * ## この検査が見ていないこと
 *
 * **訳したかどうかは見ていない。** 骨組みのまま (英語のまま) でも構造は同じなので
 * 通る。質のほうは目で読むしかない。そのつもりで使うこと。
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import GithubSlugger from "github-slugger";
import { join, relative, basename } from "node:path";
import { convert } from "./mdx-to-ja.mjs";

const ROOT = process.cwd();
const DOCS = join(ROOT, "docs");
const UNTRANSLATED = "> **未訳。** 以下は原文のままです。";

/**
 * こちらで書いた文書。原文を持たないので検査の対象外。
 *
 * **「原文が無い」を一律に見逃さない。** ここに挙げていないのに原文が無ければ、
 * 本家側でページが改名か削除されたということなので、問題として出す。
 */
const OURS = new Set(["INDEX.ja.md", "GLOSSARY.ja.md"]);

/** 構造だけを取り出す。訳で変わってよいのは散文だけ。 */
const shape = (text) => {
  const links = [];
  const images = [];
  const fences = [];
  const fenceBodies = [];
  let body = null;
  const headings = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  const headingIds = [];
  // **見出し id は文書ごとの状態を持つ。** 同名の見出しが 2 つあれば 2 つ目は
  // `bash-1` になる (実際 Bash のページに 3 組ある)。自前の正規表現で書いていたが、
  // 全角の約物 (（ 、 ・) を落とし損ね、この重複の連番も無かった —— 本物と
  // 突き合わせて 133 本中 12 本が食い違った。GitHub の規則は写さず、借りる。
  const slugger = new GithubSlugger();
  let infence = false;

  for (const line of text.split("\n")) {
    const fence = /^\s*```(\S*)/.exec(line);
    if (fence) {
      if (infence) {
        fenceBodies.push(body.join("\n"));
        body = null;
      } else {
        fences.push(fence[1] ?? "");
        body = [];
      }
      infence = !infence;
      continue;
    }
    if (infence) {
      body.push(line);
      continue;
    }

    const h = /^(#{1,6})\s/.exec(line);
    if (h) {
      headings[h[1].length] += 1;
      headingIds.push(slugger.slug(line.slice(h[1].length).trim()));
    }

    for (const m of line.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)) images.push(m[1]);
    for (const m of line.matchAll(/(?<!!)\[[^\]]*\]\(([^)\s]+)\)/g)) links.push(m[1]);
  }
  // 閉じ忘れたフェンスも、在ったものとして数える。
  if (body !== null) fenceBodies.push(body.join("\n"));
  return { links, images, fences, fenceBodies, headings, headingIds };
};

const collectJa = (dir) => {
  const out = [];
  const walk = (p) => {
    if (statSync(p).isDirectory()) {
      for (const e of readdirSync(p)) walk(join(p, e));
      return;
    }
    if (p.endsWith(".ja.md") && !OURS.has(basename(p))) out.push(p);
  };
  walk(dir);
  return out;
};

/**
 * 原文から骨組みを作り直す。**生成器の関数をそのまま呼ぶ。**
 *
 * 以前は一時ディレクトリに写して生成器を別プロセスで走らせていた。**それは間違い
 * だった** —— 生成器はリンク先が実在するかを docs ツリー全体で調べるので、隣の
 * 記事が無い一時ディレクトリでは、解決できるはずのリンクまで本家サイトへ落ちる。
 * その誤った基準に訳を合わせて、実際に 1 本壊した。
 */
const rebuild = (jaPath) => {
  const stem = jaPath.slice(0, -".ja.md".length);
  const src = [".mdx", ".md"].map((e) => stem + e).find((p) => existsSync(p));
  return src === undefined ? null : convert(src);
};

/** その行がコードフェンスの中か。 */
const inFenceAt = (text, index) => {
  let infence = false;
  const lines = text.split("\n");
  for (let i = 0; i < index && i < lines.length; i += 1) {
    if (/^\s*```/.test(lines[i])) infence = !infence;
  }
  return infence;
};

const problems = [];
let checked = 0;
let skipped = 0;

for (const ja of collectJa(DOCS)) {
  const text = readFileSync(ja, "utf8");
  if (text.includes(UNTRANSLATED)) {
    skipped += 1;
    continue;
  }
  const base = rebuild(ja);
  const rel = relative(ROOT, ja);
  if (base === null) {
    problems.push(`${rel}: 対応する原文が無い`);
    continue;
  }
  checked += 1;

  const a = shape(base);
  const b = shape(text);

  // **リンクと画像は完全一致。** 訳で変わってよいものではない。
  //
  // **出現「回数」まで見る。** 集合として比べると、同じ URL が複数回出るページで
  // 1 つ消しても気づけない —— 実際に反証で素通りした (intro は同じ URL を 2 回
  // 使っている)。多重集合として突き合わせる。
  const tally = (xs) => {
    const m = new Map();
    for (const x of xs) m.set(x, (m.get(x) ?? 0) + 1);
    return m;
  };
  // **同一ページ内のアンカー (`#…`) は原文と値を比べない。**
  //
  // 見出しを訳せば、GitHub が作るアンカーも変わる —— これは正しい変化で、
  // 止めるべきではない。ただし**数**は見る (節への導線が落ちれば分かる)。
  //
  // 値のほうは、原文の代わりに**訳自身の見出し**と突き合わせる。訳した見出しに
  // 合わせてアンカーを直し忘れると、数は合ったまま飛び先だけが消える —— 数える
  // だけではそこが見えない。GitHub 上では黙って何も起きないので、目でも気づけない。
  const anchors = (xs) => xs.filter((v) => v.startsWith("#"));
  const ids = new Set(b.headingIds);
  for (const anchor of anchors(b.links)) {
    if (!ids.has(anchor.slice(1))) {
      problems.push(`${rel}: ページ内リンク ${anchor} の飛び先が、この訳の見出しに無い`);
    }
  }
  const outward = (xs) => xs.filter((v) => !v.startsWith("#"));
  if (anchors(a.links).length !== anchors(b.links).length) {
    problems.push(
      `${rel}: ページ内アンカーの数が違う (原文 ${anchors(a.links).length} / 訳 ${anchors(b.links).length})`,
    );
  }

  for (const [what, x, y] of [
    ["リンク先", outward(a.links), outward(b.links)],
    ["画像", a.images, b.images],
  ]) {
    const from = tally(x);
    const to = tally(y);
    for (const [url, n] of from) {
      const m = to.get(url) ?? 0;
      if (m < n) problems.push(`${rel}: ${what}が落ちている → ${url} (原文 ${n} 回 / 訳 ${m} 回)`);
    }
    for (const [url, m] of to) {
      const n = from.get(url) ?? 0;
      if (m > n) problems.push(`${rel}: 原文より多い${what} → ${url} (原文 ${n} 回 / 訳 ${m} 回)`);
    }
  }

  // **日本語のはずの散文に、別の文字体系が紛れていないか。**
  //
  // 訳しているときに、キリル文字やハングルが 1 語だけ混ざることがある
  // (「特化」のつもりが「специализ」、「形」のつもりが「형」—— どちらも実際に
  // 出荷済みの訳から見つかった)。読めば分かるはずのものだが、長い file では
  // 見落とす。機械なら確実に見つかる。
  //
  // コードブロックの中は見ない —— 原文のコードに何が書いてあってもこちらの
  // 落ち度ではないため。
  for (const [i, line] of text.split("\n").entries()) {
    const stray = /[\uac00-\ud7af\u0400-\u04ff]+/.exec(line);
    if (stray !== null && !inFenceAt(text, i)) {
      problems.push(`${rel}: ${i + 1} 行目に日本語でない文字が紛れている: ${JSON.stringify(stray[0])}`);
    }
  }

  // **コードブロックは中身まで一致させる。**
  //
  // 訳の決め事として、コードは 1 文字も変えない —— コメントも、画面に出るものと
  // 食い違わせないために原文のまま残す。であれば機械で押さえられる。数と言語しか
  // 見ていなかった頃は、写し間違いも空行の増減も緑のまま通った。残り 25,000 語を
  // 手で写す前に閉じておく。
  //
  // これが成り立つのは、生成器がフェンスの中身を素通しするから (原文 401 本・
  // フェンス 1349 個で確認)。以前は空行を詰める処理がフェンスの中にも効いていて
  // 18 個が変わっていた。
  if (a.fences.length !== b.fences.length) {
    problems.push(`${rel}: コードブロックの数が違う (原文 ${a.fences.length} / 訳 ${b.fences.length})`);
  } else {
    for (let i = 0; i < a.fenceBodies.length; i += 1) {
      if (a.fenceBodies[i] === b.fenceBodies[i]) continue;
      const aL = a.fenceBodies[i].split("\n");
      const bL = b.fenceBodies[i].split("\n");
      const at = aL.findIndex((l, k) => l !== bL[k]);
      problems.push(
        `${rel}: ${i + 1} 個目のコードブロックの中身が原文と違う (${at + 1} 行目)\n` +
          `      原文: ${JSON.stringify(aL[at])}\n` +
          `      訳  : ${JSON.stringify(bL[at])}`,
      );
    }
  }
  for (const level of [1, 2, 3, 4, 5, 6]) {
    if (a.headings[level] !== b.headings[level]) {
      problems.push(
        `${rel}: ${"#".repeat(level)} 見出しの数が違う (原文 ${a.headings[level]} / 訳 ${b.headings[level]})`,
      );
    }
  }
}

if (problems.length > 0) {
  console.error(`✗ 訳の構造検査で ${problems.length} 件:`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`✓ 訳の構造検査: ${checked} 本を検査 / ${skipped} 本は骨組みのため対象外`);
