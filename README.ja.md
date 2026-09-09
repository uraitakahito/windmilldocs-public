# Windmill Docs — 非公式日本語訳

[Windmill](https://www.windmill.dev/) のドキュメントを、個人的な学習のために
日本語へ訳しています。

## 読みかた

**GitHub 上でそのまま読めます。** サイトは建てていません。

👉 **[日本語訳の目次](./docs/INDEX.ja.md)**

訳は原文の**隣**に `.ja.md` として置いてあります。

```
docs/intro.mdx        原文
docs/intro.ja.md      訳
```

こうしているのは、別ツリーにすると **904 件の画像参照と 4135 件のリンクが全部
壊れる**から。同じディレクトリなら、どちらも書き換えずに動きます。

未訳のページへのリンクは**英語のページに着地します**。それが正常で、訳が無いことの
表明です。

## ライセンスと帰属

原典 © Windmill Labs, Inc. — [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。

**これは原文に変更（日本語への翻訳）を加えた二次的著作物です。** CC BY-SA 4.0 に
従い、この訳文も同じ **CC BY-SA 4.0** で提供します。原典の `LICENSE.txt` はそのまま
置いてあります。

Windmill Labs はこの訳を確認していません。**正確さは保証されません** —— 相違が
あれば原典が正です。各ページ冒頭の「原文」リンクから戻れます。

## 訳を足す

```sh
node scripts/mdx-to-ja.mjs docs/core_concepts     # 骨組みを作る（既訳は上書きしない）
# …散文を訳し、冒頭の「未訳。」の行を消す…
node scripts/build-ja-index.mjs                   # 目次を作り直す
```

生成器がやること: `@site/` の import を落とし、`<DocCard>` を箇条書きのリンクに直し
（絶対 `/docs/…` は相対パスへ。mirror に無いページは本家サイトへ）、`<Tabs>` を
見出しにし、本家にしか無い部品には「ここには無い」と置きます。

## サイトについて（未完）

`develop` には Docusaurus 一式も置いてあります。**ビルドは通っていません** ——
SSR が `require.resolveWeak` で落ちます。記事 1 本だけの最小サイトでも再現するので、
この repo の中身とは無関係です。切り分けた範囲は [NODE-VERSION.md](./NODE-VERSION.md)
に残してあります。

いまは GitHub 上で読む形で足りているので、そちらは保留です。

## 本家への追随

[SYNC.md](./SYNC.md) を参照。`main` は本家 mirror のまま、訳は `develop` に積みます。
