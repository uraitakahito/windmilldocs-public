---
title: 'Ruby クイックスタート'
description: 'Windmill で Ruby のスクリプトを書くには。gem による依存関係の管理とあわせて、作り、テストし、配備する。'
slug: '/getting_started/scripts_quickstart/ruby'
---

> **[原文](./index.mdx)の日本語訳。** 相違があれば原文が正。
> 原典 © Windmill Labs, Inc. — [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。この訳も同じライセンスで提供します。

# Ruby クイックスタート

この手引きでは、最初のスクリプトを [Ruby](https://www.ruby-lang.org/) で書きます。

<div className="mb-4">
	<video
		className="border-2 rounded-xl object-cover w-full h-full dark:border-gray-800"
		autoPlay
		loop
		controls
		src="/videos/ruby.mp4"
		alt="Ruby Demo"
		muted
	/>
</div>


<div className="grid grid-cols-2 gap-6 mb-4">
	- [手元での開発](https://www.windmill.dev/docs/advanced/local_development) —— 端末・VS Code・JetBrains の IDE など、さまざまな環境から開発する。
	- [Ruby の依存関係](https://www.windmill.dev/docs/getting_started/scripts_quickstart/ruby#dependencies-management) —— Ruby のスクリプトで依存関係をどう扱うか。
</div>

スクリプトは Windmill の基本の部品です。単体で[実行・スケジュール](../../../triggers/index.mdx)できますし、つなげて[フロー](../../../flows/1_flow_editor.mdx)にすることも、専用の UI を付けて[アプリ](../../7_apps_quickstart/index.mdx)として見せることもできます。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [スクリプトエディタ](../../../script_editor/index.mdx) —— スクリプトのすべて。
	- [トリガー](../../../triggers/index.mdx) —— スクリプトとフローを、必要なとき・スケジュール・外部の出来事で起こす。
</div>

スクリプトは 2 つの部分でできています。

- [コード](#コード): Ruby のスクリプトでは、`main` 関数は任意です。`main` 関数が無いスクリプトは、ファイル全体が実行されます。
- [設定](#設定): パス・要約・説明・入力の [JSON Schema](../../../core_concepts/13_json_schema_and_parsing/index.mdx)（署名から推論されます）といった、スクリプトの設定とメタデータ。

コードリポジトリに保存すると、この 2 つは `<path>.rb` と `<path>.script.yaml` に分かれて置かれます。

[依存関係](/docs/getting_started/scripts_quickstart/ruby#dependencies-management)は Windmill が自動で扱います。Ruby のスクリプトで `gemfile` ブロック（bundler/inline の書き方に対応しています）を使って gem を指定すると、保存時に Windmill がそれを読み取り、Gemfile.lock を自動で作ります。これにより、同じ版のスクリプトは常に同じ版の依存関係で実行されます。さらに、特定の製品に縛られないよう、lockfile を取り出して Windmill の外で使うこともできます。

Windmill で Ruby で組んだスクリプトの簡単な例を挙げます。

```ruby
require 'windmill/inline'

gemfile do
  source 'https://rubygems.org'
  gem 'httparty'
  gem 'json'
end

def main(url: "https://httpbin.org/get", message: "Hello from Windmill!")
  response = HTTParty.get(url, query: { message: message })
  return {
    status: response.code,
    body: JSON.parse(response.body),
    message: "Request completed successfully"
  }
end
```

この手引きでは、実行した人に挨拶するスクリプトを作ります。

ホーム画面で **新規（New）** をクリックし、**スクリプト（Script）** を選びます。スクリプト作成の最初の段階、メタデータに進みます。

## 設定

![Ruby Settings](./ruby-settings.png "Ruby Settings")

[設定](../../../script_editor/settings.mdx)メニューの一部として、各スクリプトにはメタデータが付いており、細かく定義・設定できます。

- **パス（Path）**はスクリプトを一意に指す識別子で、[スクリプトの所有者](../../../core_concepts/16_roles_and_permissions/index.mdx)と名前からなります。所有者はユーザーか、グループ（[フォルダ](../../../core_concepts/8_groups_and_folders/index.mdx#folders)）です。
- **要約（Summary）**（任意）はスクリプトの短い説明で、人が読むためのものです。Windmill 全体で見出しとして表示されます。省略すると、既定で `path` が使われます。
- スクリプトの**言語**。
- **説明（Description）**では、[自動生成される UI](../../../core_concepts/6_auto_generated_uis/index.mdx) を通じて、使う人に実行のしかたを伝えられます。markdown が使えます。
- **スクリプトの種類**: アクション（既定）、[トリガー](../../../flows/10_flow_trigger.mdx)、[承認](../../../flows/11_flow_approval.mdx)、[エラーハンドラ](../../../flows/7_flow_error_handler.md)。[フローエディタ](../../6_flows_quickstart/index.mdx)で適切なスクリプトを絞り込むための札として働きます。

このメニューには [ランタイム](../../../script_editor/settings.mdx#runtime)・[生成される UI](#生成される-ui)・[トリガー](../../../script_editor/settings.mdx#triggers)の設定もあります。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [設定](../../../script_editor/settings.mdx) —— 各スクリプトにはメタデータと設定が付いており、細かく定義・設定できる。
</div>

では左側のコードエディタに移り、Hello World を作りましょう。

## コード

Windmill にはスクリプトを書くためのオンラインエディタがあります。左側がエディタ本体です。右側は、スクリプトの署名から Windmill が[生成する UI の下見](../../../core_concepts/6_auto_generated_uis/index.mdx)で、これがスクリプトを使う人に見えるものです。その UI を確かめ、値を入れて、[その場でテスト](#その場での確認とテスト)できます。

![Ruby Editor](./ruby-startpage.png "Ruby Editor")

<div className="grid grid-cols-2 gap-6 mb-4">
	- [コードエディタ](../../../code_editor/index.mdx) —— コードエディタは Windmill に統合された開発環境。
	- [自動生成される UI](https://www.windmill.dev/docs/core_concepts/auto_generated_uis) —— Windmill はスクリプトとフローの引数から、UI を自動で作る。
</div>

この例では `ruby` を選んだので、Windmill が Ruby の雛形を用意してくれています。見てみましょう。

```ruby
# Builtin mini windmill client
require 'windmill/mini'
require 'windmill/inline'

# Add your gem dependencies here using gemfile syntax
gemfile do
  source 'https://rubygems.org'
  gem 'httparty', '~> 0.21'
  gem 'json', '~> 2.6'
end

# You can import any gem from RubyGems.
# See here for more info: https://www.windmill.dev/docs/getting_started/scripts_quickstart/ruby#dependencies-management

def main(
  name = "Nicolas Bourbaki",
  age = 42,
  obj = { "even" => "hashes" },
  l = ["or", "arrays!"]
)
  puts "Hello World and a warm welcome especially to #{name}"
  puts "and its acolytes.. #{age} #{obj} #{l}"

  # retrieve variables, resources using built-in methods
  begin
		# Imported from windmill mini client
    secret = get_variable("f/examples/secret")
  rescue => e
    secret = "No secret yet at f/examples/secret!"
  end
  puts "The variable at `f/examples/secret`: #{secret}"

  # fetch context variables
  user = ENV['WM_USERNAME']

  # return value is converted to JSON
  return {
    "split" => name.split,
    "user" => user,
    "message" => "Hello from Ruby!"
  }
end
```

Windmill のスクリプトでは、入口となる `main` 関数は任意です。`main` 関数が無ければ、スクリプト全体が実行されます。`main` について押さえておくべき点がいくつかあります。

- `main` の引数は次の 2 つを作るのに使われます。
  1.  スクリプトの[入力仕様](../../../core_concepts/13_json_schema_and_parsing/index.mdx)
  2.  スクリプトを単体のアプリとして実行したときに見える[画面](../../../core_concepts/6_auto_generated_uis/index.mdx)
- 引数の型は既定値から推論され、UI の入力欄が作られます。文字列の既定値なら文字列の欄、数値なら数値の欄、ハッシュや配列ならそれに応じた JSON の欄、といった具合です。
- UI は後の段階で調整できます（ただし入力の型は変えられません）。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [JSON schema と解釈](https://www.windmill.dev/docs/core_concepts/json_schema_and_parsing) —— JSON Schema は、スクリプトとフローの入力仕様を定め、リソースの型を指定するために使われる。
</div>

最初の import は Windmill の Ruby クライアントで、[変数](../../../core_concepts/2_variables_and_secrets/index.mdx)や[リソース](../../../core_concepts/3_resources_and_types/index.mdx)を使うための組み込みのメソッドが手に入ります。

Hello World に戻ります。雛形を整理して、`main` が利用者の名前を受け取るようにします。`name` を返しておきましょう —— このスクリプトを[フロー](../../../flows/1_flow_editor.mdx)や[アプリ](../../../full_code_apps/index.mdx)の中で使い、結果を次へ渡したくなるかもしれません。

```ruby
def main(name = "World")
  puts "Hello #{name}! Greetings from Ruby!"
  return name
end
```

## その場での確認とテスト

右側の UI の下見を見てください。入力の署名に合わせて更新されています。テストを実行して（`Ctrl` + `Enter`）、動くことを確かめましょう。

`main` の署名を変えれば、UI の振る舞いも変えられます。たとえば `name` 引数の既定値を消すと、UI はこの欄を必須として扱います。

```ruby
def main(name)
```

<div className="grid grid-cols-2 gap-6 mb-4">
	- [その場での確認とテスト](https://www.windmill.dev/docs/core_concepts/instant_preview) —— Windmill は統合されたエディタに加えて、配備の前でも、作っているものをその場で見て試せるようにしている。
</div>

では最後の段階、「生成される UI」の設定に進みます。

## 生成される UI

設定メニューの「生成される UI（Generated UI）」タブでは、スクリプトの引数を調整できます。

UI はスクリプトの `main` 関数の署名から作られますが、ここで制約を足せます。たとえば `プロパティを調整（Customize property）` から `パターン（Pattern）` をクリックして正規表現を書き、英数字だけの名前を求められます: `^[A-Za-z0-9]+$`。数字も許しておきましょう —— どこかの技術系の富豪の子かもしれませんから。

![Generated UI](./customize-ui.png "Generated UI")

<div className="grid grid-cols-2 gap-6 mb-4">
	- [スクリプトの種類](../../../script_editor/script_kinds.mdx) —— スクリプトを特定の種類に絞ることで、追加の働きを持たせられる。
	- [生成される UI](../../../script_editor/customize_ui.mdx) —— main 関数の引数には詳細な設定を与えられ、入力の自動生成 UI と JSON Schema に反映される。
</div>

## 実行する

これで完成です。次は、このスクリプトを使う人の側を見てみましょう。[配備（Deploy）](../../../core_concepts/0_draft_and_deploy/index.mdx)ボタンを押して読み込みます。さきほど定義した入力欄が出ます。

Windmill のスクリプトは[版管理されて](../../../core_concepts/34_versioning/index.mdx#script-versioning)おり、各版はハッシュで一意に識別されます。

入力欄を埋めて「実行（Run）」を押します。実行の様子とログが出ます。すべての実行は左側の[実行履歴](../../../core_concepts/5_monitor_past_and_future_runs/index.mdx)メニューからも見られます。

用意されたコマンドを使って、[CLI からスクリプトを実行する](../../../advanced/3_cli/index.mdx)こともできます。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [トリガー](../../../triggers/index.mdx) —— スクリプトとフローを、必要なとき・スケジュール・外部の出来事で起こす。
</div>

## 依存の管理

Ruby の依存関係は、bundler/inline の書き方とそのまま互換な `gemfile` ブロックで管理します。gemfile ブロックには、全体で使う取得元（source）を 1 つだけ書きます。

```ruby
require 'windmill/inline'

gemfile do
  source 'https://rubygems.org'
  gem 'httparty', '~> 0.21'
  gem 'redis', '>= 4.0'
  gem 'activerecord', '7.0.0'
  gem 'pg', require: 'pg'
  gem 'dotenv', require: false
end
```

### 非公開の gem の取得元

非公開の gem リポジトリも使えます。書き方はいくつかあります。

**その 1: gem ごとに取得元を指定する**
```ruby
require 'windmill/inline'

gemfile do
  source 'https://rubygems.org'
  gem 'httparty'
  gem 'private-gem', source: 'https://gems.example.com'
end
```

**その 2: source ブロックでまとめる**
```ruby
require 'windmill/inline'

gemfile do
  source 'https://rubygems.org'
  
  source 'https://gems.example.com' do
    gem 'private-gem-1'
    gem 'private-gem-2'
  end
end
```

非公開の取得元で認証が要る場合は、スクリプトには資格情報を含まない URL を書きます。[Enterprise 版](/pricing)をお使いなら、認証情報付きの URL をインスタンスの設定にある Ruby のリポジトリに登録します。**インスタンスの設定（Instance Settings）> レジストリ（Registries）> Ruby Repos** と進み、次を追加します。

```
https://admin:123@gems.example.com/
```

![Ruby Private repos Instance Settings](./ruby-gems-instance-settings.png "Ruby Private repos Instance Settings")

Windmill は、スクリプトに書かれた取得元の URL と、設定に登録された認証情報付きの URL を自動で突き合わせ、認証を引き受けます。

### ネットワークの設定

- **TLS/SSL**: 相手の証明書がシステムに信頼されていれば、自動で処理されます
- **プロキシ**: プロキシの環境変数は、lockfile の生成・gem の導入・実行のいずれの段階でも自動で扱われます

Windmill は次のことを自動で行います。
- スクリプトを保存したときに gemfile ブロックを読み取る
- Gemfile と Gemfile.lock を作る
- 隔離された環境に依存関係を導入する
- 依存関係をキャッシュして実行を速くする

## キャッシュ

Ruby の gem は既定でディスクにキャッシュされます。さらに[分散キャッシュの保管](../../../core_concepts/38_object_storage_in_windmill/index.mdx#instance-object-storage-distributed-cache-for-python-rust-go)を使えば、他のすべての worker からも使えるようになり、どの worker でも起動が速くなります。

## 次は

このスクリプトは動く最小の例ですが、実際の用途ではさらにいくつかの段階が役に立ちます。

- スクリプトに[変数と秘密](../../../core_concepts/2_variables_and_secrets/index.mdx)を渡す。
- [リソース](../../../core_concepts/3_resources_and_types/index.mdx)につなぐ。
- [スクリプトを起こす](../../../triggers/index.mdx)方法はいくつもあります。
- スクリプトを[フロー](../../../flows/1_flow_editor.mdx)・[ローコードのアプリ](../../../apps/0_app_editor/index.mdx)・[フルコードのアプリ](../../../full_code_apps/index.mdx)に組み合わせる。
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
