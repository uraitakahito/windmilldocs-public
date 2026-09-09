---
title: TypeScript クイックスタート
description: 'Windmill で TypeScript のスクリプトを書くには。Bun・Node.js・Deno のランタイムで作り、テストし、配備する。'
slug: '/getting_started/scripts_quickstart/typescript'
---

> **[原文](./index.mdx)の日本語訳。** 相違があれば原文が正。
> 原典 © Windmill Labs, Inc. — [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。この訳も同じライセンスで提供します。

# TypeScript クイックスタート

この手引きでは、最初のスクリプトを TypeScript で書きます。Windmill が使える TypeScript のランタイムは [Bun](https://bun.sh/)・[Node.js](#nodejs)・[Deno](https://deno.land/) です。

<iframe
	style={{ aspectRatio: '16/9' }}
	src="https://www.youtube.com/embed/QRf8C8qF7CY"
	title="Scripts quickstart"
	frameBorder="0"
	allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
	allowFullScreen
	className="border-2 rounded-lg object-cover w-full dark:border-gray-800"
></iframe>

<br/>

ここでは Windmill の web IDE で、TypeScript の簡単な「Hello World」を作ります。依存関係の扱いは標準の方式（import から推論して、スクリプトごとに lockfile を持つ）です。[手元で開発する](../../../advanced/4_local_development/index.mdx)方法や、[TypeScript で依存関係を扱う](../../../advanced/14_dependencies_in_typescript/index.mdx)他の方式は、それぞれの節を参照してください。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [手元での開発](https://www.windmill.dev/docs/advanced/local_development) —— 端末・VS Code・JetBrains の IDE など、さまざまな環境から開発する。
	- [TypeScript の依存関係](https://www.windmill.dev/docs/advanced/dependencies_in_typescript) —— TypeScript のスクリプトで依存関係をどう扱うか。
</div>

スクリプトは Windmill の基本の部品です。単体で[実行・スケジュール](../../../triggers/index.mdx)できますし、つなげて[フロー](../../../flows/1_flow_editor.mdx)にすることも、専用の UI を付けて[アプリ](../../7_apps_quickstart/index.mdx)として見せることもできます。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [スクリプトエディタ](../../../script_editor/index.mdx) —— スクリプトのすべて。
	- [トリガー](../../../triggers/index.mdx) —— スクリプトとフローを、必要なとき・スケジュール・外部の出来事で起こす。
</div>

スクリプトは 2 つの部分でできています。

- [コード](#コード): TypeScript のスクリプトでは、少なくとも `main` 関数が要ります。
- [設定](#設定): パス・要約・説明・入力の [JSON Schema](../../../core_concepts/13_json_schema_and_parsing/index.mdx)（署名から推論されます）といった、スクリプトの設定とメタデータ。

コードリポジトリに保存すると、この 2 つは `<path>.ts` と `<path>.script.yaml` に分かれて置かれます。

Windmill で TypeScript で組んだスクリプトの簡単な例が[こちら](https://hub.windmill.dev/scripts/slack/1284/send-message-to-channel-slack)にあります。

```ts
import { WebClient } from '@slack/web-api';

type Slack = {
	token: string;
};

export async function main(slack: Slack, channel: string, message: string): Promise<void> {
	// Initialize the Slack WebClient with the token from the Slack resource
	const web = new WebClient(slack.token);

	// Use the chat.postMessage method from the Slack WebClient to send a message
	await web.chat.postMessage({
		channel: channel,
		text: message
	});
}
```

この手引きでは、実行した人に挨拶するスクリプトを作ります。

ホーム画面で **新規（New）** をクリックし、**スクリプト（Script）** を選びます。スクリプト作成の最初の段階、[メタデータ](../../../script_editor/settings.mdx#metadata)に進みます。

## 設定

![New script](../../../../static/images/script_languages.png "New script")

[設定](../../../script_editor/settings.mdx)メニューの一部として、各スクリプトにはメタデータが付いており、細かく定義・設定できます。

- **要約（Summary）**（任意）はスクリプトの短い説明で、人が読むためのものです。Windmill 全体で見出しとして表示されます。省略すると、既定で `path` が使われます。
- **パス（Path）**はスクリプトを一意に指す識別子で、[スクリプトの所有者](../../../core_concepts/16_roles_and_permissions/index.mdx)と名前からなります。所有者はユーザーか、グループ（[フォルダ](../../../core_concepts/8_groups_and_folders/index.mdx#folders)）です。
- **説明（Description）**では、[自動生成される UI](../../../core_concepts/6_auto_generated_uis/index.mdx) を通じて、使う人に実行のしかたを伝えられます。markdown が使えます。
- スクリプトの**言語**。
- **スクリプトの種類**: アクション（既定）、[トリガー](../../../flows/10_flow_trigger.mdx)、[承認](../../../flows/11_flow_approval.mdx)、[エラーハンドラ](../../../flows/7_flow_error_handler.md)、[前処理](../../../core_concepts/43_preprocessors/index.mdx)。[フローエディタ](../../6_flows_quickstart/index.mdx)で適切なスクリプトを絞り込むための札として働きます。

このメニューには [ランタイム](../../../script_editor/settings.mdx#runtime)・[生成される UI](#生成される-ui)・[トリガー](../../../script_editor/settings.mdx#triggers)の設定もあります。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [設定](../../../script_editor/settings.mdx) —— 各スクリプトにはメタデータと設定が付いており、細かく定義・設定できる。
</div>

では左側のコードエディタに移ります。

## コード

Windmill にはスクリプトを書くためのオンラインエディタがあります。左側がエディタ本体です。右側は、スクリプトの署名から Windmill が[生成する UI の下見](../../../core_concepts/6_auto_generated_uis/index.mdx)で、これがスクリプトを使う人に見えるものです。その UI を確かめ、値を入れて、[その場でテスト](#その場での確認とテスト)できます。

![Demo TS](./demo_ts.png 'Demo TS')

<div className="grid grid-cols-2 gap-6 mb-4">
	- [コードエディタ](../../../code_editor/index.mdx) —— コードエディタは Windmill に統合された開発環境。
	- [自動生成される UI](https://www.windmill.dev/docs/core_concepts/auto_generated_uis) —— Windmill はスクリプトとフローの引数から、UI を自動で作る。
</div>

TypeScript のランタイムは 2 つから選べます。

- Bun（必要なら [Node.js](#nodejs) モードも）
- [Deno](#deno)

この例では `TypeScript (Bun)` を選んだので、Windmill が雛形を用意してくれています。見てみましょう。

```typescript
// there are multiple modes to add as header: //nobundling //native //npm //nodejs
// https://www.windmill.dev/docs/getting_started/scripts_quickstart/typescript#modes

// import { toWords } from "number-to-words@1"
import * as wmill from "windmill-client"

// fill the type, or use the +Resource type to get a type-safe reference to a resource
// type Postgresql = object


export async function main(
  a: number,
  b: "my" | "enum",
  //c: Postgresql,
  //d: wmill.S3Object, // https://www.windmill.dev/docs/core_concepts/persistent_storage/large_data_files 
  //d: DynSelect_foo, // https://www.windmill.dev/docs/core_concepts/json_schema_and_parsing#dynamic-select
  e = "inferred type string from default arg",
  f = { nested: "object" },
  g: {
    label: "Variant 1",
    foo: string
  } | {
    label: "Variant 2",
    bar: number
  }
) {
  // let x = await wmill.getVariable('u/user/foo')
  return { foo: a };
}
```

Windmill のスクリプトには、入口となる `main` 関数が要ります。`main` について押さえておくべき点がいくつかあります。

- `main` の引数は次の 2 つを作るのに使われます。
  1.  スクリプトの[入力仕様](../../../core_concepts/13_json_schema_and_parsing/index.mdx)
  2.  スクリプトを単体のアプリとして実行したときに見える[画面](../../../core_concepts/6_auto_generated_uis/index.mdx)
- 型注釈は UI の入力欄を作るのに使われ、入力の事前検査にも役立ちます。必須ではありませんが、強く勧めます。UI は後の段階で調整できます（ただし入力の型は変えられません）。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [JSON schema と解釈](https://www.windmill.dev/docs/core_concepts/json_schema_and_parsing) —— JSON Schema は、スクリプトとフローの入力仕様を定め、リソースの型を指定するために使われる。
</div>

コメントアウトされた import の行も見てください。TypeScript では[依存関係](../../../advanced/14_dependencies_in_typescript/index.mdx)とその版がスクリプトの中に収まるので、追加の手順は要りません。TypeScript のランタイムは Bun で、コードを一切変えずに Node.js と互換です。npm の import をそのまま書けます。最後の import は Windmill のクライアントで、たとえば[変数](../../../core_concepts/2_variables_and_secrets/index.mdx)や[リソース](../../../core_concepts/3_resources_and_types/index.mdx)を使うときに要ります。ここでは深入りしません。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [依存関係の管理と import](https://www.windmill.dev/docs/advanced/imports) —— package.json を直接管理せずにスクリプトを動かせることが、Windmill の強み。
	- [TypeScript クライアント](https://www.windmill.dev/docs/advanced/clients/ts_client) —— Bun / Deno のランタイムで、TypeScript から Windmill を操作するためのクライアント。
</div>

「Hello World」に戻ります。使っていない import を消し、`main` が利用者の名前を受け取るようにします。`name` を返しておきましょう —— このスクリプトを[フロー](../../../flows/1_flow_editor.mdx)や[アプリ](../../../full_code_apps/index.mdx)の中で使い、結果を次へ渡したくなるかもしれません。

```typescript
export async function main(name: string) {
	console.log("Hello world! Oh, it's you %s? Greetings!", name);
	return { name };
}
```

## モード

### 事前バンドルと nobundling

Windmill は配備の時点で、[Bun のバンドラ](https://bun.sh/docs/bundler)を使ってスクリプトを[事前にバンドル](/changelog/pre-bundle-bun-scripts)します。メモリの使用量が減り、実行が速くなります。これを止めたい場合は、スクリプトの先頭に次のコメントを置きます。

```ts
//nobundling
```

### Native

Windmill には、機能は少ないぶん軽く、v8 に直接つないでスクリプトを走らせるランタイムもあります。使うには、スクリプトの先頭に次のコメントを置きます。

```ts
//native
```

詳しくは [Rest](../6_rest_grapqhql_quickstart/index.mdx) のスクリプトを参照してください。あれは中身としては `//native` を付けた Bun の TypeScript です。

### NodeJS

Windmill には本物の Node.js 互換モードがあります。既存の Node.js のコードを、手を加えずに動かせます。

必要なのは、ランタイムに `TypeScript (Bun)` を選び、先頭行に次を書くことだけです。

```ts
//nodejs
```

![Nodejs Compatibility](./nodejs_compatibility.png 'Nodejs Compatibility')

これは別のランタイム（Node.js）を使うための逃げ道ですが、内部で Bun を経由するので Deno や Bun より遅くなります。

この機能は[クラウドプランとセルフホストの Enterprise 版](/pricing)限定です。

### Npm

同じように、依存関係の導入に `bun install` ではなく `npm install` を使えます。bun が対応していない場合の逃げ道として役立ちます。

```ts
//npm
```

これも[クラウドプランとセルフホストの Enterprise 版](/pricing)限定です。

### Deno

言語として `TypeScript (Bun)` ではなく `TypeScript (Deno)` を選ぶこともできます。流れは Bun と同じ（[上](#コード)を参照）で、入口となる `main` 関数、署名から[自動生成される UI](../../../core_concepts/6_auto_generated_uis/index.mdx)、import から直接解決される[依存関係](../../../advanced/14_dependencies_in_typescript/index.mdx)、という形です。Bun との違いは次のとおりです。

- import の解決は [Deno](https://deno.com/runtime) が行うので、npm の import には `npm:` を前に付けます（例: `import * as wmill from "npm:windmill-client@1.525.0"`）。`https://` と `jsr:` の import も使えます。
- Bun 固有の[モード](#モード)（`//nobundling`・`//native`・`//nodejs`・`//npm`）は使えません。

```typescript
// Deno uses "npm:" prefix to import from npm (https://deno.land/manual@v1.36.3/node/npm_specifiers)
// import * as wmill from "npm:windmill-client@1.525.0"

export async function main(
  a: number,
  b: "my" | "enum",
  d = "inferred type string from default arg",
  e = { nested: "object" },
) {
  // let x = await wmill.getVariable('u/user/foo')
  return { foo: a };
}
```

## その場での確認とテスト

右側の UI の下見を見てください。入力の署名に合わせて更新されています。テストを実行して（`Ctrl` + `Enter`）、動くことを確かめましょう。

<video
	className="border-2 rounded-lg object-cover w-full h-full dark:border-gray-800"
	controls
	src="/videos/auto_g_ui_landing.mp4"
/>

<br />

`main` の署名を変えれば、UI の振る舞いも変わります。たとえば `name` に既定値を付けると、UI はその欄を必須として扱わなくなります。

```typescript
main(name: string = "you")
```

<div className="grid grid-cols-2 gap-6 mb-4">
	- [その場での確認とテスト](https://www.windmill.dev/docs/core_concepts/instant_preview) —— Windmill は統合されたエディタに加えて、配備の前でも、作っているものをその場で見て試せるようにしている。
</div>

では最後の段階、「生成される UI」の設定に進みます。

## 生成される UI

設定メニューの「生成される UI（Generated UI）」タブでは、スクリプトの引数を調整できます。

UI はスクリプトの `main` 関数の署名から作られますが、ここで制約を足せます。たとえば `プロパティを調整（Customize property）` から `パターン（Pattern）` をクリックして正規表現を書き、英数字だけの名前を求められます: `^[A-Za-z0-9]+$`。数字も許しておきましょう —— どこかの技術系の富豪の子かもしれませんから。

![Advanced settings for TypeScript](./customize_ts.png.webp)

<div className="grid grid-cols-2 gap-6 mb-4">
	- [スクリプトの種類](../../../script_editor/script_kinds.mdx) —— スクリプトを特定の種類に специализ することで、追加の働きを持たせられる。
	- [生成される UI](../../../script_editor/customize_ui.mdx) —— main 関数の引数には詳細な設定を与えられ、入力の自動生成 UI と JSON Schema に反映される。
</div>

## コードとしてのワークフロー

別々の仕事を実行する分散プログラムを書く方法の 1 つは、スクリプトをつなぐ[フロー](../../../flows/1_flow_editor.mdx)を使うことです。

もう 1 つは、仕事とその依存関係を定義するプログラムを書き、それをスクリプトの中で直接実行することです。これを[コードとしてのワークフロー](../../../core_concepts/31_workflows_as_code/index.mdx)と呼びます。全体を統べる関数を `workflow()` で包み、個々の仕事の関数に `task()` を付けます。各 task は独自のログと時系列の記録を持つ別の job として走り、その間ワークフローは中断します（worker の枠を解放します）。

![Flow as code in TypeScript](./flow_as_code_ts.png 'Flow as code in TypeScript')

詳しくは次を参照してください。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [コードとしてのワークフロー](https://www.windmill.dev/docs/core_concepts/workflows_as_code) —— TypeScript か Python で、チェックポイントに基づく制御・並列実行・障害への耐性を備えた分散ワークフローを書く。
</div>

## 実行する

これで完成です。次は、このスクリプトを使う人の側を見てみましょう。[配備（Deploy）](../../../core_concepts/0_draft_and_deploy/index.mdx)ボタンを押して読み込みます。さきほど定義した入力欄が出ます。

Windmill のスクリプトは[版管理されて](../../../core_concepts/34_versioning/index.mdx#script-versioning)おり、各版はハッシュで一意に識別されます。

入力欄を埋めて「実行（Run）」を押します。実行の様子とログが出ます。すべての実行は左側の[実行履歴](../../../core_concepts/5_monitor_past_and_future_runs/index.mdx)メニューからも見られます。

![Run hello world in TypeScript](./run_ts.png.webp)

用意されたコマンドを使って、[CLI からスクリプトを実行する](../../../advanced/3_cli/index.mdx)こともできます。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [トリガー](../../../triggers/index.mdx) —— スクリプトとフローを、必要なとき・スケジュール・外部の出来事で起こす。
</div>

## キャッシュ

Bun のバンドルは既定でディスクにキャッシュされます。さらに[分散キャッシュの保管](../../../core_concepts/38_object_storage_in_windmill/index.mdx#instance-object-storage-distributed-cache-for-python-rust-go)を使えば、他のすべての worker からも使えるようになり、どの worker でも起動が速くなります。

## 次は

このスクリプトは動く最小の例ですが、実際の用途ではさらにいくつかの段階が役に立ちます。

- スクリプトに[変数と秘密](../../../core_concepts/2_variables_and_secrets/index.mdx)を渡す。
- [リソース](../../../core_concepts/3_resources_and_types/index.mdx)につなぐ。
- [スクリプトを起こす](../../../triggers/index.mdx)方法はいくつもあります。
- スクリプトを[フロー](../../../flows/1_flow_editor.mdx)や[アプリ](../../7_apps_quickstart/index.mdx)に組み合わせる。
- [Windmill Hub](https://hub.windmill.dev) でスクリプトを[共有](../../../misc/1_share_on_hub/index.md)できます。投稿されたものは、Windmill の中で誰でも使えるようになる前に、管理者が確認します。

スクリプトは不変で、配備するたびにハッシュが付きます。上書きされることはなく、パスでスクリプトを指すことは、そのパスに最後に配備されたハッシュを指すことを意味します。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [版管理](https://www.windmill.dev/docs/core_concepts/versioning#script-versioning) —— 配備されたスクリプトは、ハッシュで指される親のスクリプトを持ちうる。
</div>

各スクリプトには、署名から推論された JSON schema をもとに UI が自動生成されます。それは単体でも調整できますし、[アプリビルダー](../../7_apps_quickstart/index.mdx)で作り込んだ UI に埋め込むこともできます。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [自動生成される UI](https://www.windmill.dev/docs/core_concepts/auto_generated_uis) —— Windmill はスクリプトとフローの引数から、UI を自動で作る。
	- [生成される UI](../../../script_editor/customize_ui.mdx) —— main 関数の引数には詳細な設定を与えられ、入力の自動生成 UI と JSON Schema に反映される。
</div>

UI に加えて、配備のたびに同期・非同期の [webhook](../../../core_concepts/4_webhooks/index.mdx) も作られます。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [webhook](https://www.windmill.dev/docs/core_concepts/webhooks) —— webhook からスクリプトとフローを起こす。
</div>
