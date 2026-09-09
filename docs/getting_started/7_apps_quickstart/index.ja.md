---
description: Windmill の（旧来の）ローコードのアプリエディタで社内ツールを作るには。部品をドラッグ＆ドロップして、データを扱うアプリやダッシュボードを作る。新しく作るならフルコードのアプリを。
---

> **[原文](./index.mdx)の日本語訳。** 相違があれば原文が正。
> 原典 © Windmill Labs, Inc. — [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。この訳も同じライセンスで提供します。

# アプリのクイックスタート（ローコード、旧来のもの）

:::info 旧来のもの

ローコードのアプリエディタは旧来のものです。新しく作るなら、React か Svelte を使う[フルコードのアプリ](../../full_code_apps/index.mdx)を勧めます。始め方は[フルコードのアプリのクイックスタート](../9_full_code_apps_quickstart/index.mdx)を参照してください。

:::

ローコードのアプリのクイックスタートへようこそ。このページを読めば、ドラッグ＆ドロップのアプリエディタで最初のアプリを数分で作れるようになります。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [フルコードのアプリのクイックスタート](https://www.windmill.dev/docs/getting_started/full_code_apps_quickstart) —— React や Svelte のほうがよいですか。Windmill の実行対象とデータのテーブルにつないだ、フルコードのアプリを作る。
</div>

動画のほうがよければ、アプリエディタの解説もあります。

<iframe
	style={{ aspectRatio: '16/9' }}
	src="https://www.youtube.com/embed/lxqdncP8XR4"
	title="App editor Tutorial"
	frameBorder="0"
	allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
	allowFullScreen
	className="border-2 rounded-lg object-cover w-full dark:border-gray-800"
></iframe>

<br />

Windmill は[スクリプトとフローに UI を自動生成](../../core_concepts/6_auto_generated_uis/index.mdx)しますが、それとは別に、自分の必要に合わせた社内向けのアプリも作れます。[ローコードのアプリエディタ](../../apps/0_app_editor/index.mdx)を使うか、React か Svelte で[フルコードのアプリ](../../full_code_apps/index.mdx)を作るかです。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [自動生成される UI](https://www.windmill.dev/docs/core_concepts/auto_generated_uis) —— Windmill はスクリプトとフローの引数から、UI を自動で作る。
	- [アプリエディタ](https://www.windmill.dev/docs/apps/app_editor) —— Windmill のアプリエディタの詳しい節。
	- [例: EC の CRM アプリ](https://www.windmill.dev/docs/apps/app_e-commerce) —— Windmill で CRM を作る手引き。
</div>

Windmill のアプリは、データの出どころ（web、社内、データ提供者など）とやり取りするための、作り込んだ UI です。技術者でない人に、こちらで用意したワークフローを使ってもらうのに向いています。

アプリについて覚えておくべきことは、要するに次の 3 つです。

- 見えているものがそのまま結果になります。
- アプリや部品を[データの出どころ](../../integrations/0_integrations_on_windmill.mdx)につなげます。
- 部品には Windmill の[スクリプト](../../getting_started/0_scripts_quickstart/index.mdx)と[フロー](../6_flows_quickstart/index.mdx)で力を持たせられます。

:::tip

アプリエディタについては、[詳しい節](../../apps/0_app_editor/index.mdx)を参照してください。

:::

最初のアプリは、[Hub](https://hub.windmill.dev/apps) から 1 つ選んで fork してもかまいません。ここでは自分のアプリを一から、順を追って組み立てます。

<a href="https://app.windmill.dev/" rel="nofollow">Windmill</a> のホーム画面で **新規（New）** をクリックし、**アプリ（ローコード）** を選んでください。始めましょう。

### ツールバー

始める前に、デスクトップ向けとモバイル向けのどちらを作るかを決めます。上部の該当するアイコンをクリックするだけです。

編集（Editor）と下見（Preview）を切り替えると、作っているものを一歩引いて眺められます。

![Toolbar](./toolbar.png.webp)

<div className="grid grid-cols-2 gap-6 mb-4">
	- [ツールバー](https://www.windmill.dev/docs/apps/toolbar) —— アプリのツールバーはエディタの上部にある。アプリの設定、デスクトップ／モバイルの切り替え、実行の調査ができる。
</div>

### 部品

アプリエディタはドラッグ＆ドロップで動きます。右側のメニューで部品をクリックすると[画面](../../apps/1_canvas.mdx)に置かれ、押したまま動かせば移動でき、`設定（Settings）` タブの下にある `部品を削除（Delete component）` で消せます。右下の取っ手を引けば大きさを変えられます。

部品が多くなったら、いくつかを固定（Anchor）して、他の部品に押しのけられないようにするとよいでしょう。

<video
	className="border-2 rounded-lg object-cover w-full h-full dark:border-gray-800"
	controls
	src="/videos/component_dd.mp4"
/>

<br />

部品の一覧は[このページ](../../apps/4_app_configuration_settings/1_app_component_library.mdx)にありますが、アプリエディタから直接見るほうが早いでしょう。部品はすぐに足せるので、要望があれば[声をかけてください](../../misc/6_getting_help/index.mdx)。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [部品の一覧](https://www.windmill.dev/docs/apps/app_configuration_settings/app_component_library) —— 使えるすべての部品の一覧。
</div>

### 部品にスクリプトで力を持たせる

Windmill のアプリエディタの真価は、スクリプトとワークフローを部品に組み込めることです。

<video
	className="border-2 rounded-lg object-cover w-full h-full"
	controls
	src="/videos/connecting_components.mp4"
/>

<br />

アプリエディタの下部に[実行対象のエディタ](../../apps/3_app-runnable-panel.mdx)があります。部品に結び付いたスクリプトやフロー（実行対象）と、[背後で動く実行対象](../../apps/3_app-runnable-panel.mdx#background-runnables)を、ここで作り・編集し・管理できます。

部品から `その場でスクリプトを作る（Create an inline script）` か `スクリプトかフローを選ぶ（Select a script or flow）`（ワークスペースか Hub から）をクリックすれば準備完了です。

![App Runnables panel](../../assets/apps/0_app_editor/app-sections.png)

各部品の[出力](../../apps/2_outputs.mdx)は左側のメニューで見られます。それぞれが部品に対応しています（部品の id を見てください）。

![App Outputs](../../assets/apps/0_app_editor/app-outputs.png.webp)

[入力はどの出力にもつなげます](../../apps/2_connecting_components/index.mdx)。部品で `つなぐ（Connect）` をクリックし、入力と出力を対応させてください。

<video
	className="border-2 rounded-lg object-cover w-full h-full dark:border-gray-800"
	controls
	src="/videos/connect_outputs.mp4"
/>

<br />

<div className="grid grid-cols-2 gap-6 mb-4">
	- [部品をつなぐ](https://www.windmill.dev/docs/apps/connecting_components) —— すべてを互いにつなげられることが、Windmill のアプリエディタの強み。
</div>

各部品に結び付いたアプリの入力は、ツールバーの `⋮` メニューにある `アプリの入力（App inputs）` タブで、いつでも確認できます。

![Apps inputs](./apps_inputs.png.webp)

<div className="grid grid-cols-2 gap-6 mb-4">
	- [実行対象のエディタ](https://www.windmill.dev/docs/apps/app-runnable-panel) —— アプリからスクリプトとフローを実行する。
	- [出力の手引き](https://www.windmill.dev/docs/apps/outputs) —— 部品の出力を扱う。
</div>

### 見た目を整える

[部品ごと](../../apps/4_app_configuration_settings/4_app_styling.mdx#component-level)には、`設定（Settings）` タブで見た目（色・大きさ・ラベルなど）を決められます。欄に直接書くか、独自の CSS を使います（部品の設定 — 見た目のタブ）。

![Customize components](./customize_component.png.webp)

[アプリ全体](../../apps/4_app_configuration_settings/4_app_styling.mdx#global-styling)には、CSS で統一した見た目を与えられます。`全体の見た目（Global Styling）` タブで、アプリ全体と部品の種類ごとに、欄か JSON で指定します。

![App styling](./customize_app.png.webp)

<div className="grid grid-cols-2 gap-6 mb-4">
	- [見た目の調整](https://www.windmill.dev/docs/apps/app_configuration_settings/app_styling) —— 自分たちの見た目の基準に合わせてアプリを整える。
</div>

### 試してみる

作っている途中でも、更新のボタンを押せば各部品を試せます。

画面の上にある更新ボタンでアプリ全体を一度に更新できますし、自動更新をスケジュールすることもできます。

![Refresh app](./refresh_app.png.webp)

いちばん手軽なのは、たぶん[下見](../../apps/0_toolbar.mdx#preview-mode)することです。

![App previewed](./app_previewed.png 'App previewed')

不具合を疑うときは、`実行の調査（Debug runs）` タブで過去の実行を部品ごとに詳しく見られます。

![Debug runs](./debug_runs.png.webp)

<div className="grid grid-cols-2 gap-6 mb-4">
	- [不具合を追う](https://www.windmill.dev/docs/apps/app_debugging) —— アプリの不具合に対処する。
</div>

### そのあとは

編集している間、アプリは[下書き](../../core_concepts/0_draft_and_deploy/index.mdx#draft)として自動的に保存されます。準備ができたら、はっきりした名前を付けて今の版を[配備](../../core_concepts/0_draft_and_deploy/index.mdx#deployed-version)し、使えるようにします。以後の変更は[差分の表示](../../apps/0_toolbar.mdx#diff)で確認でき、戻すこともできます。

保存すればもう使えます。`公開（Publish）` することも、`Hub に公開` することもできますし、`⋮` タブから JSON か Hub 向けの JSON として書き出せます。

アプリエディタについては[詳しい節](../../apps/0_app_editor/index.mdx)を参照してください。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [下書きと配備](https://www.windmill.dev/docs/core_concepts/draft_and_deploy) —— アプリを下書きし、配備する。
	- [アプリエディタ](https://www.windmill.dev/docs/apps/app_editor) —— Windmill のアプリエディタの詳しい節。
	- [例: EC の CRM アプリ](https://www.windmill.dev/docs/apps/app_e-commerce) —— Windmill で CRM を作る手引き。
</div>
