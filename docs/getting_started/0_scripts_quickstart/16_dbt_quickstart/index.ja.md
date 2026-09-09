---
title: 'dbt quickstart'
description: 'Windmill で dbt のプロジェクトを動かすには。手を入れていない dbt のプロジェクトをそのままスクリプトとして書く・取り込む、自分の worker で走らせる、エディタからモデルのグラフを取り直す。'
slug: '/getting_started/scripts_quickstart/dbt'
---
> **[原文](./index.mdx)の日本語訳。** 相違があれば原文が正。
> 原典 © Windmill Labs, Inc. — [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。この訳も同じライセンスで提供します。

# dbt クイックスタート

Windmill は [dbt](https://www.getdbt.com/) のプロジェクトを、1 つの言語として動かします。dbt のプロジェクト 1 つが Windmill のスクリプト 1 つです。プロジェクトのファイルはスクリプトの module bundle として一緒に運ばれ、worker が dbt を呼ぶ前に job のディレクトリへ書き出します。実行時に clone は起きませんし、プロジェクト自体には手が入りません —— 手元で `dbt build` を走らせるのとまったく同じディレクトリです。

`dbt build` に加えて手に入るのは、Windmill の残り全部です —— [スケジュールとトリガー](../../../triggers/index.mdx)、[権限](../../../core_concepts/16_roles_and_permissions/index.mdx)、実行の履歴、モデルごとの進み具合の実況、そしてプロジェクトのモデルが一級の[アセット](../../../core_concepts/52_assets/index.mdx)になること。おかげで、その mart を読む Python や DuckDB のスクリプトが同じ系譜のグラフに現れます。

実行の仕組みも、モデルのグラフも、画面も、すべて Community Edition に入っています。[Enterprise Edition](/pricing) のライセンスが要るのは `mssql` と `oracle` のアダプタだけで、これは SQL の言語がすでに引いている線と同じです。

dbt はブラウザの「新しいスクリプト」の言語の選択肢に入っていて、dbt のスクリプトは共通のエディタではなく[専用のエディタ](#dbt-のエディタ)で開きます。[CLI](../../../advanced/3_cli/index.mdx) から取り込んで編集することもできます。

ただし、その場で書く言語としては使えません。[フロー](../../6_flows_quickstart/index.mdx)の段や[アプリ](../../7_apps_quickstart/index.mdx)の実行対象はコードの本体だけを持つもので、プロジェクトを運ぶ場所がないからです。フローから dbt のプロジェクトへは、他のスクリプトと同じように届きます —— 配備済みのものへ、パスで。

## warehouse を設定する

Windmill 上の dbt のプロジェクトは、自分では接続を持ちません。warehouse はワークスペースごとに一度だけ、`ワークスペースの設定（Workspace settings）` -> `dbt` で設定します。1 件は名前・[リソース](../../../core_concepts/3_resources_and_types/index.mdx)・（任意で）dbt の target からなります。プロジェクトは名前で warehouse を指し、何も指さなければ `main` になります。

この名前は、アセットのグラフにおける warehouse の身元でもあります —— どのモデルも `dbt://<warehouse>/<schema>/<name>` になります —— なので、同じ warehouse を指す 2 つのプロジェクトは、離れた 2 つの島を描くのではなく、節点を共有します。

![Workspace settings, dbt tab: a warehouses table with Name, Resource and Target columns - `main` on a Postgres resource with target `prod`, and `lake` on a dbt_profile resource](./warehouse_settings.png 'Warehouses configured under Workspace settings -> dbt')

warehouse が指すリソースには 2 種類あります。

**Windmill の接続のリソース**。その warehouse 向けのものがあるなら —— `postgresql`、`redshift`、`mysql`、`snowflake`、`bigquery`（か `gcp_service_account`）、`databricks`。Windmill がその欄を dbt の読む鍵に読み替えるので、dbt のために埋めるものは何もありません。他所ですでに使っているリソースがそのまま使えます。アダプタはリソースの型から決まります。

**`dbt_profile` のリソース**。それ以外すべてと、上の読み替えで足りないものに使います。これは `profiles.yml` の `outputs` の 1 項目を、そのままリソースにしたものです。手元にこういうファイルがあるとして、

```yaml
# ~/.dbt/profiles.yml
my_project:
  target: prod
  outputs:
    prod:
      type: clickhouse
      host: ch.internal
      port: 8123
      user: analytics
      password: s3cret
      schema: marts
      secure: true
```

リソースは `prod` のかたまり*そのもの*です —— `type` も含め、そのまま貼り付けます。

```json
{
  "type": "clickhouse",
  "host": "ch.internal",
  "port": 8123,
  "user": "analytics",
  "password": "$var:u/alice/ch_password",
  "schema": "marts",
  "secure": true
}
```

名前を変えたり外に出したりはしないので、手元で動かしているかたまりがそのまま Windmill で動きます。このリソース型は欄を宣言していないので、JSON のエディタが出ます。`$var:` と `$res:` の参照は入れ子の鍵の中でも解決されるので、資格情報は Windmill の秘密のままにしておけます。

そのかたまりより*上*の層はリソースに入りません。Windmill がすでに持っているからです —— profile の名前はプロジェクト自身の `dbt_project.yml` から来ますし、どの output を使うかは warehouse の `Target`（か記述子の `profile.target`）が決めます。`dev` と `prod` の output を持つプロジェクトは、リソース 1 つずつの warehouse 2 つになります。

鍵はどれも手を加えずに dbt へ渡されます。つまり **dbt が対応しているアダプタなら何でも動きます** —— Windmill が名前も知らないもの（`trino`、`athena`、`spark`、`fabric`、この先出るもの）も含めて。鍵はそのアダプタの dbt のドキュメントから写してください。数と真偽は型を保ちます。

`dbt-core-1x` のエンジンでは、アダプタは `dbt-<type>` として PyPI から入れられます。この導入は隔離されていないので、Windmill が持っている一覧にあるアダプタと、インスタンスの管理者が `DBT_EXTRA_ADAPTERS` に足したものに限られます。`dbt-core-2x` と `fusion` はアダプタを実行ファイルの中に持っていて何も入れないので、どんな `type` でも受け付けます。

そのまま渡すのに加えて、2 つの便宜があります。`root_certificate_pem` は値として送られるのではなく `profiles.yml` の隣に書き出され、`sslrootcert` がそれを指します。また記述子の `profile.schema` と `threads` は、かたまりの中の同じ鍵より優先されます。

`mssql` と `oracle` のアダプタには [Enterprise](/pricing) のライセンスが要ります。どちらの種類のリソースから届いても同じです —— `ms_sql_server` と `oracledb` の言語が引いているのと同じ線です。他のアダプタはすべて CE で使えます。

自前の `profiles.yml` を持ち続けたいプロジェクトも、そのままにできます。[自前の profiles.yml を使う](#自前の-profilesyml-を使う)を参照してください。

warehouse は、設定した時点で使えるようになります。リソースは実行側で、利用者ごとの権限の検査なしに読まれます —— `s3://` がワークスペースのバケットに届くのとまったく同じです。dbt のスクリプトを実行できる人は誰でも、そこに書かれた warehouse で build できます。

## プロジェクトを取り込む

プロジェクトはそのまま、スクリプトが置かれる場所の隣の `<script>__dbt/` というフォルダに写します。変換の手順も、Windmill のために足すファイルもありません。

```bash
mkdir -p f/analytics/analytics__dbt
cp -r my-dbt-project/. f/analytics/analytics__dbt/
wmill sync push
```

これで `f/analytics/analytics` というスクリプトが配備されます。`wmill sync pull` は bundle をそのまま書き戻すので、この木は dbt 自身が `--project-dir analytics__dbt` で動かせる、正しい dbt のプロジェクトのままです。

```text
f/analytics/
├── analytics.script.yaml           the script's Windmill metadata
└── analytics__dbt/                 the module bundle: the project, unmodified
    ├── wm_dbt.yaml                 the descriptor - OPTIONAL
    ├── dbt_project.yml
    ├── packages.yml
    ├── models/staging/stg_orders.sql
    ├── models/marts/_marts__models.yml
    ├── macros/cents_to_dollars.sql
    ├── seeds/country_codes.csv
    └── snapshots/orders_snapshot.sql
```

プロジェクトであることを示すのが `dbt_project.yml` です —— これが無い bundle を worker は受け付けません。リポジトリを正しい形に保ちたいチームはそれを保ち、[git sync](../../../advanced/11_git_sync/index.mdx) にワークスペースへ押し込ませます。リポジトリを持たないチームは作業中の写しから直に押し込みます。どちらにせよ、プロジェクトの版はスクリプトの版です。配備は不可分で、巻き戻しは配備し直すことで、配備のときに読んだグラフが、実行が build するものと寸分違いません。

2 つのパスが同じスクリプトのパスへ配備しようとすると、黙って上書きされるのではなく誤りになります。つまり `f/analytics/analytics.py` と `f/analytics/analytics__dbt/` は同居できません。

## dbt のエディタ

dbt のスクリプトはコードの本体ではなくプロジェクトなので、それに合った形のエディタで開きます —— ファイルの木、記述子、実行の引数、モデルのグラフ。「新しいスクリプト」の言語の選択肢で dbt を選ぶと、最小のプロジェクト（`wm_dbt.yaml`、`dbt_project.yml`、モデル 1 つ）が用意されます。取り込んだプロジェクトも同じ形で開きます。

![The dbt editor: project file tree, the open model, and the Models pane showing a graph parsed from the editor](./dbt_editor.png 'The dbt editor, with a graph parsed from the buffer')

見出しにはプロジェクトのフォルダ、[エンジン](#エンジン)、アセットの鍵になる warehouse が出ます。記述子が読めないときはそれも知らせます。木からファイルを足したり消したりできます —— `.sql`、`.py`、`.yml`、`.yaml`、`.csv`、`.md`。ただし `dbt_project.yml` だけは消せません。それが bundle をプロジェクトたらしめているからです。ファイルを選ぶと拡張子に応じた文法で開き、記述子は木の根にあります。

実行のボタンは、モデルのファイルを開いていれば `Build <model>`、そうでなければ `Build project` になります。どちらでも bundle 全体が job と一緒に運ばれます —— dbt は `ref()` をプロジェクト全体で解決するので、ファイルの一部だけを動かすことはできないからです。`Build <model>` は、そのモデル向けに dbt 自身の `--select` を足すだけで、そのテストも一緒に付いてきます。モデルでない `.sql`（マクロ、分析、単発のテスト）は名前で選べないので、プロジェクト全体の build になります。

右の枠にはタブが 2 つあります。`Models` は下で説明するグラフ、`Run` は job の log の上に出る実行のフォームです。このフォームはサーバ側で記述子から作られます。dbt のスクリプトに `生成される UI（Generated UI）` の設定タブが無いのはそのためです —— そこで整えたものは次の配備で上書きされてしまいます。

### モデルのグラフを取り直す

`Models` の枠はプロジェクトのグラフを描き、そのグラフがどこから来たのかも示します —— 配備済みのプロジェクトなら `as of last deploy`、一度も配備も取り直しもしていないなら `never parsed`。

`Refresh models` を押すと、いまエディタにあるプロジェクトから描き直します。ファイルに対して本物の `dbt parse` の job を走らせ（`dbt deps` のあと `dbt parse`。build も warehouse への書き込みもありません）、札が `parsed from the editor at 01:18 PM` に変わります。編集中のグラフと配備のグラフはまったく同じように描かれるので、見分けるのはこの札です。グラフは常に dbt 自身のものです —— `ref()` の呼び出しを走査したものではなく、dbt が出した manifest から来るので、`enabled`、マクロが組み立てた ref、繰り返し、パッケージのモデルについて dbt と食い違いません。

parse は、そのスクリプトの [worker のタグ](../../../core_concepts/9_worker_groups/index.mdx)と制限時間のもとで、自分の worker で走ります。閉じたネットワークにつなぐプロジェクトなら、そこへ届く worker で parse されます。埋めてある実行の引数も一緒に運ばれます —— `vars` は `enabled`、schema、別名、関係の身元を左右するので、それ抜きの parse は、それ付きの build とは別のプロジェクトを描いてしまうからです。

dbt を動かす前に `profiles.yml` を書き出すので、記述子が指す warehouse はワークスペースに設定されているものである必要があります。知らない名前を指すプロジェクトは、実行が失敗するのと同じように取り直しにも失敗し、枠には dbt 自身の言い分と parse の job へのリンクが出ます。

節点を選ぶと、そのモデルの SQL とそれが在るファイルが出ます。`Edit` を押せば木の中で開けます。

取り直したグラフは、スクリプトではなく編集中のひとときに属します。配備の版を持たず、それを作った parse の job を通してしか読めず、アセットの持ち主も公表しません。ですから、書いている途中のプロジェクトを取り直しても、ワークスペースの[アセットのグラフ](#アセットのグラフに載るモデル)が配備済みのものについて言うことは変わりません。スクリプトごと・利用者ごとに直近の数回の parse だけが残り、新しいものが来ると古いものから消えます。

## 実行する

配備するとプロジェクトが parse され（`dbt deps` と `dbt parse`。warehouse には触れません）、そのグラフが保管されます。実行すると job ごとに `dbt build` が 1 回呼ばれます —— 並行して動かすのは dbt 自身のスレッド、様子を見せるのが Windmill です。

実行が取る引数は `command` 1 つで、その種別が dbt のコマンドにあたります。ですから、そのコマンドが受け付ける上書きだけを運びます。

| コマンド | すること | 引数 |
| --- | --- | --- |
| `build` | プロジェクトを build する（モデル・seed・snapshot・テストを織り交ぜて） | `select`、`exclude`、`vars`、`full_refresh`、`defer`。いずれも既定は記述子の値 |
| `retry` | 失敗した実行を、失敗した所から再開する。失敗したものと飛ばされたものだけを build し直す | `dbt_retry_job`。再開する実行の id |
| `show` | 何も書かずに、モデルの行を下見する | `model`、`vars`、`limit`（既定 100、最大 1000） |
| `parse` | プロジェクトを parse してモデルのグラフを取り込む。build はしない | `vars` |

記述子が `vars` に埋め込む `{{ placeholder }}` は、1 つにつき必須の実行の引数が 1 つ増えます。日付を引数にしたプロジェクトなら、実行のフォーム・webhook の中身・スケジュールの引数がきちんと用意されます。

`show` と `parse` は実行のフォームの選択肢ではありません —— どちらも目の前のプロジェクトに対してすることで、居場所はグラフと[エディタ](#dbt-のエディタ)です。ただし[フロー](../../6_flows_quickstart/index.mdx)・CLI・API からは受け付けます。エディタの取り直しをスクリプトから起こせるのはそのためです。配備済みの版に対する `parse` は、その実行なりのグラフの写しを記録するだけで、スクリプトが持つものは何も変えません。

実行の最中、実行のページはプロジェクトのグラフの上にモデルごとの状態を映します —— 終わった節点は緑に、まだ build 中のものは回る印に、失敗したものはその後ろに dbt が飛ばした節点を伴って。終わると、どの節点にも状態・所要時間・行数・dbt 自身の言い分が付くので、一部だけ失敗した実行も log を読まずに読み取れます。モデルごとの進み具合の実況は `dbt-core-1x` だけです。他の 2 つのエンジンは、呼び出しが終わってから `run_results.json` を見てすべての節点を確定させます（[エンジン](#エンジン)を参照）。

![A dbt run page: the project graph with each model's status, and a result summary reading 4 passed, 1 failed, 1 skipped of 6 nodes, with the failing model's database error](./dbt_run_live.png 'A run page: per-model status on the graph, and the failure that skipped its downstream')

テストの失敗は dbt 自身の `severity` に従います。`error` のテストは job を失敗させ、失敗した節点の名前を出します。`warn` のテストは、job を失敗させずに知らせます。実行のページでモデルを選ぶと、その SQL と完全修飾の関係名が出ます。`Preview rows` を押すと、その節点だけに対して `dbt show` が飛びます。

失敗した実行のページにある `Resume this run` は、`retry` のコマンドを埋めてくれます。再開のための状態は worker ごとにも、データベースにも保たれるので、データベースにつながるどの worker からでも再開できます。プロジェクト・warehouse・エンジンが変わっていた場合は、取り違えて適用されるのではなく拒まれます。再開は錠を取りません。同時に 2 本走ってはいけないプロジェクトは、スクリプトの[同時実行の上限](../../../core_concepts/21_concurrency_limits/index.md)を設定してください。再開もその上限に含まれます。

## 前の実行に委ねる

`defer` は、その実行が build しない `ref()` を、この実行が書き込む schema ではなく、同じ環境で最後に成功した実行が作った関係に解決します。
そうすると、モデルを 1 つ作業用の schema へ build し直すのに、その上流すべてではなくそのモデルの分だけで済みます。

これは `build` のコマンドの切り替えで、既定は記述子の `defer:` です。`show` は記述子の値を取ります。
記述子だけでなく実行ごとに決められるのは、環境の状態を公表する実行と、それに委ねる実行とが、同じスクリプトの 2 回の呼び出しだからです。
委ねた実行は、読んだ実行の名前を job の log と、結果の `deferred_to` に記します。

その状態とは `manifest.json` と `run_results.json` で、自前の上書きを何もしなかった `build` が成功したときに公表されます。スクリプトごと・環境ごとに保たれます —— ここでいう環境とは、warehouse、dbt が実際に使う target、そしてそれらが解決する database と schema のことです。
ですから `select`・`exclude`・`vars` を上書きした実行は何も公表しませんし、動的な記述子、`retry`、下見、委ねた実行そのものも同じです。
状態は、それを作った worker の上ではなくデータベースに置かれるので、次の実行がどの worker に落ちても読めます。期限切れにはならず、スクリプトと一緒に付いていきます。
`DBT_STATE_INLINE_MAX_BYTES`（8 MiB。worker の[環境変数](../../../core_concepts/47_environment_variables/index.mdx)）を超える manifest は、代わりにインスタンスのオブジェクト保管へ行きます。これは [Enterprise](/pricing) の機能なので、CE ではこの上限がそのまま限界です。

状態が無いまま走るのではなく、委ねること自体が拒まれる場合があります。環境が何も公表していないとき、profile が schema や database を Jinja のテンプレートで選んでいるとき（dbt はそれを展開しますが Windmill はしないので、2 とおりの展開が 1 つの環境に解決されてしまいます）、そしてデータベースへ API 越しにしか届かない[エージェントの worker](../../../core_concepts/28_agent_workers/index.mdx) の上です。
warehouse の指し先を変えたり schema を移したりすると別の環境になるので、関係の名前がもう合わない manifest としてではなく、まだ何も公表されていない環境として読まれます。

dbt 自身の状態の絞り込みも同じ成果物を見比べるので、`select` や `exclude` の中の `state:modified+`・`state:new`・`result:error+` には `defer` が要り、無ければ拒まれます。`dbt-core-2x` と `fusion` は、状態が無いのを空の状態と読んで 0 で終わり、何も build しないか全部 build したうえで成功したと言うからです。
記述子のほうには、そもそもこれらを書けません。記述子の絞り込みはスクリプトが持つ節点も決めるもので、実行が 1 つも無いうちに配備がそれを解決するからです。
`source_status:` はどこでも拒まれます。`run_results.json` を伴わずに公表された状態に対する `result:` の絞り込みも同じで、`retry_failed_nodes` で立ち直った build が保管するのがそれにあたります。

`dbt retry` は再開する実行を `--state` から読みますが、これは委ねるときに manifest を読むのと同じフラグです。この 2 つを分けているのは `dbt-core-1x` だけです（`--defer-state`）。
ですから、委ねた実行は `dbt-core-2x` と `fusion` では再開できませんし、そこでは `retry_failed_nodes` も落とされます。

## 記述子

プロジェクトのフォルダの中にある `wm_dbt.yaml` が、実行の設定を持ちます。これは任意です —— 手を入れていない dbt のプロジェクトは、それだけで完全な Windmill のスクリプトであり、ワークスペースの既定の warehouse に対してプロジェクト全体を動かします —— Windmill ならではの何かが要るときにだけ現れます。

```yaml
# dbt-core-1x (default) | dbt-core-2x | fusion
engine: dbt-core-1x
profile:
  warehouse: main       # a warehouse configured on the workspace, by name
  target: prod          # dbt target within that profile
  # schema: marts       # target schema (BigQuery calls it the dataset)
  # type: postgres      # pin the adapter when inference is wrong
  # profiles_yml: profiles.yml   # or keep the project's own file
# Passed to dbt verbatim - this is dbt's selector grammar, not Windmill's
select: ["tag:nightly+"]
exclude: []
# build (models and tests interleaved) | after_all | none
test_behavior: build
vars:
  run_date: "{{ day }}" # a placeholder becomes a required run argument
  strict: false         # non-string values keep their YAML type
threads: 8
full_refresh: false
# Resolve a ref() this run does not build through the state the last successful
# run of this environment published, instead of through the schema it writes into
defer: false
# Static-analysis pass producing column-level lineage. Needs an engine that does it
column_lineage: false
# Rebuild the nodes a failed build left failed or skipped, in this same job
retry_failed_nodes:
  attempts: 2
  delay_seconds: 30
# Extra env for the project's own {{ env_var() }} lookups
env:
  DBT_PASSWORD: $var:u/alice/warehouse_password
```

| 欄 | 既定 | 用途 |
| --- | --- | --- |
| `engine` | `dbt-core-1x` | どの dbt を動かすか。[エンジン](#エンジン)を参照 |
| `profile.warehouse` | `main` | ワークスペースに設定した warehouse を名前で指す |
| `profile.target` | warehouse のもの、無ければ `default` | その profile の中の dbt の target の名前 |
| `profile.schema` | リソースのもの | 書き込み先の schema。BigQuery では必須（リソースがサービスアカウントの JSON で、dataset を含まないため） |
| `profile.type` | リソースのもの、無ければ推測 | dbt のアダプタ。dbt 自身の `type:` と同じ綴りで書く。推測が誤るときや、リソースが独自の型のときに固定する。`dbt_profile` のリソースは自分の型を名乗るので、記述子がそれと食い違うと、黙って上書きされるのではなく誤りになる |
| `profile.profiles_yml` | - | プロジェクト自身の `profiles.yml` の（プロジェクトからの相対の）パス。書き出す代わりにこれを使う |
| `select` / `exclude` / `selector` | - | そのまま dbt へ渡される。グラフの中でスクリプトが持つ範囲も、これが決める |
| `test_behavior` | `build` | `build` はテストをモデルと織り交ぜる（dbt 自身の既定）。`after_all` は 2 段目としてまとめて走らせる。`none` は飛ばす |
| `vars` | - | `--vars`。値は YAML の型を保つ。文字列の末端には `{{ arg }}` を書け、job の引数から埋められる |
| `threads` | dbt 自身のもの | dbt の `--threads` |
| `full_refresh` | `false` | dbt の `--full-refresh` |
| `defer` | `false` | `build` のコマンドの `defer` の既定値。[前の実行に委ねる](#前の実行に委ねる)を参照 |
| `column_lineage` | `false` | [列ごとの系譜](#列ごとの系譜)を作る静的解析の段を走らせる。書き出せるエンジンでのみ |
| `retry_failed_nodes` | - | `{attempts, delay_seconds}`: build が失敗・飛ばした節点を、同じ job の中でやり直す。最大 10 回。[エージェントの worker](../../../core_concepts/28_agent_workers/index.mdx) では使えない |
| `env` | - | dbt のプロセスの環境。プロジェクト自身の `{{ env_var() }}` の参照と、エンジンのフラグのために使う。`$var:<path>` の値は、その Windmill の[変数](../../../core_concepts/2_variables_and_secrets/index.mdx)に解決される |

`select`・`exclude`・`vars` は実行ごとに上書きできます。`select` を上書きすると、その実行が build するものは変わりますが、グラフが言う「このスクリプトが持つもの」は変わりません。グラフ自体を分けたいなら、プロジェクトを複数のスクリプトに分け、それぞれに絞り込みを持たせてください。知らない欄は、黙って無視されるのではなく parse のときに拒まれます。

グラフが依存するもの（schema・別名・`enabled` に効く `env_var()`）については、スクリプト自身の環境変数ではなく記述子の `env` を使ってください。記述子の対応表は実行だけでなく配備のときの parse にも効くので、保管されたグラフと build とが食い違いません。

### 自前の profiles.yml を使う

自前の `profiles.yml` を持ち続けるプロジェクトは、そのままで動きます —— `profile.profiles_yml` をそれに向け、資格情報は記述子の `env` を通して Windmill の変数として渡します。`{{ env_var() }}` がそれを読みます。そういうプロジェクトも warehouse の名前は書きますが、それはアセットの居場所を言うためだけです。名前は何の権限も与えませんし、書かなければプロジェクトのモデルは他のどこからも届かない節点に落ちます。

## アセットのグラフに載るモデル

プロジェクトが宣言するモデル・seed・snapshot・source は、どれも `dbt://<warehouse>/<schema>/<name>` という名前の[アセット](../../../core_concepts/52_assets/index.mdx)になり、プロジェクトの `ref()` の系譜がその間の辺になります。モデル・seed・snapshot は書き込み、source は読み取りです。各節点は、実体化のしかた（`view`、`table`、`incremental`、`snapshot`、`seed`）、タグ、列のメタデータ（プロジェクトが宣言した説明か、頼んだ場合は[解析された列の schema](#列ごとの系譜)）、データのテストを持ち、スクリプトの節点には実体化するモデルの数が付きます。

![The asset graph of a folder holding two dbt projects: source nodes, model nodes badged view or table, and ref() lineage running between the two projects through a shared table](./dbt_asset_graph.png 'Two dbt projects in one folder, meeting on the table one writes and the other reads')

ワークスペースのグラフは配備のときに書かれるので、取り直すには配備し直します。作りからして動的な記述子（`vars` の中の `{{ }}`、`env` の中の `$var:` の値）は、実行ごとに違うモデルの集合を選びうるので、そういう実行は parse をやり直し、各実行のページにはその実行が実際に build したモデルが出ます。エディタの [Refresh models](#モデルのグラフを取り直す) のほうは、編集中の中身を parse して描きます。一度も配備していないプロジェクトを見せられるのも、そのグラフが編集中のひとときの中に留まるのも、そのためです。

通常のスクリプトも、自分のコードの中で関係の名前を書けば同じ系譜に加われます。Python・TypeScript・DuckDB・Ansible のスクリプトに文字列として書かれた `dbt://` の URI は、そこで[アセットとして見つけられ](../../../core_concepts/52_assets/index.mdx#static-code-analysis)ます。エディタのアセットの枠でそれを読み取りとして印を付ければ、そのスクリプトは dbt のモデルが書くまさにその節点の読み手として描かれます。

```python
# The URI literal is what puts this script on the graph, beside the model.
CUSTOMERS = "dbt://main/analytics/customers"

def main():
    ...
```

1 つ知っておくべき限界があります。ワークスペースの warehouse を 2 つ作って同じ物理的な warehouse を指しても、それらは 1 つになりません。つなげたいなら、両方のプロジェクトを 1 つの warehouse に向けてください。

### 通常のスクリプトから書き込みを宣言する

逆向きの辺は註記で書きます。
dbt 以外のどの言語のスクリプトも、`// materialize manual dbt://<warehouse>/<schema>/<name>` と書けば warehouse の関係へ*書き込む*ことを宣言できます。取り込みの段と、その出力を使う dbt のプロジェクトとが、離れた 2 枚の絵ではなく 1 つの系譜になります。

```python
# pipeline
# materialize manual dbt://main/analytics/raw_orders

def main():
    ...  # your own write against the warehouse
```

このスクリプトと、`analytics.raw_orders` を `source` として読む dbt のモデルは、同じ節点に落ちます。身元を決めるのは、作った道具ではなく物理的な関係のほうだからです。
この宛先が取れるやり方は `manual` だけです。Windmill は warehouse の DDL を作らないので、書き込みはスクリプト自身が出し、Windmill はその結果を記録します。
dbt のスクリプトはこれを宣言できません —— プロジェクトが build するものは `manifest.json` から読むからです。
配備のときの決まりの残りと、実行が何を記録するかは、[warehouse の関係への書き込みを宣言する](../../../core_concepts/63_pipelines/materialization.mdx#declaring-a-warehouse-relation-write)を参照してください。

### どの購読が起きるか

dbt の実行は、下流の実行を起こしません。
dbt はすでに自分の DAG の順序を決めていますし、実行の `select` はプロジェクトのどの部分集合でも build できるので、配備のときの書き込みの集合は、実際に走ったものとは違うからです。
通常の作り手のほうは起こします。上の書き込みを宣言したスクリプトは、終わったときに `# on dbt://<relation>` の購読者を起こします。他のアセットへの書き込みと同じです。
ですから `# on dbt://...` が配備のときに拒まれるのは、dbt のプロジェクトだけが build する関係についてだけです。それは決して起きない連鎖の矢印を描くことになるからです。そういう mart を使う側は、スケジュールで動かすか、グラフから実行してください。
dbt のスクリプトはそもそも購読できません。プロジェクトはアセットの連鎖に起こされるのではなく、自分のスケジュールで走るものだからです。
同じ理由で、フォルダの[パイプライン](../../../core_concepts/63_pipelines/index.mdx)の一員でもありません —— それでもモデルは共有のアセットのグラフに載るので、通常の読み手はその隣に並びます。

## 列ごとの系譜

`ref()` のグラフに加えて、プロジェクトは列ごとの系譜を公表できます —— 関係ごとの本当の列の一覧（型付きで、モデルが出す順のまま）と、列と列を結ぶ辺です。
どちらも `manifest.json` から来るものではありません。あちらの `columns` は書き手が `schema.yml` に書き留めたものですし、列と列を結ぶ辺はそもそも持っていません。
どちらも、エンジンが書き出す静的解析の索引から来ます。これはそれ自体が 1 回の `dbt compile` なので、プロジェクトごとに明示して有効にします。

```yaml
# wm_dbt.yaml
engine: fusion
column_lineage: true
```

厳密な静的解析は、build より厳しい方言です。`select no_such_column from ref(...)` は dbt の既定では通りますが、この解析では誤りになります。
build のフラグではなく別の compile になっているのはそのためです —— この解析が何を決めても build の動きは変わりませんし、解析できなかったプロジェクトは、それまで持っていたグラフをそのまま保ちます。
この段は、グラフを取り込むところならどこでも走ります —— 配備のとき、[Refresh models](#モデルのグラフを取り直す) のとき、そして parse をやり直す実行のときです。
job の残り時間の半分が割り当てられるので、その後ろの build が痩せることはありません。

解析をするエンジンも要ります。
`dbt-core-1x` にはその選択肢がありませんし、`dbt-core-2x` はいまのところフラグを受け付けるものの索引を書きません。ですから系譜を作るエンジンは [`fusion`](#エンジン) です —— しかも、それが自前で解析する warehouse についてだけです。まだ試験扱いのアダプタでは、静的解析が自動的に切られるからです。
これらが build を失敗させることはありません。エンジンが違う、解析が拒まれた、索引が無いか読めない、段が持ち時間を使い切った —— どれも、系譜が部分的になるか無くなるかで終わり、job の log にどれだったかが 1 行残ります。

### どこに出るか

[dbt のエディタ](#dbt-のエディタ)の `Models` の枠でモデルを選ぶか、フォルダの[パイプラインのページ](../../../core_concepts/63_pipelines/index.mdx)で `dbt://` の関係を選ぶと、モデルの SQL の上に 2 つが開きます。

- `columns` —— そのモデルが作る列すべてと、その型、そしてプロジェクトが書き残した説明。解析の段を通していなければ、一覧は宣言されたメタデータだけになり、そうと表示されます。
- 列の追跡 —— 選んだ関係の列に流れ込む列と、そこから導かれる列。

描かれるのは直接の辺だけです —— 値がそのまま通る `copy` と、変換される `mod`。
dbt は、モデルが行を選ぶために読む列（join の鍵、`where` の条件、`group by`）も記録します。それらは保管されますが描かれません。そういう列はそのモデルの出力の列すべてに届くので、図が辺で真っ黒になってしまうからです。

![The dbt editor's details pane for a selected model: its typed column list, then a column-lineage diagram running from the staging models' columns through the model's own to the mart derived from them, above the model's SQL](./dbt_column_trace.webp "A model's columns and its column trace, above its SQL")

### プロジェクトを跨ぎ、パイプラインへ

追跡は 1 つのプロジェクトのものではありません。
あるプロジェクトが作る関係は、別のプロジェクトの source です。ですから追跡は、いま辿り着いた関係を持つプロジェクトへ列を追っていき、そこからまた繰り返します。
パイプラインのページが描くのはこれです —— ワークスペースの生きたグラフを、列が尽きるまで広げたもの。
dbt のエディタだけは例外です。あちらは 1 回の parse の時点の 1 つのプロジェクトを描きます（配備済みの版か、`Refresh models` の裏で走った parse）。追跡もそのプロジェクトの中に留まります。画面に出ているのは、他のプロジェクトの生きたグラフではないからです。

追跡は同じように[パイプライン](../../../core_concepts/63_pipelines/index.mdx)の側へも越えていきます。
dbt のモデルの列を、自分の列の元として名指しする DuckDB のパイプラインのスクリプトは、

```sql
-- pipeline
-- materialize ducklake://main/orders_enriched
-- column amount <- dbt://main/analytics/orders.amount
```

そのモデルの列を、dbt 自身の系譜が与えるのと同じ身元で、パイプラインの[列ごとの系譜](../../../core_concepts/63_pipelines/materialization.mdx#column-level-lineage)のグラフに載せます。2 つは 1 つのグラフになります。
DuckLake の表を選べば、それを書いたスクリプトを通って、元になった dbt のモデルまで遡れますし、dbt のモデルを選べば、そこからパイプラインが何を導いたかを辿れます。

### 誰が辿れて、どこで止まるか

列ごとの系譜は、その関係を作るプロジェクトを読めるかどうかで守られています。モデルの SQL とまったく同じ扱いです —— これは書き手が書いたものの形であり、`ref()` のグラフより 1 段細かいものだからです。`ref()` のグラフに制限が無いのは、呼び出した人がすでに見られる関係を描いているからにすぎません。
ですから、dbt の実行を見る権限はあるがプロジェクトを読む権限は無い人には、その実行の関係と `ref()` の辺までは見えて、SQL も列も見えません。
追跡はプロジェクトを跨ぐので、この検査は選んだ 1 つについて一度きりではなく、辿り着くプロジェクトごとに決め直されます —— ある関係に届いたことは、その向こう側のプロジェクトを誰が読んでよいかについて何も語らないからです。プロジェクト自身の見え方と、トークンの [`scripts:read` の範囲](../../../core_concepts/59_user_tokens/index.mdx#token-scopes)の両方がプロジェクトごとに効き、追跡は呼び出した人の届く先で終わります。

追跡は 5000 本の辺でも止まります。
選んだ関係から外へ向かって辿るので、打ち切られた答えには選んだ場所に近いところが残ります。枠には「系譜は描ける範囲より先まで続いている」と出ます —— 打ち切られた追跡が、そこで終わった追跡のように見えてしまわないためです。

### API から

`GET /api/w/<workspace>/assets/column_lineage` は、1 つ以上の関係のまわりの追跡を返します。
`asset_path` は関係の数だけ繰り返します（`dbt://` の URI から scheme を除いたもの）。1 回の選択が複数に届きうるので、それらは 1 つにまとめて返されます。
最低 1 つ、最大 1000 個までです。1 つも書かない要求と、それを超える要求は、空の答えではなく拒否が返ります。
`dbt_script_hash` を付けると、答えは 1 つのプロジェクトの 1 つの配備済みの版に固定されます。付けなければ、上に書いたとおりプロジェクトを跨ぎます。

```bash
curl -H "Authorization: Bearer $WM_TOKEN" \
  "$BASE_INTERNAL_URL/api/w/$WM_WORKSPACE/assets/column_lineage?asset_path=main/analytics/customers"
```

```json
{
  "edges": [
    {
      "from_asset_path": "main/analytics/stg_customers",
      "from_column": "customer_id",
      "to_asset_path": "main/analytics/customers",
      "to_column": "customer_id",
      "kind": "copy"
    }
  ],
  "truncated": false
}
```

打ち切られた追跡と、完全な追跡とを見分けるのが `truncated` です。
`GET /api/w/<workspace>/jobs/dbt_column_lineage/<job_id>` も同じように `asset_path` を繰り返し取り、ある job が走らせたプロジェクトの版について答えます。認可は job を通して行われます —— これは、配備の版を持たないグラフ（エディタが編集中の中身を parse したものなど）に届く唯一の方法です。

## エンジン

`engine` は、どの dbt がプロジェクトを動かすかを選びます。どれもイメージには焼き込まれていません —— 最初に使うときに取得か構築が行われ、worker に取っておかれます。

| エンジン | 何か | 初回の立ち上がり | モデルごとの実況 |
| --- | --- | --- | --- |
| `dbt-core-1x`（既定） | dbt Core 1.x。アダプタごとに解決される uv の仮想環境 | (core の範囲, アダプタ) の組ごとに venv を 1 回構築 | あり |
| `dbt-core-2x` | dbt Core 2.x。GitHub のリリースから取る、アダプタに依らない実行ファイル 1 つ | ダウンロード 1 回 | なし。実行の終わりにまとめて確定 |
| `fusion` | dbt Fusion のエンジン。dbt Labs から取得し、あちらのライセンス条項に従う | 約 290 MB のダウンロード 1 回 | なし。実行の終わりにまとめて確定 |

既定が `dbt-core-1x` なのは、いまあるプロジェクトを手を入れずに動かせるからです。dbt Core 2.x と Fusion は v2 の意味づけで、非推奨だった機能をすべて落としています。ですから正しい 1.x のプロジェクトでも、非推奨の箇所を直すまでは parse に失敗することがあります。

エンジンの用意は、worker の[環境変数](../../../core_concepts/47_environment_variables/index.mdx)で調整できます。`DBT_CORE_1X_FLOOR` と `DBT_CORE_1X_CEILING` が解決される 1.x の範囲を挟み、`DBT_CORE_2X_VERSION` が 2.x を固定します。`DBT_BUNDLED_DIR`（既定は `/usr/local/dbt`）を使えば、外とつながらないインスタンス向けに、派生させたイメージへエンジンをあらかじめ仕込んでおけます —— worker は自分のキャッシュよりそちらを優先します。dbt の job は `dbt` の [worker のタグ](../../../core_concepts/9_worker_groups/index.mdx)で走ります。これは既定の集合に入っています。

### インスタンスが入れるアダプタ

`dbt-core-1x` はアダプタごとに仮想環境を作り、アダプタ自体は `dbt-<adapter>` として PyPI から取ります。ですからどのパッケージを入れてよいかは、スクリプトを書く人ではなく運用する人が決めることです。Windmill は公開されている `dbt-*` のアダプタを保証します（postgres、snowflake、bigquery、databricks、redshift、trino、athena、clickhouse、duckdb、spark と、同梱の一覧の残り）。worker の `DBT_EXTRA_ADAPTERS` でそこに足せます。dbt 自身の `type:` と同じ綴りのアダプタ名を、コンマ区切りで書きます。どちらの一覧にも無いアダプタは、取りに行かれるのではなく、自分の名前を挙げて job を失敗させます。

`dbt-core-2x` と `fusion` はアダプタを実行ファイルの中に持っていて何も入れないので、どのアダプタでも受け付けますし、足すべき一覧もありません。

## bundle に入るもの

bundle に入るのは、人が書いたプロジェクトのファイルだけです。

- dbt が作るディレクトリは除かれます: `target`、`dbt_packages`、`logs`、`.git`、`.venv`、`__pycache__`。加えて `dbt_project.yml` が `target-path`・`packages-install-path`・`clean-targets` に指定したものも。
- 運ばれるのはテキストだけです。バイナリのファイル（`docs/` の下の画像、`.DS_Store`、parquet の seed）は、理由を添えて飛ばされます。
- `.env`、`.env.*`、`.envrc` は飛ばされます。`.gitignore` がリポジトリから締め出していたものが、代わりにスクリプトの版になってはいけないからです。dbt は `env_var()` をプロセスの環境から読み、そこを埋めるのは記述子の `env` です。
- 5 MB を超えるファイルは、飛ばされるのではなく誤りになります。dbt はそのファイルを読んだはずなので、それ抜きで配備すると、実行時に「関係が無い」と失敗するプロジェクトを出荷することになるからです。commit されたデータの集まりは、warehouse に置くべきものです。

[dbt のエディタ](#dbt-のエディタ)は bundle をその場で編集しますが、それでも dbt のプロジェクトを開発する場所はブラウザではありません。開発は、何度も試せる warehouse に対して手元で `dbt run` と `dbt test` を回すことです。Windmill は実行する場所、見る場所、そしてプロジェクトを直す場所です。module だけを編集した場合も、親のスクリプトごと押し込まれます。ですからモデルを編集したあとの `wmill sync push` は、プロジェクトを 1 回配備します。

## 依存

`packages.yml` に範囲を書いたプロジェクトは、dbt にその解決を頼むことになり、dbt は `dbt deps` のたびに解決し直します。Windmill は配備のときに一度だけ解決し、その結果をエンジンとアダプタの版と並べてスクリプトの lockfile に固定します —— ここでの他のすべての言語と同じ約束です。実行のときは、その解決を鍵にした worker の中のキャッシュからパッケージの木を戻します。別のものを解決してしまった worker は、走るのではなく拒まれます。

ここから 2 つのことが言えます。1 つは、範囲で書いた依存の新しい版を取り込むには何か変更を配備する必要があること —— 解決し直すのは配備だけだからです。もう 1 つは、`package-lock.yml` を commit しておけば、配備が本物の `dbt deps` を払わずにキャッシュに当たること。これは同じ理由から dbt 自身も勧めていることです。

worker の中のキャッシュ（パッケージの木、エンジンの導入、再開のための状態）は `$WINDMILL_DIR/cache_nomount/` の下に置かれ、`cache_clear` では回収されません。場所を食うのは主にエンジンの導入で、1 つおよそ 270〜290 MB です。

## 関連

<div className="grid grid-cols-2 gap-6 mb-4">
	- [アセット](https://www.windmill.dev/docs/core_concepts/assets) —— スクリプトが読み書きするデータの集まりを Windmill がどう見つけて追うのか、系譜がどう描かれるのか。
	- [パイプライン](https://www.windmill.dev/docs/core_concepts/pipelines) —— アセットを軸にした Windmill 本来の組み立て。DuckDB の変換を、管理された DuckLake の表として実体化する。
	- [コマンドライン](https://www.windmill.dev/docs/advanced/cli) —— ワークスペースを手元のフォルダと同期し、スクリプトを push / pull し、手元で開発する。
	- [トリガー](../../../triggers/index.mdx) —— スクリプトとフローを、手動・スケジュール・外部の出来事で起こす。
</div>
