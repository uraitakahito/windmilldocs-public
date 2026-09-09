# Node の版について

**Docusaurus 3.10 は Node 24 でビルドできない。** `.nvmrc` に `22` を置いているのは
そのため。

## 何が起きるか

両方の bundle はコンパイルに成功し、**SSR の実行時**に落ちる:

```
[webpackbar] ✔ Server: Compiled successfully
[webpackbar] ✔ Client: Compiled successfully
[ERROR] Error: Unable to build website for locale en.
  [cause]: TypeError: require.resolveWeak is not a function
```

## この repo とは無関係

**1 ページだけの最小の Docusaurus サイトで再現する。** 記事 1 本・カスタム
コンポーネント無し・この corpus 無しで、同じ行で落ちる。Node 24.3.0 と 24.15.0 の
両方で確認した。

そこに辿り着くまでに、fork 側の問題だと思って次を試している —— **どれも無関係だった**:

| 試したこと | 結果 |
|---|---|
| `@docusaurus/theme-common` を直接依存に足す | 二重の実体になり、同じ SSR エラー |
| `publicHoistPattern: "@docusaurus/*"` | `react-loadable` まで持ち上がり、同じ |
| webpack alias で同一実体に向ける | subpath を奪って別の形に壊れる |
| React 18 に落とす | 変わらず (peer は `^18 || ^19` で 19 も対応) |
| `nodeLinker: hoisted` | **theme-common の解決だけは直る。** SSR エラーは残る |
| **該当ページを除外する** | **それでも落ちる** ← ここで無関係と分かった |

`nodeLinker: hoisted` だけは別の理由 (theme-common の解決) で必要なので残してある。
