---
title: Rest / GraphQL クイックスタート
description: 'Windmill で REST と GraphQL のリクエストを送るには。組み込みのリクエスト処理を使って API のスクリプトを作る。'
slug: '/getting_started/scripts_quickstart/rest_graphql'
---

> **[原文](./index.mdx)の日本語訳。** 相違があれば原文が正。
> 原典 © Windmill Labs, Inc. — [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。この訳も同じライセンスで提供します。

# Rest / GraphQL クイックスタート

この手引きでは、最初のスクリプトを [Rest](https://restfulapi.net/) と [GraphQL](https://graphql.org/) で書きます。

<video
	className="border-2 rounded-lg object-cover w-full h-full dark:border-gray-800"
	autoPlay
	controls
	id="main-video"
	src="/videos/rest_example_intro.mp4"
/>

<br />

ここでは Windmill の web IDE で簡単なスクリプトを作ります。[手元で開発する](../../../advanced/4_local_development/index.mdx)方法は、専用の節を参照してください。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [手元での開発](https://www.windmill.dev/docs/advanced/local_development) —— 端末・VS Code・JetBrains の IDE など、さまざまな環境から開発する。
</div>

スクリプトは Windmill の基本の部品です。単体で[実行・スケジュール](../../../triggers/index.mdx)できますし、つなげて[フロー](../../../flows/1_flow_editor.mdx)にすることも、専用の UI を付けて[アプリ](../../7_apps_quickstart/index.mdx)として見せることもできます。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [スクリプトエディタ](../../../script_editor/index.mdx) —— スクリプトのすべて。
	- [トリガー](../../../triggers/index.mdx) —— スクリプトとフローを、必要なとき・スケジュール・外部の出来事で起こす。
</div>

スクリプトは 2 つの部分でできています。

- [コード](#コード)。
- [設定](#設定): パス・要約・説明・入力の [JSON Schema](../../../core_concepts/13_json_schema_and_parsing/index.mdx)（署名から推論されます）といった、スクリプトの設定とメタデータ。

コードリポジトリに保存すると、この 2 つは `<path>.rest` と `<path>.script.yaml` に分かれて置かれます。

Windmill で Rest で組んだスクリプトの簡単な例を挙げます。

```ts
export async function main() {
	const res = await fetch('https://api.supabase.com/v1/organizations', {
		headers: {
			Authorization: `Bearer <your_supabase_token>`,
			'Content-Type': 'application/json'
		}
	});
	return res.json();
}
```

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

Windmill にはスクリプトを書くためのオンラインエディタがあります。左側がエディタ本体です。右側は、スクリプトの署名から
Windmill が[生成する UI の下見](../../../core_concepts/6_auto_generated_uis/index.mdx)で、これがスクリプトを使う人に
見えるものです。その UI を確かめ、値を入れられます。

![Editor for GraphQL](./editor_graphql.png 'Code editor GraphQL')

<div className="grid grid-cols-2 gap-6 mb-4">
	- [コードエディタ](../../../code_editor/index.mdx) —— コードエディタは Windmill に統合された開発環境。
	- [自動生成される UI](https://www.windmill.dev/docs/core_concepts/auto_generated_uis) —— Windmill はスクリプトとフローの引数から、UI を自動で作る。
</div>

### Rest

この例では `Rest` を選んだので、Windmill が雛形を用意してくれています。見てみましょう。

```ts
//native
//you can add proxy support using //proxy http(s)://host:port

// native scripts are bun scripts that are executed on native workers and can be parallelized
// only fetch is allowed, but imports will work as long as they also use only fetch and the standard lib

//import * as wmill from "windmill-client"

export async function main(example_input: number = 3) {
  // "3" is the default value of example_input, it can be overridden with code or using the UI
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${example_input}`, {
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
}

```

Rest のスクリプトは、実のところ [Bun の TypeScript](../1_typescript_quickstart/index.mdx) による fetch です。
普通の TypeScript と同じ署名がひととおり使えますが、JavaScript は [stdlib](https://en.wikibooks.org/wiki/C_Programming/stdlib.h) の範囲だけで、あとは fetch の操作だけです（npm パッケージからの fetch や相対 import も含みます）。
たとえば [wmill API](../../../advanced/2_clients/ts_client.mdx) はすべて使えます。次のように書くだけです。

```ts
import * as wmill from './windmill.ts'
```

先頭の `// native` 行があるかどうかで、Windmill は 'nativets' と 'bun' のスクリプトを自動で行き来します。ですから、いつも TypeScript (Bun) を選んでおいて、最後に 'native' で速くできるかどうかを決められます。
REST のボタンは、`//native` を先頭に付けた Bun のスクリプトをあらかじめ入れておくだけのものです。

fetch は Windmill の普通の TypeScript でも（`//native` を付けずに）書けますが、専用の Rest スクリプトを選べば、
とても効率のよいランタイムの恩恵を受けられます。

#### 使える web プラットフォームのグローバル

native のスクリプトは、`fetch` と JavaScript の標準ライブラリだけを許す、効率のよいプロセス内ランタイムで動きます。標準ライブラリに加えて、このランタイムは web プラットフォーム標準のグローバルを公開しており、その顔ぶれは [Bun](../1_typescript_quickstart/index.mdx) の実行系と揃えてあります。ですから、それらに頼るコードは native と Bun のどちらで動かしても同じように振る舞います。

- テキストの符号化: `TextEncoder`、`TextDecoder`、`TextEncoderStream`、`TextDecoderStream`
- ストリーム: `ReadableStream`、`WritableStream`、`TransformStream`（対応する reader / controller の型と、`ByteLengthQueuingStrategy` / `CountQueuingStrategy` のキュー戦略を含む）
- イベント: `Event`、`EventTarget`、`CustomEvent`、`MessageEvent`、`CloseEvent`、`ErrorEvent`、`reportError`
- メッセージのやりとり: `MessageChannel`、`MessagePort`
- 圧縮: `CompressionStream`、`DecompressionStream`
- ファイルと複製: `File`、`structuredClone`
- URL の照合: `URLPattern`
- 時間の計測: `performance`（`performance.now()` と `performance.timeOrigin` を含む）
- `DOMException`

ですから `res.body instanceof ReadableStream` や `new TextEncoder().encode(...)` といった式が、Bun と同じように native のスクリプトでも動くようになりました。

`<jsonplaceholder>` の URL を使いたい API のエンドポイントに置き換え、headers のオブジェクトを fetch の必要に合わせて書き換えてください。

REST のスクリプトも、Windmill のどのスクリプトとも同じく[自動生成される UI](../../../core_concepts/6_auto_generated_uis/index.mdx) の力を借りられます。
`main` 関数の引数は、1. スクリプトの入力仕様と、2. スクリプトを単体のアプリとして実行したときに見える画面、
の 2 つを作るのに使われます。型注釈は UI の入力欄を作るのに使われ、入力の事前検査にも役立ちます。
必須ではありませんが、強く勧めます。UI は後の段階で調整できます（ただし入力の型は変えられません）。

自動生成される UI を通じて、使う人に[リソース](../../../core_concepts/3_resources_and_types/index.mdx)や[変数](../../../core_concepts/2_variables_and_secrets/index.mdx)を入れてもらうやり方でもあります。この UI はスクリプトエディタにあり、[コードをテストする](../../../core_concepts/23_instant_preview/index.mdx)のに使えます。

<video
	className="border-2 rounded-lg object-cover w-full h-full dark:border-gray-800"
	controls
	src="/videos/rest_supabase.mp4"
/>

<br />

> 上の例では、独自のリソースを main 関数の引数として宣言しています。自動生成される UI を通じて使う人に尋ね、スクリプトの中でそのまま使います（ここでは bearer token に）。

エンドポイントが独自の証明書を出す HTTPS のエンドポイントだと、fetch は失敗します。独自の証明書は `DENO_CERT` 環境変数で信頼させられます（[Deno の公式ドキュメント](https://docs.deno.com/runtime/manual/getting_started/setup_your_environment#environment-variables)を参照）。

<br />

<div className="grid grid-cols-2 gap-6 mb-4">
	- [その場での確認とテスト](https://www.windmill.dev/docs/core_concepts/instant_preview) —— Windmill は統合されたエディタに加えて、配備の前でも、作っているものをその場で見て試せるようにしている。
</div>

### GraphQL

この例では `GraphQL` を選んだので、Windmill が雛形を用意してくれています。見てみましょう。

```ts
query($name1: String, $name2: Int, $name3: [String]) {
	demo(example_name_1: $name1, example_name_2: $name2, example_name_3: $name3) {
		example_name_1,
		example_name_2,
		example_name_3
	}
}
```

クエリそのものは、普通の GraphQL のクエリと変わりません。

GraphQL のスクリプトを起こすには、どれも 'api' という名前の入力が要ります。これは次の JSON schema で定義された [GraphQL のリソース](https://hub.windmill.dev/resource_types/112/graphql)です。

```js
{
    "type": "object",
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "required": [
        "base_url"
    ],
    "properties": {
        "base_url": {
            "type": "string",
            "format": "uri",
            "default": "",
            "description": ""
        },
        "bearer_token": {
            "type": "string",
            "default": "",
            "description": ""
        },
        "custom_headers": {
            "type": "object",
            "description": "",
            "properties": {},
            "required": []
        }
    }
}
```

[リソース](../../../core_concepts/3_resources_and_types/index.mdx)は JSON で表された中身のあるオブジェクトで、設定や資格情報を保存できます。Windmill の中で保存し、名前を付け、共有できるので、GraphQL のスクリプトの実行を制御し、手際よく進められます。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [リソースとリソース型](https://www.windmill.dev/docs/core_concepts/resources_and_types) —— リソースは外部のシステムへの設定とつながりを構造化したもので、リソース型はそれぞれのリソースの schema を定める。
</div>

クエリの引数は、1. スクリプトの入力仕様と、2. [自動生成される UI](../../../core_concepts/6_auto_generated_uis/index.mdx) でスクリプトを実行したときに見える画面、
の 2 つを作るのに使われます。型注釈は UI の入力欄を作るのに使われ、入力の事前検査にも役立ちます。
必須ではありませんが、強く勧めます。UI は後の段階で調整できます（ただし入力の型は変えられません）。

この UI はスクリプトエディタにあり、[コードをテストする](../../../core_concepts/23_instant_preview/index.mdx)のに使えます。

<video
	className="border-2 rounded-lg object-cover w-full h-full dark:border-gray-800"
	controls
	src="/videos/graphql_example.mp4"
/>

<br />

> 上の例では、base URL と bearer token を書いた [GraphQL のリソース](https://hub.windmill.dev/resource_types/112/graphql)を使っています。引数 `login` を埋めるのには[自動生成される UI](../../../core_concepts/6_auto_generated_uis/index.mdx)を使いました。

## 生成される UI

設定メニューの「生成される UI（Generated UI）」タブでは、スクリプトの引数を調整できます。

UI はスクリプトの `main` 関数の署名から作られますが、ここで制約を足せます。たとえば `プロパティを調整（Customize property）` から `パターン（Pattern）` をクリックして正規表現を書き、英数字だけの名前を求められます: `^[A-Za-z0-9]+$`。数字も許しておきましょう —— どこかの技術系の富豪の子かもしれませんから。

![Advanced settings for TypeScript](./customize_graphql.png.webp)

<div className="grid grid-cols-2 gap-6 mb-4">
	- [スクリプトの種類](../../../script_editor/script_kinds.mdx) —— スクリプトを特定の種類に絞ることで、追加の働きを持たせられる。
	- [生成される UI](../../../script_editor/customize_ui.mdx) —— main 関数の引数には詳細な設定を与えられ、入力の自動生成 UI と JSON Schema に反映される。
</div>

## 実行する

これで完成です。次は、このスクリプトを使う人の側を見てみましょう。[配備（Deploy）](../../../core_concepts/0_draft_and_deploy/index.mdx)ボタンを押して
読み込みます。さきほど定義した入力欄が出ます。

Windmill のスクリプトは[版管理されて](../../../core_concepts/34_versioning/index.mdx#script-versioning)おり、
各版はハッシュで一意に識別されます。

入力欄を埋めて「実行（Run）」を押します。実行の様子とログが出ます。すべての実行は左側の
[実行履歴](../../../core_concepts/5_monitor_past_and_future_runs/index.mdx)メニューからも
見られます。

![Run hello world in GraphQL](./run_graphql.png.webp)

用意されたコマンドを使って、[CLI からスクリプトを実行する](../../../advanced/3_cli/index.mdx)こともできます。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [トリガー](../../../triggers/index.mdx) —— スクリプトとフローを、必要なとき・スケジュール・外部の出来事で起こす。
</div>

## 次は

このスクリプトは動く最小の例ですが、実際の用途ではさらにいくつかの段階が役に立ちます。

- スクリプトに[変数と秘密](../../../core_concepts/2_variables_and_secrets/index.mdx)を渡す。
- [リソース](../../../core_concepts/3_resources_and_types/index.mdx)につなぐ。
- [スクリプトを起こす](../../../triggers/index.mdx)方法はいくつもあります。
- スクリプトを[フロー](../../../flows/1_flow_editor.mdx)・[ローコードのアプリ](../../../apps/0_app_editor/index.mdx)・[フルコードのアプリ](../../../full_code_apps/index.mdx)に組み合わせる。
- [Windmill Hub](https://hub.windmill.dev) でスクリプトを[共有](../../../misc/1_share_on_hub/index.md)できます。投稿されたものは、
  Windmill の中で誰でも使えるようになる前に、管理者が確認します。

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
