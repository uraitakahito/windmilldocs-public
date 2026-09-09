---
description: Windmill とは何か。エンドポイント・ワークフロー・UI・AI エージェントを作るための、オープンソースのワークフローエンジン兼開発者プラットフォーム。
---

> **[原文](./intro.mdx)の日本語訳。** 相違があれば原文が正。
> 原典 © Windmill Labs, Inc. — [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。この訳も同じライセンスで提供します。

# Windmill とは

Windmill は高速な **<a href="https://github.com/windmill-labs/windmill">オープンソース</a>** のワークフローエンジンであり、開発者プラットフォームです。Retool・Superblocks・n8n・Airflow・Prefect・Kestra・Temporal といった製品の代替として、**総合的な社内ツール**（エンドポイント、ワークフロー、UI）を作るために設計されています。TypeScript・Python・Go・PHP・Bash・C#・SQL・Rust・Ruby・R での記述に対応し、任意の Docker イメージも使えます。直感的なローコードのビルダーも備えています。

- [実行ランタイム](./script_editor/index.mdx) —— worker 群にまたがって、関数を低遅延かつスケーラブルに実行します。
- [オーケストレータ](./flows/1_flow_editor.mdx) —— それらの関数を、ローコードのビルダーか YAML で、効率のよい低遅延のフローに組み上げます。
- [フルコードのアプリ](./full_code_apps/index.mdx)ビルダー —— React か Svelte で書いた独自のフロントエンドを、Windmill 側の実行対象につなぎます。
- [ローコードのアプリエディタ](./apps/0_app_editor/index.mdx)（旧来のもの）—— 部品をドラッグ＆ドロップして、データ中心のダッシュボードを作ります。

Windmill は web IDE とローコードのビルダーによる UI 操作に加えて、[CLI](./advanced/3_cli/index.mdx) からの配備や [Git リポジトリからの配備](./advanced/11_git_sync/index.mdx)にも対応しており、好みの開発スタイルに合わせられます。

**<a href="https://app.windmill.dev/" rel="nofollow">クラウド版</a>**（クレジットカード不要）ですぐ始めるか、**<a href="https://www.windmill.dev/docs/advanced/self_host">セルフホスト</a>**を選べます。

> *(ここには本家のドキュメントで **VideoTour** が入ります。この fork には含まれていません。)*

## より速く開発する

**本質的なコードに集中できます。** データ変換から社内 API の呼び出しまで、要となる業務ロジックはスクリプトと SQL ファイルとして書き始められます。Windmill はそれを、面倒な下準備なしにスケーラブルなマイクロサービスとツールへ変えます。

定型的なコードは要りません。UI の構築、[エラー処理](./core_concepts/10_error_handling/index.mdx)、スケールのためのロジック、[依存関係の管理](./advanced/6_imports/index.mdx)といった繰り返しの作業は Windmill 側が引き受けます。

- [はじめかた](https://www.windmill.dev/docs/getting_started/how_to_use_windmill) —— 30 秒で始める。
- [なぜ Windmill か](https://www.windmill.dev/docs/misc/why_windmill) —— Windmill の理由と仕組み。

## 主な機能

**効率のよいランタイム** —— [言語を問わず](./getting_started/0_scripts_quickstart/index.mdx)、最小限のオーバーヘッドで、待たずに実行できます。

**依存と入力の自動的な取り回し** —— コードから lockfile と入力仕様を自動生成し、[依存の版](./advanced/6_imports/index.mdx)を揃えたうえで[入力の扱い](./core_concepts/13_json_schema_and_parsing/index.mdx)を単純にします。

**動的な web IDE とローコードのビルダー** —— 高度な編集機能と[自動生成される UI](./core_concepts/6_auto_generated_uis/index.mdx) で[スクリプト](./script_editor/index.mdx)を書き、ドラッグ＆ドロップで[フロー](./flows/1_flow_editor.mdx)を組み、React か Svelte で[フルコードのアプリ](./full_code_apps/index.mdx)を作り、あるいはコードをほとんど書かずに[ローコードのアプリ](./apps/0_app_editor/index.mdx)（旧来のもの）を設計できます。

**企業での利用に耐える** —— 堅牢な[権限管理](./core_concepts/16_roles_and_permissions/index.mdx)、[秘密情報の管理](./core_concepts/2_variables_and_secrets/index.mdx)、OAuth などを、エンタープライズ品質のプラットフォームとして備えています。

**連携と自動化** —— [webhook](./core_concepts/4_webhooks/index.mdx)、[公開 API](https://app.windmill.dev/openapi.html)、[スケジューラ](./core_concepts/1_scheduling/index.mdx)があり、既存の基盤に無理なく収まって、広く自動化に使えます。

**手元での開発** —— [VS Code 拡張](./cli_local_dev/1_vscode-extension/index.mdx)と [CLI](./advanced/3_cli/index.mdx) を使って、慣れた IDE でスクリプトやフローを開発し、[Git 連携](./advanced/11_git_sync/index.mdx)で版管理と配備につなげられます。

- [中心となる概念](./core_concepts/index.mdx) —— Windmill の中心的な概念を詳しく学ぶ。
- [エンタープライズ導入](https://www.windmill.dev/docs/enterprise/onboarding) —— 新規のエンタープライズ利用者向けの、初期設定と実践上の要点。

## 他との比較

Windmill が持つ機能の一部を備えたフレームワークは他にもありますが、**その全体を、完全なオープンソースとして提供しているものはありません。** Temporal や Airflow のようなワークフローエンジンと比べても、Retool のような UI ビルダーと比べても、Windmill はスケーラビリティ・開かれた API・扱いやすさで際立っています。

Windmill はオープンソースでセルフホスト可能なプラットフォームであり、コードの柔軟さとローコードの速さを併せ持つことで、繰り返しの作業を無理なく自動化できます。

[Retool](./compared_to/retool.mdx)、[n8n](./compared_to/peers.mdx#n8n)、[Airflow](./misc/3_benchmarks/competitors/airflow/index.mdx)、[Prefect](./compared_to/prefect.mdx)、[Kestra](./compared_to/kestra.mdx)、[Temporal](./misc/3_benchmarks/competitors/temporal/index.mdx) との比較も参照してください。

- [ベンチマーク](https://www.windmill.dev/docs/misc/benchmarks) —— 重めの処理では AWS Lambda とほぼ同等の性能。中規模の計算ではコールドスタートが遅い。
- [同種の製品との比較](./compared_to/peers.mdx) —— ワークフローエンジンの市場で Windmill がどこに位置するか。
