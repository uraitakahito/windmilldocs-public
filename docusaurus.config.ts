import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

/**
 * uraitakahito/windmilldocs-public を読める形にするための設定。
 *
 * ## なぜこのファイルが必要なのか
 *
 * 公開 mirror には **ビルド設定が 1 つも入っていない**。本家の README が
 * 「Docusaurus の設定・React コンポーネント・sidebar は private 側にあるので、
 * この mirror からサイトはビルドできない」と明言している。ここに在るのは、
 * その欠けている側を最小限だけ作り直したもの。
 *
 * ## sidebar は自動生成
 *
 * 欠けているものの本体が sidebar (401 本ぶんの並び順) だが、`docs/` は 17 の
 * ディレクトリに整理されているので構造から組める。手で並べない。
 *
 * ## 訳は i18n で、少しずつ
 *
 * Docusaurus の i18n は **訳が無いページを英語にフォールバックする**。だから
 * 401 本を一度に訳す必要がない。3 本だけ訳した状態が正常。
 */
const BASE = "/windmilldocs-public/";

const config: Config = {
  title: "Windmill Docs (日本語訳)",
  tagline: "Windmill のドキュメントを個人的に日本語へ訳したもの",

  url: "https://uraitakahito.github.io",
  baseUrl: BASE,
  organizationName: "uraitakahito",
  projectName: "windmilldocs-public",
  trailingSlash: true,

  // **リンク切れで止める。** 本文に先頭 `/` のリンクがあると baseUrl が付かないまま
  // 出力され、Pages で無警告の 404 になる (uraitakahito/specs で同じ形を踏んでいる)。
  onBrokenLinks: "throw",
  onBrokenAnchors: "warn",

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
      // **画像の欠落は警告に留める。** 一部のページが `../../static/…` を指しており、
      // その `static/` は本家の private repo 側にあって mirror に入っていない。
      // こちらで用意しようがないので、止めると 1 ページも建たない。
      //
      // リンク切れと扱いを分けているのは、あちらが **こちらの落ち度** で起きるから。
      onBrokenMarkdownImages: "warn",
    },
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en", "ja"],
    localeConfigs: {
      en: { label: "English" },
      ja: { label: "日本語" },
    },
  },

  presets: [
    [
      "classic",
      {
        docs: {
          path: "docs",
          routeBasePath: "docs",
          sidebarPath: "./sidebars.ts",
          // 本家の該当ページへの導線。訳が古いときに原文へ戻れる。
          editUrl: ({ docPath }) =>
            `https://www.windmill.dev/docs/${docPath.replace(/\.mdx?$/, "")}`,
          editLocalizedFiles: false,
        },
        // blog と changelog は publish しない —— 318 本増えるうえ、学習の対象ではない。
        blog: false,
        theme: { customCss: "./src/css/custom.css" },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: "Windmill Docs (日本語訳)",
      items: [
        { type: "docSidebar", sidebarId: "docs", position: "left", label: "Docs" },
        { type: "localeDropdown", position: "right" },
        { href: "https://www.windmill.dev/docs/intro", label: "本家", position: "right" },
        {
          href: "https://github.com/uraitakahito/windmilldocs-public",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    // **CC BY-SA 4.0 の表示義務はここで果たす。** 原典・変更した旨・ライセンスの
    // 3 つを、どのページからも見える場所に置く。
    footer: {
      style: "dark",
      links: [
        {
          title: "原典",
          items: [
            { label: "Windmill Docs (本家)", href: "https://www.windmill.dev/docs/intro" },
            {
              label: "windmill-labs/windmilldocs-public",
              href: "https://github.com/windmill-labs/windmilldocs-public",
            },
          ],
        },
        {
          title: "この fork",
          items: [
            {
              label: "uraitakahito/windmilldocs-public",
              href: "https://github.com/uraitakahito/windmilldocs-public",
            },
            { label: "CC BY-SA 4.0", href: "https://creativecommons.org/licenses/by-sa/4.0/" },
          ],
        },
      ],
      copyright:
        "原典 © Windmill Labs, Inc. — CC BY-SA 4.0。" +
        "これは uraitakahito による非公式の日本語訳で、原文に変更を加えたものです。" +
        "訳文も CC BY-SA 4.0 で提供します。",
    },
    prism: {
      additionalLanguages: ["bash", "json", "python", "rust", "sql", "yaml", "docker"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
