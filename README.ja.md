# Windmill Docs — 非公式日本語訳

[Windmill](https://www.windmill.dev/) のドキュメントを、個人的な学習のために
日本語へ訳したものです。

- **サイト** — https://uraitakahito.github.io/windmilldocs-public/
- **原典** — https://www.windmill.dev/docs/intro
- **原典の公開 mirror** — https://github.com/windmill-labs/windmilldocs-public

## ライセンスと帰属

原典 © Windmill Labs, Inc. — [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。

**これは原文に変更 (日本語への翻訳) を加えた二次的著作物です。** CC BY-SA 4.0 に
従い、この訳文も同じ **CC BY-SA 4.0** で提供します。原典の `LICENSE.txt` はそのまま
置いてあります。

Windmill Labs はこの訳を確認していません。**正確さは保証されません** —— 相違が
あれば原典が正です。各ページの「本家」リンクから原文に戻れます。

## この fork が足しているもの

公開 mirror には**ビルド設定が入っていません**（Docusaurus の設定・React
コンポーネント・sidebar は本家の private repo 側にあります）。`develop` ブランチに、
その欠けている側を最小限だけ作り直してあります。

| | |
|---|---|
| `docusaurus.config.ts` / `sidebars.ts` | 欠けているビルド設定。sidebar は構造から自動生成 |
| `src/components/DocCard.tsx` | 本家の docs が 270 か所で使うリンクカードの作り直し |
| `src/components/` のスタブ 9 つ | ベンチマークや動画など、private 側にしか無い部品。**空白にせず、その旨を表示** |
| `src/css/custom.css` | docs が使う Tailwind 相当 28 種類を手書き |

`main` は本家 mirror のままです（[SYNC.md](./SYNC.md)）。

## 手元で見る

```sh
pnpm install
pnpm run start     # http://localhost:3000/windmilldocs-public/
```

**Node は 22 を使ってください**（`.nvmrc`）。24 ではビルドできません ——
[NODE-VERSION.md](./NODE-VERSION.md) に理由と、切り分けの記録があります。
