---
description: Windmill を使い始めるには。ワークスペースを用意し、最初のスクリプト・フロー・アプリを作って、数分で配備する。
---

> **[原文](./index.mdx)の日本語訳。** 相違があれば原文が正。
> 原典 © Windmill Labs, Inc. — [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。この訳も同じライセンスで提供します。

# Windmill をはじめる

Windmill は高速な **<a href="https://github.com/windmill-labs/windmill">オープンソース</a>** のワークフローエンジン兼開発者プラットフォームで、TypeScript・Python・Go・[その他多くの言語](../0_scripts_quickstart/index.mdx)でエンドポイント・ワークフロー・UI を作れます。何を目指した製品で、他の選択肢とどう違うかは [Windmill とは](../../intro.mdx)を参照してください。

## 使い方を選ぶ

### Windmill クラウド

[クラウド版](https://app.windmill.dev/)ならすぐ始められます。クレジットカードは要りません。GitHub・GitLab・Google・Microsoft の SSO でサインアップできます。Community プランは月 1,000 回の実行から始められ、必要になれば簡単に上げられます。[Windmill クラウドを始める](https://app.windmill.dev/)。

Windmill クラウドは米国でホストされています。[Cloud Enterprise](/pricing) のお客様には EU 内の専用インスタンスも提供しています。

### セルフホスト

基盤を完全に自分で管理したい場合は、Kubernetes 向けの [helm chart](https://github.com/windmill-labs/windmill-helm-charts) か、より簡単な docker-compose でセルフホストできます。[セルフホストのしかた](../../advanced/1_self_host/index.mdx)。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [セルフホスト](https://www.windmill.dev/docs/advanced/self_host/) —— 2 分でセルフホストする。
</div>

## 開発のしかた

### 内蔵の IDE
Windmill は[内蔵の IDE](../../code_editor/index.mdx) だけで開発できます。スクリプト・ワークフロー・[ローコードのアプリ](../../apps/0_app_editor/index.mdx)・[フルコードのアプリ](../../full_code_apps/index.mdx)を効率よく作れるように作られています。

### 手元での開発
慣れた環境で書きたい場合も問題ありません。Windmill はローカル環境と自然につながります。[VS Code 拡張](../../cli_local_dev/1_vscode-extension/index.mdx)や、[Git を通じた本番への配備](../../advanced/12_deploy_to_prod/index.mdx)のための道具があります。[手元での開発の選択肢](../../advanced/4_local_development/index.mdx)。
<div className="grid grid-cols-2 gap-6 mb-4">
	- [手元での開発](https://www.windmill.dev/docs/advanced/local_development) —— 端末・VS Code・JetBrains の IDE など、さまざまな環境から開発する。
	- [VS Code 拡張](https://www.windmill.dev/docs/cli_local_dev/vscode-extension) —— 使い慣れた VS Code や Cursor でスクリプトとフローを書きつつ、テストやフローの編集には Windmill の UI を使う。
</div>

### 配備の準備ができたら

Windmill の配備ガイドに沿えば、ステージングから本番へ滑らかに移せます。[本番へ配備する](../../advanced/12_deploy_to_prod/index.mdx)。

## ホーム画面から作る

ワークスペースのホーム画面には、そのワークスペースにあるものが一覧で出ます。新しく作るときは、ヘッダー右上の **新規（New）** ボタンを使います。ホバー（またはクリック）すると 2 枚組のポップオーバーが開き、右に選択肢、左に選んでいる項目の説明が出ます。**新規（New）** をそのままクリックすると、既定の選択肢であるスクリプトが作られます。

<!-- SCREENSHOT PLACEHOLDER: the "New" popover on the home page, opened. Two panes — description on the left, option list on the right — with the option rows (Script, Flow, App (full-code), Workflow-as-Code, Data pipelines, App (low-code)) and the Advanced / Alpha / Legacy badges visible. Reference PR screenshot: shots/worktree-home-plus-new-popover/1782636902-reordered.png. Save as new_popover.png (+ new_popover.png.webp) next to this file. -->

選べるのは次のものです。

- [スクリプト（Script）](../0_scripts_quickstart/index.mdx) —— [対応するいずれかの言語](../0_scripts_quickstart/index.mdx)で書く、単体のスクリプト。
- [フロー（Flow）](../../flows/1_flow_editor.mdx) —— スクリプトを組み合わせて、分岐・ループ・承認・再試行のあるワークフローにする。
- [アプリ（フルコード）](../9_full_code_apps_quickstart/index.mdx) —— React か Svelte で UI を作る。
- [Workflow-as-Code](../../core_concepts/31_workflows_as_code/index.mdx) —— _Advanced_ の印付き。ワークフロー全体を 1 つのスクリプトとして書く。選ぶと **Python** か **TypeScript** かを訊かれます。
- [データパイプライン](../10_pipeline_quickstart/index.mdx) —— _Alpha_ の印付き。取り込み・変換・書き出しの各段を視覚的につなぐエディタ。
- [アプリ（ローコード）](../7_apps_quickstart/index.mdx) —— _Legacy_ の印付き。ドラッグ＆ドロップの UI ビルダー。新しく作るならフルコードのアプリを勧めます。

一部の選択肢には、説明の欄に取り込み用の操作もあります（たとえば _Import flow_ / _Import Workflow-as-Code_ / _Import full-code app_ / _Import low-code app_）。これらを開くと引き出しが出て、YAML や JSON の書き出しを貼り付けるとエディタに反映されます。

ヘッダーには **Hub** ボタンもあり、[Windmill Hub](https://hub.windmill.dev/) を新しいタブで開きます。外部の道具をつなぐための **CLI / MCP** ボタンもあります。
