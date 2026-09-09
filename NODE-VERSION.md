# ビルドが通らない件（未解決）

**現状、このサイトはビルドできない。** 両方の webpack bundle はコンパイルに成功し、
**SSR の実行時**に落ちる:

```
[webpackbar] ✔ Server: Compiled successfully
[webpackbar] ✔ Client: Compiled successfully
[ERROR] Error: Unable to build website for locale en.
  [cause]: TypeError: require.resolveWeak is not a function
```

## この repo の中身とは無関係

**記事 1 本だけの最小の Docusaurus サイトで再現する。** カスタムコンポーネント無し、
この corpus 無しで、同じ行で落ちる。

## 切り分けた範囲（どれも原因ではなかった）

| 変えたもの | 結果 |
|---|---|
| Node 24.15.0 / 24.3.0 / **22 (CI)** | どれも同じ |
| React 19 / 18 | どれも同じ |
| Docusaurus 3.10.2 / 3.9.2 | どれも同じ |
| pnpm / npm | どれも同じ |
| node_modules 厳格 / 平坦 (`nodeLinker: hoisted`) | どれも同じ |
| 最小サイト（記事 1 本） | **同じ** ← ここでこの repo と無関係と分かった |
| macOS ローカル / Ubuntu の CI runner | どちらも同じ |

`.nvmrc` に `22` を置いているが、**それで直るわけではない**。当初 Node 24 が原因だと
考えたが、CI（Node 22）でも同じエラーが出て否定された。

## fork 側でやったことのうち、無関係だったもの

`@docusaurus/theme-common` が解決できない件は**別の問題**で、`nodeLinker: hoisted`
で解決済み。当初はこれが SSR エラーの原因だと考えて 3 通り試したが、
**該当ページを除外しても SSR エラーは出た**ので無関係だった。

| 試したこと | 結果 |
|---|---|
| `@docusaurus/theme-common` を直接依存に足す | 二重の実体になる |
| `publicHoistPattern: "@docusaurus/*"` | `react-loadable` まで持ち上がる |
| webpack alias で同一実体に向ける | subpath (`theme-common/internal`) を奪う |

## 次に試すこと

- 公式の `create-docusaurus` の雛形が、この環境で建つかどうか（未確認）
- 建つなら、こちらの `docusaurus.config.ts` との差分を詰める
- 建たないなら、Docusaurus 側の既知の不具合を当たる
