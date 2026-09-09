---
title: Bash / PowerShell / Nu クイックスタート
description: 'Windmill で Bash・PowerShell・Nu のスクリプトを書くには。シェルスクリプトを作って動かす。'
slug: '/getting_started/scripts_quickstart/bash'
---

> **[原文](./index.mdx)の日本語訳。** 相違があれば原文が正。
> 原典 © Windmill Labs, Inc. — [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。この訳も同じライセンスで提供します。

# Bash / PowerShell / Nu クイックスタート

この手引きでは、最初のスクリプトを Bash・PowerShell・Nu のいずれかで書きます。

<video
	className="border-2 rounded-lg object-cover w-full h-full dark:border-gray-800"
	autoPlay
	controls
	id="main-video"
	src="/videos/bash_quickstart.mp4"
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

コードリポジトリに保存すると、この 2 つは `<path>.sh` と `<path>.script.yaml` に分かれて置かれます。

Windmill で Bash / PowerShell / Nu で組んだスクリプトの簡単な例を挙げます。

#### Bash

```bash
# shellcheck shell=bash
# arguments of the form X="$I" are parsed as parameters X of type string
url="${1:-default value}"

status_code=$(curl -s -o /dev/null -w "%{http_code}" $url)

if [[ $status_code == 2* ]] || [[ $status_code == 3* ]]; then
  echo "The URL is reachable!"
else
  echo "The URL is not reachable."
fi
```

#### PowerShell

```powershell
param($url = "default value")

$status_code = (Invoke-WebRequest -Uri $url -Method Get).StatusCode

if ($status_code -like "2*" -or $status_code -like "3*") {
    Write-Host "The URL is reachable!"
} else {
    Write-Host "The URL is not reachable."
}
```

#### Nu

```python
def main [
  url: string = "default value"
] {
  try {
    # Nu will throw an error automatically if request fails
    http get $url
    echo "The URL is reachable!"
  } catch {
    echo "The URL is not reachable."
  }
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

![Editor for Bash](./editor_bash.png.webp)

<div className="grid grid-cols-2 gap-6 mb-4">
	- [コードエディタ](../../../code_editor/index.mdx) —— コードエディタは Windmill に統合された開発環境。
	- [自動生成される UI](https://www.windmill.dev/docs/core_concepts/auto_generated_uis) —— Windmill はスクリプトとフローの引数から、UI を自動で作る。
</div>

### Bash

この例では `Bash` を選んだので、Windmill が雛形を用意してくれています。見てみましょう。

```bash
# shellcheck shell=bash
# arguments of the form X="$I" are parsed as parameters X of type string
msg="$1"
dflt="${2:-default value}"

# the last line of the stdout is the return value
echo "Hello $msg"
```

Bash では、引数は \$1・\$2・\$3 を要求している箇所から推論されます。既定値は上の書き方で指定できます: `dflt="${2:-default value}"`。

出力の最後の行 —— ここでは `echo "Hello $msg"` —— が返り値になります。このスクリプトを[フロー](../../../flows/1_flow_editor.mdx)や[アプリ](../../../full_code_apps/index.mdx)の中で使い、結果を次へ渡すときに役立ちます。

### PowerShell

この例では `PowerShell` を選んだので、Windmill が雛形を用意してくれています。見てみましょう。

```powershell
param($Msg, [string[]]$Names, [PSCustomObject]$Obj, $Dflt = "default value", [int]$Nb = 3)

# Import-Module MyModule

# the last line of the stdout is the return value
Write-Output "Hello $Msg"
```

PowerShell では、引数は `param` の指示から推論されます。これはスクリプトの先頭に無ければなりません。
引数の型は `string`、`int`/`long`/`double`/`decimal`/`single`、`PSCustomObject`（JSON から解釈されます）、`datetime`、`bool`、およびこれらの配列が使えます。
既定値は次の書き方で指定できます: `$argument_name = "Its default value"`。

出力の最後の行 —— ここでは `Write-Output "Hello $Msg"` —— が返り値になります。このスクリプトを[フロー](../../../flows/1_flow_editor.mdx)や[アプリ](../../../full_code_apps/index.mdx)の中で使い、結果を次へ渡すときに役立ちます。

### Nu

`Bash` や `PowerShell` と違い、`Nu` では `main` 関数が要り、引数はすべて署名で定義します。
型付き・省略可能・既定値付きの引数に対応しています。

#### 簡単な例

```python
def main [ msg, dflt = "default value", nb: number = 3 ] {
	echo $"Hello ($msg)"
}
```

#### 一通り使った例

```python
use std assert
# Nushell
# A new type of shell
def main [
    no_default: string,
    name = "Nicolas Bourbaki",
    age: int = 42,
    date_of_birth?: datetime,
    obj: record = {"records": "included"},
    l: list<string> = ["or", "lists!"],
    tables?: table,
    enable_kill_mode?: bool = true,
] {
    # Test
    # https://www.nushell.sh/book/testing.html
		assert ($age == 42)

    print $"Hello World and a warm welcome especially to ($name)"
    print "and its acolytes.." $age $obj $l
    print $tables

    let secret = try { 
      get_variable f/examples/secret
    } catch { 
      'No secret yet at f/examples/secret !' 
    };

    print $"The variable at \`f/examples/secret\`: ($secret)"
    # fetch context variables
    let user = $env.WM_USERNAME

    # Nu pipelines
    ls | where size > 1kb | sort-by modified | print "ls:" $in

    # Nu works with existing data
    # Nu speaks JSON, YAML, SQLite, Excel, and more out of the box. 
    # It's easy to bring data into a Nu pipeline whether it's in a file, a database, or a web API:
    let nu_license = http get https://api.github.com/repos/nushell/nushell | get license

    return { split: ($name | split words), user: $user, nu_license: $nu_license}
    # Interested in learning more?
    # https://www.nushell.sh/book/getting_started.html

```

`Nu` の強みの 1 つは、どの環境でも動くことです。Linux の worker と [Windows の worker](../../../misc/17_windows_workers/index.mdx) の両方があるなら、Nushell のスクリプトはどちらでも動きます。

`Nu` に興味があれば、[公式のドキュメント](https://www.nushell.sh/book/getting_started.html)を読んでみてください。

## その場での確認とテスト

右側の UI の下見を見てください。入力の署名に合わせて更新されています。テストを実行して（`Ctrl` + `Enter`）、動くことを確かめましょう。

<video
	className="border-2 rounded-lg object-cover w-full h-full dark:border-gray-800"
	controls
	src="/videos/auto_g_ui_landing.mp4"
/>

<br />

`main` の署名を変えれば、UI の振る舞いも変わります。たとえば `name` に既定値を付けると、UI はその欄を必須として扱わなくなります。

#### Bash

```bash
argument_name="${1:-Its default value}"
```

#### PowerShell

```bash
$argument_name = "Its default value"
```

#### Nu

```python
def main [ argument_name = "Its default value" ] { }
```

<div className="grid grid-cols-2 gap-6 mb-4">
	- [その場での確認とテスト](https://www.windmill.dev/docs/core_concepts/instant_preview) —— Windmill は統合されたエディタに加えて、配備の前でも、作っているものをその場で見て試せるようにしている。
</div>

では最後の段階、「生成される UI」の設定に進みます。

## 生成される UI

設定メニューの「生成される UI（Generated UI）」タブでは、スクリプトの引数を調整できます。

UI はスクリプトの `main` 関数の署名から作られますが、ここで制約を足せます。たとえば `プロパティを調整（Customize property）` から `パターン（Pattern）` をクリックして正規表現を書き、英数字だけの名前を求められます: `^[A-Za-z0-9]+$`。数字も許しておきましょう —— どこかの技術系の富豪の子かもしれませんから。

![Advanced settings for Bash](./customize_bash.png.webp)

<div className="grid grid-cols-2 gap-6 mb-4">
	- [スクリプトの種類](../../../script_editor/script_kinds.mdx) —— スクリプトを特定の種類に絞ることで、追加の働きを持たせられる。
	- [生成される UI](../../../script_editor/customize_ui.mdx) —— main 関数の引数には詳細な設定を与えられ、入力の自動生成 UI と JSON Schema に反映される。
</div>

## 実行する

これで完成です。次は、このスクリプトを使う人の側を見てみましょう。[配備（Deploy）](../../../core_concepts/0_draft_and_deploy/index.mdx)ボタンを押して読み込みます。さきほど定義した入力欄が出ます。

Windmill のスクリプトは[版管理されて](../../../core_concepts/34_versioning/index.mdx#script-versioning)おり、各版はハッシュで一意に識別されます。

入力欄を埋めて「実行（Run）」を押します。実行の様子とログが出ます。すべての実行は左側の[実行履歴](../../../core_concepts/5_monitor_past_and_future_runs/index.mdx)メニューからも見られます。

![Run Hello in Bash](./run_bash.png.webp)

用意されたコマンドを使って、[CLI からスクリプトを実行する](../../../advanced/3_cli/index.mdx)こともできます。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [トリガー](../../../triggers/index.mdx) —— スクリプトとフローを、必要なとき・スケジュール・外部の出来事で起こす。
</div>

## JSON を返す

スクリプトが返す最後の行が、文字列としての結果になります。代わりに JSON を返したい場合は、結果を `./result.json` に書き出してください。Bash と PowerShell のスクリプトでは、それが自動的に拾われて JSON の結果として扱われます。

Nu では、`main` 関数が最初に返したデータが結果になります。

## Docker のコンテナを動かす

込み入った依存関係が要る仕事や、対応していない言語で書かれた仕事も、フローの段や単体のスクリプトとして取り込めます。

Windmill は Bash 対応を通じて、`# sandbox <image>` の注釈で任意の Docker コンテナを動かせます。イメージはその job 自身の nsjail サンドボックスの中で、デーモンなしに走ります —— Docker のソケットも、Docker in Docker のサイドカーも要りません。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [Docker のコンテナを動かす](https://www.windmill.dev/docs/advanced/docker) —— 込み入った依存関係が要る仕事や、対応していない言語の仕事も、フローの段や単体のスクリプトとして取り込める。
</div>

## リモートの SSH ホストで動かす

先頭に `#ssh <resource_path>` の指示を置いた bash スクリプトは、worker ではなく、指定した `ssh_target` リソースが表すリモートのホストで走ります。型付きの引数・結果の回収・ログの逐次表示は同じように使えます（[Enterprise 版](/pricing)、既定では無効）。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [SSH 越しにスクリプトを動かす](https://www.windmill.dev/docs/advanced/ssh_execution) —— #ssh の指示で、リモートの SSH ホストで bash スクリプトを動かす。
</div>

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
