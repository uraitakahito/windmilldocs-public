/**
 * 原文の `.mdx` / `.md` から、**訳す前の骨組み** `.ja.md` を作る。
 *
 * 訳すのは散文だけにしたい。MDX 固有の記法 —— `@site/` の import、`<DocCard>`、
 * `<Tabs>` —— は GitHub 上で読めないか、読めても邪魔になるので、機械で落とす。
 *
 * ## 置き場所は原文の隣
 *
 *   docs/getting_started/index.mdx      原文
 *   docs/getting_started/index.ja.md    ここに作る
 *
 * 別ツリー (`ja/…`) にすると、**904 件の画像参照と 4135 件のリンクが全部壊れる**。
 * 同じディレクトリなら、どちらも書き換えずに動く。
 *
 * ## 既訳を上書きしない
 *
 * 二度走らせても、既に在る `.ja.md` には触らない。**訳が消えるのがいちばん重い失敗**
 * なので、上書きは `--force` を明示したときだけ。
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname, basename, extname } from "node:path";

const ROOT = process.cwd();
const DOCS = join(ROOT, "docs");

/** 本家の private repo にしか無い部品。中身は出せないので、在ったことだけ残す。 */
const MISSING = [
  "EngineBenchmarks",
  "BenchmarkVisualization",
  "TaskStatisticsTable",
  "TaskDurationBarChart",
  "WorkerQueueSimulator",
  "VideoTour",
  "ScatterChart",
  "FlowEngineSimulator",
  "TpcDsBenchmarkSection",
];

/** `.mdx` / `.md` を集める。`.ja.md` 自身は対象にしない。 */
const collect = (target) => {
  const out = [];
  const walk = (p) => {
    if (statSync(p).isDirectory()) {
      for (const e of readdirSync(p)) walk(join(p, e));
      return;
    }
    if (!/\.mdx?$/.test(p) || p.endsWith(".ja.md")) return;
    out.push(p);
  };
  walk(target);
  return out;
};

/**
 * `/docs/a/b` を、いま書いているファイルから見た相対パスに直す。
 *
 * **DocCard の href は 1234 件すべて絶対** で、GitHub では repo のトップへ飛んでしまう。
 * 指す先はディレクトリのことも単一ファイルのこともあるので、4 通り試して実在するものを採る。
 */
const toRelative = (href, fromFile) => {
  const m = /^\/docs\/(.+?)\/?$/.exec(href.split("#")[0]);
  if (!m) return null;
  const anchor = href.includes("#") ? "#" + href.split("#").slice(1).join("#") : "";
  for (const cand of [`${m[1]}.mdx`, `${m[1]}.md`, `${m[1]}/index.mdx`, `${m[1]}/index.md`]) {
    const abs = join(DOCS, cand);
    if (existsSync(abs)) {
      const rel = relative(dirname(fromFile), abs);
      return (rel.startsWith(".") ? rel : "./" + rel) + anchor;
    }
  }
  // **mirror に無いページを指していることがある** (本家のサイトには在るが、公開
  // mirror には含まれていない)。`/docs/…` のまま残すと GitHub では repo のトップへ
  // 飛んでしまうので、本家サイトの該当ページへ向ける。
  return `https://www.windmill.dev${href}`;
};

/** `<DocCard … />` を箇条書きのリンクにする。属性の順序は当てにしない。 */
const docCardsToList = (text, fromFile) =>
  text.replace(/<DocCard\b([\s\S]*?)\/>/g, (_all, attrs) => {
    const get = (k) => {
      const m = new RegExp(`${k}=(?:"([^"]*)"|\\{?['"]([^'"]*)['"]\\}?)`).exec(attrs);
      return m ? (m[1] ?? m[2] ?? "").trim() : "";
    };
    const title = get("title");
    const href = get("href");
    const desc = get("description");
    if (!title) return "";
    const target = href.startsWith("/docs/") ? (toRelative(href, fromFile) ?? href) : href;
    const link = target ? `[${title}](${target})` : title;
    return `- ${link}${desc ? ` —— ${desc}` : ""}`;
  });

export const convert = (src) => {
  let s = readFileSync(src, "utf8");

  // frontmatter は残す。訳は人が入れる。
  let front = "";
  const fm = /^---\n([\s\S]*?)\n---\n/.exec(s);
  if (fm) {
    front = fm[0];
    s = s.slice(fm[0].length);
  }

  // MDX の import を落とす。
  //
  // `@theme/` と `@docusaurus/` も落とす —— 対応する部品は下で見出しや註記に
  // 変えるので、import だけが残ると GitHub に生の JS の行として出る
  // (Bash と apps のページで実際に残っていた)。
  s = s.replace(
    /^import\s+[\s\S]*?from\s+['"](@site|@theme|@docusaurus|lucide-react|react-icons)[^'"]*['"];?\s*$/gm,
    "",
  );

  s = docCardsToList(s, src);

  // Tabs は見出しに。GitHub には切り替えの仕組みが無い。
  s = s.replace(/<TabItem\b[^>]*\blabel="([^"]*)"[^>]*>/g, "\n#### $1\n");
  s = s.replace(/<\/?Tabs\b[^>]*>/g, "").replace(/<\/TabItem>/g, "");

  // 本家にしか無い部品。空白にせず、在ったことを残す。
  for (const name of MISSING) {
    s = s.replace(
      new RegExp(`<${name}\\b[^>]*\\/>|<${name}\\b[^>]*>[\\s\\S]*?<\\/${name}>`, "g"),
      `> *(ここには本家のドキュメントで **${name}** が入ります。この fork には含まれていません。)*`,
    );
  }

  // 空行が 3 つ以上続かないように詰める。
  s = s.replace(/\n{3,}/g, "\n\n").trimStart();

  const original = "./" + basename(src);
  const banner =
    `> **[原文](${original})の日本語訳。** 相違があれば原文が正。\n` +
    `> 原典 © Windmill Labs, Inc. — [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。` +
    `この訳も同じライセンスで提供します。\n` +
    `>\n` +
    `> **未訳。** 以下は原文のままです。\n\n`;

  return front + banner + s;
};

// **CLI として呼ばれたときだけ走る。** check-ja.mjs が `convert` を import して
// 使うので、読み込んだだけで走ってはいけない。
const invokedDirectly =
  process.argv[1] !== undefined && process.argv[1].endsWith("mdx-to-ja.mjs");
if (!invokedDirectly) {
  // import されただけ。何もしない。
} else {

const args = process.argv.slice(2);
const force = args.includes("--force");
const targets = args.filter((a) => !a.startsWith("--"));
if (targets.length === 0) {
  console.error("使い方: node scripts/mdx-to-ja.mjs <ファイルかディレクトリ> [--force]");
  process.exit(1);
}

let made = 0;
let kept = 0;
for (const t of targets) {
  for (const src of collect(join(ROOT, t))) {
    const dest = join(dirname(src), basename(src, extname(src)) + ".ja.md");
    if (existsSync(dest) && !force) {
      kept += 1;
      continue;
    }
    writeFileSync(dest, convert(src));
    made += 1;
  }
}
console.log(`  作成 ${made} 本 / 既存はそのまま ${kept} 本`);
}
