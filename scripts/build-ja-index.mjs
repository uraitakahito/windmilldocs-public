/**
 * `docs/INDEX.ja.md` を作る。**訳したページの一覧。**
 *
 * サイトを建てないのでサイドバーが無い。代わりにこの 1 枚が目次になる。
 *
 * **手で並べない。** `.ja.md` を走査して作るので、訳を足せば目次も揃う。
 * 並び順はディレクトリ構造 —— 本家の並び順は private 側にしか無いため、
 * こちらは構造を信じる。
 *
 * 「訳した」と「骨組みだけ」を区別する。骨組みには生成器が入れた印が残っている
 * ので、それで判る。**未訳を訳済みに見せない** —— 読む人が英語に着地したときに、
 * それが予期されたことだと分かるように。
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const DOCS = join(ROOT, "docs");
/** 生成直後の骨組みに入っている印。訳し始めたら消してもらう。 */
const UNTRANSLATED = "> **未訳。** 以下は原文のままです。";
/** こちらで書いた文書。訳ではないので目次に並べない (check-ja.mjs と揃える)。 */
const OURS = new Set(["INDEX.ja.md", "GLOSSARY.ja.md"]);

const pages = [];
const walk = (dir) => {
  for (const e of readdirSync(dir).sort()) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (e.endsWith(".ja.md") && !OURS.has(e)) pages.push(p);
  }
};
walk(DOCS);

const rows = pages.map((p) => {
  const rel = relative(DOCS, p);
  const body = readFileSync(p, "utf8");
  const title = /^title:\s*(.+)$/m.exec(body)?.[1]?.replace(/^['"]|['"]$/g, "") ?? rel;
  return { rel, title, done: !body.includes(UNTRANSLATED) };
});

const done = rows.filter((r) => r.done);
const todo = rows.filter((r) => !r.done);

const section = (label, list) =>
  list.length === 0
    ? ""
    : `## ${label}（${list.length} 本）\n\n` +
      list.map((r) => `- [${r.title}](./${r.rel})`).join("\n") +
      "\n\n";

writeFileSync(
  join(DOCS, "INDEX.ja.md"),
  `# 日本語訳の目次

Windmill のドキュメントを個人的に日本語へ訳したものです。
原典 © Windmill Labs, Inc. — [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。
この訳も同じライセンスで提供します。相違があれば[原文](https://www.windmill.dev/docs/intro)が正です。

**このファイルは生成物です。** \`node scripts/build-ja-index.mjs\` で作り直せます。

` +
    section("訳済み", done) +
    section("骨組みのみ（本文は英語）", todo) +
    `---

原文は同じディレクトリに \`.mdx\` として置いてあります。訳が古いと思ったら、
各ページ冒頭の「原文」リンクから戻れます。

訳語は [GLOSSARY.ja.md](./GLOSSARY.ja.md) に固定してあります。
`,
);
console.log(`  目次: 訳済み ${done.length} 本 / 骨組み ${todo.length} 本`);
