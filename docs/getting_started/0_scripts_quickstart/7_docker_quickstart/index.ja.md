---
title: Docker クイックスタート
description: 'Windmill で Docker のコンテナを動かすには。Bash 対応を通じて、任意の Docker イメージを Windmill のスクリプトとして実行する。'
slug: '/getting_started/scripts_quickstart/docker'
---
> **[原文](./index.mdx)の日本語訳。** 相違があれば原文が正。
> 原典 © Windmill Labs, Inc. — [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。この訳も同じライセンスで提供します。

# Docker クイックスタート

この手引きでは、[Docker](https://www.docker.com/) のコンテナから動く最初のスクリプトを書きます。

Windmill は Python・TypeScript・Go・PHP・Bash・SQL をそのまま扱えます。込み入った依存関係が要る仕事や、対応していない言語で書かれた仕事のために、Windmill は [Bash](../4_bash_quickstart/index.mdx) 対応を通じて任意の Docker コンテナを動かせるようにしています。

勧められるのは、サンドボックスで囲われた `# sandbox <image>` のランタイムです。デーモンを使わない（Docker のソケットも、Docker in Docker のサイドカーも要らない）うえに、イメージはその job 自身の nsjail サンドボックスの中で走るので、信用できないコードでも安全に動かせますし、[Windmill クラウド](/pricing)でも使えます。詳しくは [Docker のコンテナを動かす](../../../advanced/7_docker/index.mdx)を参照してください。

![script 1](../../../advanced/7_docker/as_script.png.webp)

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

コードリポジトリに保存すると、この 2 つは `<path>.docker` と `<path>.script.yaml` に分かれて置かれます。

Windmill から Docker のコンテナを動かす、Bash で組んだスクリプトの簡単な例を挙げます。

```bash
# shellcheck shell=bash
# sandbox alpine:latest
# The "# sandbox <image>" annotation runs this script INSIDE the image above,
# sandboxed via nsjail. The body runs with the image's /bin/sh and windmill args
# bind positionally as $1, $2, ...

msg="${1:-world}"

echo "Hello $msg"
cat /etc/os-release | head -1
```

サンドボックスのランタイムについて詳しくは、[Docker のコンテナを動かす](../../../advanced/7_docker/index.mdx)を参照してください。

:::note

`# docker` とだけ書いた注釈は、これとは別の、旧来のデーモンに頼るランタイムを選びます。こちらは Docker のソケットを mount しておく必要があり、信用できる環境だけを想定したものです。新しく作るスクリプトでは `# sandbox <image>` を使ってください。

:::

<div className="grid grid-cols-2 gap-6 mb-4">
	- [Docker のコンテナを動かす](https://www.windmill.dev/docs/advanced/docker) —— Docker のコンテナを動かすために kubernetes か docker-compose を用意する。
</div>


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

### コード

Windmill にはスクリプトを書くためのオンラインエディタがあります。左側がエディタ本体です。右側は、スクリプトの署名から Windmill が[生成する UI の下見](../../../core_concepts/6_auto_generated_uis/index.mdx)で、これがスクリプトを使う人に見えるものです。その UI を確かめ、値を入れて、[その場でテスト](#その場での確認とテスト)できます。

![Editor for Bash](../4_bash_quickstart/editor_bash.png.webp)

<div className="grid grid-cols-2 gap-6 mb-4">
	- [コードエディタ](../../../code_editor/index.mdx) —— コードエディタは Windmill に統合された開発環境。
	- [自動生成される UI](https://www.windmill.dev/docs/core_concepts/auto_generated_uis) —— Windmill はスクリプトとフローの引数から、UI を自動で作る。
</div>

この例では `Docker` を選んだので、Windmill が Bash の雛形を用意してくれています。見てみましょう。

```bash
# shellcheck shell=bash
# sandbox alpine:latest
# The "# sandbox <image>" annotation runs this script INSIDE the image above,
# sandboxed via nsjail. The body runs with the image's /bin/sh and windmill args
# bind positionally as $1, $2, ...

msg="${1:-world}"

echo "Hello $msg"
cat /etc/os-release | head -1
```

`msg` はただの Bash の変数です。これを使ってスクリプトに引数を渡せます。この書き方は、引数に既定値を与えるための Bash の標準的なものです。

`# sandbox <image>` の注釈を置くと、それ以降のスクリプトはそのイメージの**中で**、nsjail のサンドボックスに囲まれて走ります。イメージの rootfs が取り込まれ、本体はその中に chroot された状態で、イメージの `/bin/sh` から動きます —— job に課された閉じ込めをそのまま引き継ぎます。Windmill の引数は `$1`・`$2`… と位置で結びつきます。デーモンを使わないので、mount する Docker のソケットも、面倒を見る `docker run` もありません。

### その場での確認とテスト

右側の UI の下見を見てください。入力の署名に合わせて更新されています。テストを実行して（`Ctrl` + `Enter`）、動くことを確かめましょう。

<video
	className="border-2 rounded-lg object-cover w-full h-full dark:border-gray-800"
	controls
	src="/videos/auto_g_ui_landing.mp4"
/>

<br />

<div className="grid grid-cols-2 gap-6 mb-4">
	- [その場での確認とテスト](https://www.windmill.dev/docs/core_concepts/instant_preview) —— Windmill は統合されたエディタに加えて、配備の前でも、作っているものをその場で見て試せるようにしている。
</div>

では最後の段階、「生成される UI」の設定に進みます。

## 生成される UI

設定メニューの「生成される UI（Generated UI）」タブでは、スクリプトの引数を調整できます。

UI はスクリプトの `main` 関数の署名から作られますが、ここで制約を足せます。たとえば `プロパティを調整（Customize property）` から `パターン（Pattern）` をクリックして正規表現を書き、英数字だけの名前を求められます: `^[A-Za-z0-9]+$`。数字も許しておきましょう —— どこかの技術系の富豪の子かもしれませんから。

![Advanced settings for Bash](../4_bash_quickstart/customize_bash.png.webp)

これで完成です。スクリプトを保存しましょう。Windmill のスクリプトは[版管理されて](../../../core_concepts/34_versioning/index.mdx#script-versioning)おり、各版はハッシュで一意に識別されます。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [スクリプトの種類](../../../script_editor/script_kinds.mdx) —— スクリプトを特定の種類に絞ることで、追加の働きを持たせられる。
	- [生成される UI](../../../script_editor/customize_ui.mdx) —— main 関数の引数には詳細な設定を与えられ、入力の自動生成 UI と JSON Schema に反映される。
</div>

### 実行する

次は、このスクリプトを使う人の側を見てみましょう。[配備（Deploy）](../../../core_concepts/0_draft_and_deploy/index.mdx)ボタンを押して読み込みます。さきほど定義した入力欄が出ます。

入力欄を埋めて「実行（Run）」を押します。実行の様子とログが出ます。すべての実行は左側の[実行履歴](../../../core_concepts/5_monitor_past_and_future_runs/index.mdx)メニューからも見られます。

![Run Hello in Bash](../4_bash_quickstart/run_bash.png.webp)

用意されたコマンドを使って、[CLI からスクリプトを実行する](../../../advanced/3_cli/index.mdx)こともできます。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [トリガー](../../../triggers/index.mdx) —— スクリプトとフローを、必要なとき・スケジュール・外部の出来事で起こす。
</div>

## JSON を返す

スクリプトが返す最後の行が、文字列としての結果になります。代わりに JSON を返したい場合は、結果を `./result.json` に書き出してください。Bash と PowerShell のスクリプトでは、それが自動的に拾われて JSON の結果として扱われます。

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
