---
title: 'R クイックスタート'
description: 'Windmill で R のスクリプトを書くには。CRAN のパッケージ依存の管理とあわせて、作り、テストし、配備する。'
slug: '/getting_started/scripts_quickstart/r'
---
> **[原文](./index.mdx)の日本語訳。** 相違があれば原文が正。
> 原典 © Windmill Labs, Inc. — [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。この訳も同じライセンスで提供します。

# R クイックスタート

この手引きでは、最初のスクリプトを [R](https://www.r-project.org/) で書きます。

{/* Placeholder: Add demo video for R scripts when available */}
{/* <div className="mb-4">
	<video
		className="border-2 rounded-xl object-cover w-full h-full dark:border-gray-800"
		autoPlay
		loop
		controls
		src="/videos/r.mp4"
		alt="R Demo"
		muted
	/>
</div> */}

<div className="grid grid-cols-2 gap-6 mb-4">
	- [手元での開発](https://www.windmill.dev/docs/advanced/local_development) —— 端末・VS Code・JetBrains の IDE など、さまざまな環境から開発する。
	- [R の依存関係](https://www.windmill.dev/docs/getting_started/scripts_quickstart/r#dependencies-management) —— R のスクリプトで依存関係を管理する方法。
</div>

スクリプトは Windmill の基本の部品です。単体で[実行・スケジュール](../../../triggers/index.mdx)できますし、つなげて[フロー](../../../flows/1_flow_editor.mdx)にすることも、専用の UI を付けて[アプリ](../../7_apps_quickstart/index.mdx)として見せることもできます。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [スクリプトエディタ](../../../script_editor/index.mdx) —— スクリプトのすべて。
	- [トリガー](../../../triggers/index.mdx) —— スクリプトとフローを、必要なとき・スケジュール・外部の出来事で起こす。
</div>

スクリプトは 2 つの部分でできています。

- [コード](#コード): R のスクリプトでは、`main <- function(...)` の形で定義した `main` 関数が要ります。
- [設定](#設定): パス・要約・説明・入力の [JSON Schema](../../../core_concepts/13_json_schema_and_parsing/index.mdx)（署名から推論されます）といった、スクリプトの設定とメタデータ。

コードリポジトリに保存すると、この 2 つは `<path>.r` と `<path>.script.yaml` に分かれて置かれます。

依存関係は Windmill が[自動で管理](/docs/getting_started/scripts_quickstart/r#dependencies-management)します。
R のスクリプトで `library()` や `require()` を使ってパッケージを読み込むと、
保存した時点で Windmill がその依存関係を読み取り、CRAN から版を自動で解決します。
これにより、同じ版のスクリプトは、つねに同じ版の依存関係で実行されます。

Windmill で R で組んだスクリプトの簡単な例を挙げます。

```r
library(httr)
library(jsonlite)

main <- function(url = "https://httpbin.org/get", message = "Hello from Windmill!") {
  response <- GET(url, query = list(message = message))

  list(
    status = status_code(response),
    body = content(response, as = "parsed"),
    message = "Request completed successfully"
  )
}
```

この手引きでは、実行した人に挨拶するスクリプトを作ります。

ホーム画面で **新規（New）** をクリックし、**スクリプト（Script）** を選びます。スクリプト作成の最初の段階、メタデータに進みます。

## 設定

![R Settings](./r-settings.png "R Settings")

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

では左側のコードエディタをクリックして、Hello World を作りましょう。

## コード

Windmill にはスクリプトを書くためのオンラインエディタがあります。左側がエディタ本体です。右側は、スクリプトの署名から Windmill が[生成する UI の下見](../../../core_concepts/6_auto_generated_uis/index.mdx)で、これがスクリプトを使う人に見えるものです。その UI を確かめ、値を入れて、[その場でテスト](#その場での確認とテスト)できます。

![R Editor](./r-editor.png "R Editor")

<div className="grid grid-cols-2 gap-6 mb-4">
	- [コードエディタ](../../../code_editor/index.mdx) —— コードエディタは Windmill に統合された開発環境。
	- [自動生成される UI](https://www.windmill.dev/docs/core_concepts/auto_generated_uis) —— Windmill はスクリプトとフローの引数から、UI を自動で作る。
</div>

この例では `R` を選んだので、Windmill が R の雛形を用意してくれています。見てみましょう。

```r
library(crayon)
library(dplyr)
library(zoo)
library(jsonlite)

main <- function(
  x,
  name = "default",
  age = 25,
  data = list(1, 2, 3),
  flag = TRUE
) {
  # Use Windmill helpers:
  # var <- get_variable("f/my_var")
  # res <- get_resource("f/my_resource")

  df <- tibble(name = name, age = age, x = x)
  result <- df %>% mutate(greeting = paste("Hello", name))

  return(toJSON(result, auto_unbox = TRUE))
}
```

Windmill の R スクリプトには、`main <- function(...)` の形で定義した `main` 関数が要ります。これがスクリプトの入口です。`main` について押さえておくべき点がいくつかあります。

- `main` の引数は次の 2 つを作るのに使われます。
  1.  スクリプトの[入力仕様](../../../core_concepts/13_json_schema_and_parsing/index.mdx)
  2.  スクリプトを単体のアプリとして実行したときに見える[画面](../../../core_concepts/6_auto_generated_uis/index.mdx)
- 既定値は引数の型を推論し、UI の入力欄を作るのに使われます。文字列の既定値なら文字列の入力欄、数値の既定値なら数値の入力欄、リストやベクトルの既定値ならそれに合った JSON の入力欄、というように決まります。
- UI は後の段階で調整できます（ただし入力の型は変えられません）。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [JSON schema と解釈](https://www.windmill.dev/docs/core_concepts/json_schema_and_parsing) —— JSON Schema は、スクリプトとフローの入力仕様を定め、リソースの型を指定するために使われる。
</div>

Hello World に戻ります。雛形を整理して、`main` が利用者の名前を受け取るようにします。`name` を返しておきましょう —— このスクリプトを[フロー](../../../flows/1_flow_editor.mdx)や[アプリ](../../../full_code_apps/index.mdx)の中で使い、結果を次へ渡したくなるかもしれません。

```r
main <- function(name = "World") {
  print(paste("Hello", name, "! Greetings from R!"))
  name
}
```

## 変数とリソースを使う

R のスクリプトからは、組み込みの補助関数を使って Windmill の[変数](../../../core_concepts/2_variables_and_secrets/index.mdx)と[リソース](../../../core_concepts/3_resources_and_types/index.mdx)を利用できます。

```r
library(httr)
library(jsonlite)

main <- function() {
  # Get a variable
  secret <- get_variable("f/examples/secret")

  # Get a resource (returns a list/object)
  db_config <- get_resource("f/examples/postgres")

  # Access context variables from environment
  user <- Sys.getenv("WM_USERNAME")
  workspace <- Sys.getenv("WM_WORKSPACE")

  list(
    secret = secret,
    db_host = db_config$host,
    user = user,
    workspace = workspace
  )
}
```

## その場での確認とテスト

右側の UI の下見を見てください。入力の署名に合わせて更新されています。テストを実行して（`Ctrl` + `Enter`）、動くことを確かめましょう。

`main` の署名を変えれば、UI のふるまいも変えられます。たとえば `name` 引数の既定値を消すと、UI はこの欄を必須として扱います。

```r
main <- function(name)
```

<div className="grid grid-cols-2 gap-6 mb-4">
	- [その場での確認とテスト](https://www.windmill.dev/docs/core_concepts/instant_preview) —— Windmill は統合されたエディタに加えて、配備の前でも、作っているものをその場で見て試せるようにしている。
</div>

では最後の段階、「生成される UI」の設定に進みます。

## 生成される UI

設定メニューの「生成される UI（Generated UI）」タブでは、スクリプトの引数を調整できます。

UI はスクリプトの `main` 関数の署名から作られますが、ここで制約を足せます。たとえば `プロパティを調整（Customize property）` から `パターン（Pattern）` をクリックして正規表現を書き、英数字だけの名前を求められます: `^[A-Za-z0-9]+$`。数字も許しておきましょう —— どこかの技術系の富豪の子かもしれませんから。

![Generated UI](../14_ruby_quickstart/customize-ui.png "Generated UI")

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

R の依存関係は、スクリプト中の `library()` と `require()` の呼び出しから自動で検出されます。Windmill はパッケージの版を CRAN から解決します。

```r
library(httr)
library(jsonlite)
library(dplyr)
library(ggplot2)

main <- function(data_url = "https://example.com/data.csv") {
  # Use httr for HTTP requests
  response <- GET(data_url)

  # Parse JSON responses
  data <- fromJSON(content(response, as = "text"))

  # Use dplyr for data manipulation
  result <- data %>%
    filter(!is.na(value)) %>%
    summarise(mean_value = mean(value))

  result
}
```

Windmill が自動で行うことは次のとおりです。
- スクリプトを保存したときに `library()` と `require()` の呼び出しを読み取る
- CRAN から版を解決する（lockfile は 3 日の TTL でキャッシュされます）
- 共有のキャッシュディレクトリにパッケージを導入する
- 実行を速くするために依存関係をキャッシュする

### 詳しい出力

既定では、パッケージの導入中に renv の出力は伏せられています。不具合を調べるために詳しい出力を有効にするには、スクリプトの先頭に `#verbose` の註記を足します。

```r
#verbose

library(httr)
library(jsonlite)

main <- function() {
  # Your code here
}
```

## キャッシュ

R のパッケージ依存は既定でディスクにキャッシュされます。さらに[分散キャッシュの保管](../../../core_concepts/38_object_storage_in_windmill/index.mdx#instance-object-storage-distributed-cache-for-python-rust-go)を使えば、他のすべての worker からも使えるようになり、どの worker でも起動が速くなります。

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
