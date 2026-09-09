---
description: Windmill で最初のパイプラインを組むには。DuckLake のテーブルを書き出す DuckDB のスクリプトを、資産の系譜で自動的につなぐ手引き。
---

> **[原文](./index.mdx)の日本語訳。** 相違があれば原文が正。
> 原典 © Windmill Labs, Inc. — [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。この訳も同じライセンスで提供します。

# パイプラインのクイックスタート

:::caution Alpha
パイプラインは alpha です。開発中のため入口はあえて目立たない場所に置いてあり、この手引きで説明する注釈の書き方と挙動も、まだ変わりうるものです。感想を [Discord](https://discord.com/invite/V7PM2YHsPB) か [GitHub](https://github.com/windmill-labs/windmill) でぜひ聞かせてください。
:::

この手引きでは、最初の[パイプライン](../../core_concepts/63_pipelines/index.mdx)を組みます。フォルダに入れたスクリプトの束が、読み書きするデータによって自動的につながる —— 手で並べる必要はありません。ここでは勧められている [DuckDB](../../integrations/duckdb.md) ＋ [DuckLake](../../core_concepts/11_persistent_storage/ducklake.mdx) の道筋を使い、各段がテーブルを書き出す形にします（これが、書き込みを冪等かつ版付きで、試験できるものにします）。所要は 5 分ほどです。

とはいえ DuckLake は必須ではありません。パイプラインは、やり取りする素の[資産](../../core_concepts/52_assets/index.mdx) —— S3 のオブジェクト、リソース、データのテーブル、ボリューム —— を通じて、どの言語のスクリプト（Python・TypeScript など）でもつなげます。`-- on` の考え方は同じで、書き出しは要りません。その道筋は[入力と出力](../../core_concepts/63_pipelines/index.mdx#inputs-and-outputs-assets)を参照してください。ここで DuckLake を使うのは、それが最も強力な既定だからです。

既に dbt を使っていますか。プロジェクトをパイプラインへ移す必要はありません。Windmill は手を加えていない dbt プロジェクトを[それ自体で 1 つの種類のスクリプト](../0_scripts_quickstart/16_dbt_quickstart/index.mdx)として実行します。model・ref・test は dbt が持ったままで、資産のグラフには `dbt://` の節点として、あなたが組んだパイプラインと並んで出ます。Windmill のパイプラインのページ（`/pipeline`）からもそこへ辿れますし、隣には dbt プロジェクトに要る[ウェアハウスの設定](../0_scripts_quickstart/16_dbt_quickstart/index.mdx#configure-a-warehouse)もあります。

:::info 前提
この手引きは DuckLake を使うので、[ワークスペースの保管領域と DuckLake](../../core_concepts/11_persistent_storage/ducklake.mdx) の設定が要ります。既定の DuckLake の名前は `main` で、ここではそれを使います。（S3 だけを使う素のパイプラインなら、[ワークスペースの保管領域](../../core_concepts/38_object_storage_in_windmill/index.mdx#workspace-object-storage)だけで足ります。）

作りたてのワークスペースでは、どちらかの前提が欠けているあいだ、パイプラインのページに**準備の一覧**が出ます。そこから[ワークスペースのオブジェクト保管](../../core_concepts/38_object_storage_in_windmill/index.mdx#workspace-object-storage)と [DuckLake](../../core_concepts/11_persistent_storage/ducklake.mdx) の設定へ直接行けます。両方が揃うまで、何も書き出されません。
:::

## 1. パイプラインを作る

ホーム画面で **新規（New）** をクリックし、ポップオーバーから **データパイプライン（Data pipelines）**（_Alpha_ の印付き）を選びます。

<!-- SCREENSHOT PLACEHOLDER: the "New" popover on the home page with the "Data pipelines" option (Alpha badge) highlighted, its description showing in the left pane. Replaces the outdated create_pipeline_menu.png (which showed the old "+ Flow" dropdown). Save as create_pipeline_menu.png (+ .webp) next to this file. -->
![Create a pipeline from the New popover](./create_pipeline_menu.png 'Create a pipeline from the New popover')

`/pipeline` のパイプライン一覧ページを開くこともできます。既存のパイプラインがスクリプトの数とともに並び、フォルダを選ぶか新しく作れます。まだどのパイプラインにも属していない SQL や DuckDB のスクリプトを編集していると、ツールバーの下に、そこへ導く（閉じられる）案内が出ます。

![The pipelines index page](./pipeline_index_page.png 'The pipelines index page')

パイプラインは[フォルダ](../../core_concepts/8_groups_and_folders/index.mdx)（たとえば `f/demo`）の中に置かれます。そのフォルダに入れて `-- pipeline` を付けたスクリプトは、すべて同じパイプラインのグラフの一部になります。

## 2. 作る側のスクリプトを足す

DuckDB のスクリプト `f/demo/ingest` を作ります。`-- pipeline` の行がそれをフォルダのパイプラインに置き、`-- materialize` が「書き込みは Windmill が受け持つ」ことを伝えます。末尾の `SELECT` から `ducklake://main/events` のテーブルを作り、スナップショットと行数を記録します。

```sql
-- pipeline
-- materialize ducklake://main/events

SELECT * FROM (VALUES
  (1, 'click', TIMESTAMP '2026-01-01 10:00'),
  (2, 'view',  TIMESTAMP '2026-01-01 10:05'),
  (3, 'click', TIMESTAMP '2026-01-01 11:00')
) AS t(id, kind, ts);
```

## 3. 使う側のスクリプトを足す

DuckDB のスクリプト `f/demo/rollup` を作ります。`-- on ducklake://main/events` の注釈が、読み込むテーブルを宣言します。これが入ってくる辺になり、`events` が書き出されるたびにこのスクリプトが自動で走ります。そして自分自身の集計テーブルを書き出します。

```sql
-- pipeline
-- on ducklake://main/events
-- materialize ducklake://main/events_by_kind

ATTACH 'ducklake://main' AS dl;

SELECT kind, count(*) AS n
FROM dl.events
GROUP BY kind;
```

## 4. パイプラインのグラフを開く

フォルダを開いてパイプラインの表示を選びます。系譜が見えます。

`ingest` → `ducklake://main/events` → `rollup` → `ducklake://main/events_by_kind`

## 5. 動かす

`ingest` の節点で「実行と下流（Run + downstream）」を選びます。`ingest` が `events` を書き出し、資産の連鎖が `rollup` を自動で起こし、それが `events_by_kind` を書き出します。実行が進むにつれて、各節点に状態・DuckLake のスナップショット・行数が出ます。結果の欄には書き出されたテーブルの下見が出ます。

これが全体の考え方です —— スクリプトに `-- pipeline` を付け、入力を `-- on` で宣言すれば、Windmill が資産の系譜からグラフを推論して実行します。ここで使った `-- materialize`（任意の DuckLake の層）を足すと、冪等な再実行・時間をさかのぼった参照・[データの試験](../../core_concepts/63_pipelines/materialization.mdx#data-tests)・[遡っての埋め直し](../../core_concepts/63_pipelines/materialization.mdx#partition-status-and-backfill)まで、追加の手間なしに手に入ります。

## 次は

書き出しの方式（merge・append・SCD2 の履歴）、区画、スケジュール、AND / OR の結合、データの試験、抑制などを足せます。注釈と選択肢はすべて、例つきで概念のページに書かれています。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [パイプライン](https://www.windmill.dev/docs/core_concepts/pipelines) —— 全体の参照: 注釈と選択肢を例つきで（materialize・区画・結合・データの試験・抑制）。
	- [DuckLake](https://www.windmill.dev/docs/core_concepts/persistent_storage/ducklake) —— パイプラインの各段が書き出す、管理されたレイクハウスのテーブル。S3 上のカタログ・版管理・ACID なトランザクション。
	- [資産](https://www.windmill.dev/docs/core_concepts/assets) —— スクリプトが読み書きする S3 のオブジェクト・リソース・テーブルを、Windmill がどう見つけて追うか。
	- [dbt](https://www.windmill.dev/docs/getting_started/scripts_quickstart/dbt) —— 既存の dbt プロジェクトを手を加えずに Windmill で動かし、その model を資産のグラフに出す。
</div>
