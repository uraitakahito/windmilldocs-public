---
description: Windmill でワークフローを組むには。複数段のフローを作り、テストし、配備するまでの手引き。
---

> **[原文](./index.mdx)の日本語訳。** 相違があれば原文が正。
> 原典 © Windmill Labs, Inc. — [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。この訳も同じライセンスで提供します。

# フローのクイックスタート

この文書では[フロー](../../flows/1_flow_editor.mdx)とは何かを説明し、最初の 1 本を組み立てます。

<iframe
	style={{ aspectRatio: '16/9' }}
	src="https://www.youtube.com/embed/yE-eDNWTj3g"
	title="Flows quickstart"
	frameBorder="0"
	allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
	allowFullScreen
	className="border-2 rounded-lg object-cover w-full dark:border-gray-800"
></iframe>

<br />

> Windmill で組んだ簡単なフローの例が[こちら](https://hub.windmill.dev/flows/43/)にあります。

<br />

Windmill では、**スクリプトがフローとアプリの土台**であることを覚えておいてください。大まかに言えば、ワークフローとはスクリプトを組み合わせるための状態機械で、[DAG（有向非巡回グラフ）として表されます](../../flows/16_architecture.mdx)。スクリプトについては[スクリプトのクイックスタート](../0_scripts_quickstart/index.mdx)を参照してください。毎回スクリプトを作り直す必要はありません —— ワークスペースにあるものや [Hub](https://hub.windmill.dev/) のものを再利用できます。

ワークフローは for ループや分岐（並列化できます）を回せますし、時間切れまで、あるいは webhook や承認といった出来事を受け取るまで、自分を止めておくこともできます。ごく短い間隔でスケジュールして、処理すべき新しいものが外部に無いかを確かめる、という使い方もできます（これを「トリガースクリプト」と呼びます）。

フローの結果は、**最後に実行された段の結果**です。ただし途中で[エラー](../../flows/8_error_handling.mdx)が返るか、[早期に返す](../../flows/19_early_return.mdx)設定がされている場合は別です。

段と段のあいだのオーバーヘッドとコールドスタートは約 20ms で、[他のどのオーケストレーションエンジンより速く](/blog/launch-week-1/fastest-workflow-engine)、しかも大きな差があります。

最初のワークフローは、[Hub](https://hub.windmill.dev/flows) から 1 つ選んで fork してもかまいません。ここでは自分のフローを一から、順を追って組み立てます。

[Windmill](../00_how_to_use_windmill/index.mdx) のホーム画面で **新規（New）** をクリックし、**フロー（Flow）** を選んでください。始めましょう。

:::tip

フローエディタについては、[詳しい節](../../flows/1_flow_editor.mdx)を参照してください。

:::

## 設定

### メタデータ

最初に出るのが[設定（Settings）](../../flows/3_editor_components.mdx#settings)のメニューです。ここでワークフローの[権限](../../core_concepts/16_roles_and_permissions/index.mdx)を決められます —— ユーザー（既定では自分）と、[フォルダ](../../core_concepts/8_groups_and_folders/index.mdx)（読み取り・書き込みのグループを指します）です。

あわせて、フローに名前・要約・説明を簡潔に付けられます。これらは**明示的であるべき**もので、背景を書き、それだけ読んで分かるようにしておくことを勧めます。

![Flows metadata](./flows_metadata.png.webp)

<div className="grid grid-cols-2 gap-6 mb-4">
	- [ロールと権限](https://www.windmill.dev/docs/core_concepts/roles_and_permissions) —— インスタンスとワークスペースの中で、アクセスを制御し権限を管理する。
</div>

### スケジュール

別のタブでは、フローを起こす[スケジュール](../../core_concepts/1_scheduling/index.mdx)を設定できます。フローは任意のスケジュール、[webhook](../../core_concepts/4_webhooks/index.mdx)、UI から[起こせます](../../triggers/index.mdx)が、**同じパスを共有する主たるスケジュールは 1 つだけ**です。このメニューで、その主たるスケジュールを CRON で設定します。既定では設定されていません。

![Flows schedule](./flows_schedule.png.webp)

<div className="grid grid-cols-2 gap-6 mb-4">
	- [スケジュール](https://www.windmill.dev/docs/core_concepts/scheduling) —— スクリプトとフローにスケジュールを定め、決めた頻度で自動的に実行する。
</div>

### 共有ディレクトリ

設定メニューの最後のタブが[共有ディレクトリ](../../core_concepts/11_persistent_storage/states_resources_shared_directory.mdx#shared-directory)です。

既定では、Windmill のフローは[結果を受け渡す](#各段のあいだでデータをどう受け渡すか)形になっています。ある段は、前の段の結果を入力として受け取ります。軽い自動化ならこれで十分です。

重い ETL や、JSON に向かない出力を扱うときは、`共有ディレクトリ` を使って段のあいだでデータを渡せます。各段は `./shared` というフォルダを共有していて、そこに大きめのデータを置いて次の段へ渡せます。

詳しくは[永続化とデータベースのページ](../../core_concepts/11_persistent_storage/index.mdx)を参照してください。

![Flows shared directory](./flows_shared_directory.png.webp)

<div className="grid grid-cols-2 gap-6 mb-4">
	- [永続化とデータベース](https://www.windmill.dev/docs/core_concepts/persistent_storage) —— データを安全に保管し、必要なときに取り出せるようにする。
</div>

### worker グループ

フローの水準で [worker グループ](../../core_concepts/9_worker_groups/index.mdx)を指定すると、そのフローの中のどの段も、**段ごとの指定に関わらず**その worker グループで走ります。指定しなければ、フローの制御は既定の worker グループ `flow` が実行し、各段はそれぞれの worker グループで実行されます。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [worker と worker グループ](https://www.windmill.dev/docs/core_concepts/worker_groups) —— worker グループを使うと、性能の異なる複数の機械でスクリプトとフローを走らせられる。
</div>

このメニューには、左上の `設定（Settings）` か、[ツールバー](../../flows/3_editor_components.mdx#toolbar)のフロー名から、いつでも戻れます。

## 各段のあいだでデータをどう受け渡すか

Windmill のフローは汎用で再利用できるものなので、入力を外に出しています。入力と出力は互いにつながります。

入力は次のいずれかです。

- 静的な値: 段の入力欄に直接書いた固定値（文字列、数値、JSON など）。実行のたびに変わらない定数です。
- [フローの環境変数](../../flows/3_editor_components.mdx#flow-env-variables): フロー全体の定数で、どの段からも `flow_env.VARIABLE_NAME` で参照できます。文字列・JSON・[リソース](../../core_concepts/3_resources_and_types/index.mdx)を扱えます。
- [他と動的につながった値](../../flows/16_architecture.mdx): 結果が [JSON オブジェクト](../../core_concepts/13_json_schema_and_parsing/index.mdx)なので、どの段の出力も参照できます。
  参照のしかたは 2 通りです。
  - 段に付いている id を使う
  - プラグの絵をクリックして、フローの入力や前の段の結果から選ぶ（フローか段をテストした後）

<div className="grid grid-cols-2 gap-6 mb-4">
	- [構造とデータの受け渡し](https://www.windmill.dev/docs/flows/architecture) —— ワークフローは OpenFlow 形式の、JSON にできる値である。
</div>

## フローエディタ

エディタの左側には、フローの図が出ます。ここでフローの構造を組み、各段に対して操作します。

![Flow editor menu](./flow_editor_menu.png.webp)

:::tip 使いこなしのコツ
[付箋](../../flows/24_sticky_notes.mdx)で自由な位置にメモや TODO を置き、[フローグループ](../../flows/1_flow_editor.mdx#flow-groups)で関連する段を視覚的にまとめると、フローを整理して読める状態に保てます。
:::

スクリプトには 5 種類あります —— [アクション](../../flows/3_editor_components.mdx#flow-actions)、[トリガー](../../flows/10_flow_trigger.mdx)、[承認](../../flows/11_flow_approval.mdx)、[エラーハンドラ](../../flows/7_flow_error_handler.md)、[前処理](../../core_concepts/43_preprocessors/index.mdx)。好きな順に並べられます。既定はアクションです。

各スクリプトはワークスペースからも [Hub](https://hub.windmill.dev/) からも呼べますし、その場に直接書くこともできます。

![Import or write scripts](./import_or_write_scripts.png.webp)

<br />

フローは[さまざまな機能](../../flows/1_flow_editor.mdx)で深められます。主なものを以下に挙げます。

### for ループ

[for ループ](../../flows/12_flow_loops.md)は特別な種類の段で、反復子の式で与えた一覧を順に処理します。

![Flows For loops](./for_loops.png.webp)

<div className="grid grid-cols-2 gap-6 mb-4">
	- [for ループ](https://www.windmill.dev/docs/flows/flow_loops) —— 一連の処理を繰り返す。
</div>

### while ループ

while ループは、利用者が止めるか、[早期停止](../../flows/2_early_stop.md)を設定した段が止めるまで、処理を繰り返し続けます。

<video
	className="border-2 rounded-xl object-cover w-full h-full dark:border-gray-800"
	controls
	src="/videos/while_early_stop.mp4"
/>

<br />

<div className="grid grid-cols-2 gap-6 mb-4">
	- [while ループ](https://www.windmill.dev/docs/flows/while_loops) —— 利用者が止めるか、早期停止を設定した段が止めるまで、処理を繰り返し続ける。
</div>

### 分岐

[分岐](../../flows/13_flow_branches.md)は条件に応じて処理を分け、込み入ったワークフローを組み立てるためのものです。2 種類あります。

- [Branch one](../../flows/13_flow_branches.md#branch-one): 条件が真のときに、その枝を実行します。
- [Branch all](../../flows/13_flow_branches.md#branch-all): すべての枝を並列に実行します。各枝がそれぞれフローであるかのように扱われます。

![Flow branching](flow_branches.png.webp)

<div className="grid grid-cols-2 gap-6 mb-4">
	- [分岐](https://www.windmill.dev/docs/flows/flow_branches) —— 条件に応じてフローの実行を分ける。
</div>

### 再試行

各段では、個々のスクリプトの `詳細（Advanced）` タブから[再試行の回数を決められます](../../flows/14_retries.md)。設定しておくと、エラーのときにその段が、指定した間隔と上限回数のもとで再試行されます。

![Flows retries](./flows_retries.png.webp)

<div className="grid grid-cols-2 gap-6 mb-4">
	- [再試行](https://www.windmill.dev/docs/flows/retries) —— エラーのときに段を試し直す。
</div>

### 中断と承認の段

各段には[承認スクリプト](../../flows/11_flow_approval.mdx)を足せます。フローに対する安全性と統制を保つためのものです。

承認の依頼はメールでも Slack でも、何でも送れます。承認の段の後は、秘密の webhook でワークフローを自動的に再開できます。

![Approval step diagram](../../assets/flows/approval_diagram.png '承認の段の図')

<br />

<div className="grid grid-cols-2 gap-6 mb-4">
	- [中断と承認・確認](https://www.windmill.dev/docs/flows/flow_approval) —— 承認や取り消しといった出来事を受け取るまで、フローを止めておく。
</div>

フローの機能は[専用の節](../../flows/1_flow_editor.mdx)にすべてまとまっています。

## 起こしかた

Windmill でフローを起こす方法はいくつもあります。

1. いちばん直接なのは、[Windmill が自動生成する UI](../../core_concepts/6_auto_generated_uis/index.mdx) からです。フローエディタで見えるのがそれです。
2. 似ていてより作り込めるのが、[アプリエディタ](../7_apps_quickstart/index.mdx)で作る Windmill のアプリからです。
3. 上で見たとおり、[スケジュール](../../core_concepts/1_scheduling/index.mdx)でも起こせます。実行の様子は[実行履歴](../../core_concepts/5_monitor_past_and_future_runs/index.mdx)のページで確認できます。スケジュールの特別な使い方として、[トリガースクリプト](../../flows/10_flow_trigger.mdx)と組み合わせる手があります。
4. [CLI からフローを実行して](../../advanced/3_cli/index.mdx)、端末から起こす。
5. [別のフローから起こす](../../triggers/index.mdx#trigger-from-flows)。
6. [トリガースクリプト](../../flows/10_flow_trigger.mdx)を使い、条件が満たされたときだけ起こす。
7. [webhook](../../core_concepts/4_webhooks/index.mdx)。アプリで作った各フローには webhook が自動生成されます。フローを保存すると見られます。[Slack から離れずにフローを起こす](/blog/handler-slack-commands)こともできます。

起こし方はテストモードで試せます。

<iframe
	style={{ aspectRatio: '16/9' }}
	src="https://www.youtube.com/embed/nI3P3q4Okx8"
	title="YouTube video player"
	frameBorder="0"
	allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
	allowFullScreen
	className="border-2 rounded-lg object-cover w-full dark:border-gray-800"
></iframe>

<br />

<div className="grid grid-cols-2 gap-6 mb-4">
	- [フローの起こしかた](../../triggers/index.mdx) —— スクリプトとフローを、必要なとき・スケジュール・外部の出来事で起こす。
</div>

## フローをテストする

フローエディタの機能を一度に全部知る必要はありません。各段で、作っているものをその都度テストして、手綱を握ったまま進めてください。ある操作（x）をクリックして `x までテスト` を選べば、そこまでを試すこともできます。

<video
	className="border-2 rounded-lg object-cover w-full h-full dark:border-gray-800"
	autoPlay
	controls
	src="/videos/test_flow.mp4"
/>

<br />

<div className="grid grid-cols-2 gap-6 mb-4">
	- [フローのテスト](https://www.windmill.dev/docs/flows/test_flows) —— 手早く回して、フローのテストを掌握する。
</div>

出来上がったらフローを[配備](../../core_concepts/0_draft_and_deploy/index.mdx)し、スケジュールを付け、[そこからアプリを作り](../../core_concepts/6_auto_generated_uis/index.mdx)、あるいは [Hub に公開](../../misc/1_share_on_hub/index.md)することもできます。

フローエディタについては[詳しい節](../../flows/1_flow_editor.mdx)を参照してください。

## コードとしてのフロー

分散して動くプログラムを書く方法は、フローだけではありません。もう 1 つのやり方は、仕事とその依存関係を定義するプログラムを書き、それを [Python](../0_scripts_quickstart/2_python_quickstart/index.mdx) か [TypeScript](../0_scripts_quickstart/1_typescript_quickstart/index.mdx) のスクリプトとして実行することです。これを workflows as code と呼びます。

![Flow as code](../../core_concepts/31_workflows_as_code/wac-editor-1.png)

<div className="grid grid-cols-2 gap-6 mb-4">
	- [コードとしてのワークフロー](https://www.windmill.dev/docs/core_concepts/workflows_as_code) —— コードだけで、処理とその流れを自動化する。
</div>
