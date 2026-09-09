---
description: How do I build my first pipeline in Windmill? A step-by-step guide to DuckDB scripts that materialize DuckLake tables, wired automatically by asset lineage.
---
> **[原文](./index.mdx)の日本語訳。** 相違があれば原文が正。
> 原典 © Windmill Labs, Inc. — [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。この訳も同じライセンスで提供します。
>
> **未訳。** 以下は原文のままです。

# Pipelines quickstart

:::caution Alpha
Pipelines are in alpha. The entry point is deliberately tucked away while we develop the feature, and the annotation syntax and behavior described in this guide are still evolving and may change in future releases. We would love your feedback - share it on [Discord](https://discord.com/invite/V7PM2YHsPB) or [GitHub](https://github.com/windmill-labs/windmill).
:::

This guide builds your first [pipeline](../../core_concepts/63_pipelines/index.mdx): a set of scripts in a folder wired together automatically by the data they read and write, no manual orchestration. It uses the recommended [DuckDB](../../integrations/duckdb.md) + [DuckLake](../../core_concepts/11_persistent_storage/ducklake.mdx) path, where each step materializes a table (this is what makes the writes idempotent, versioned and testable). It takes about five minutes.

DuckLake is not required, though. Pipelines wire scripts in any language (Python, TypeScript, ...) by the plain [assets](../../core_concepts/52_assets/index.mdx) they exchange - S3 objects, resources, data tables or volumes - with the same `-- on` model and no materialization. See [inputs and outputs](../../core_concepts/63_pipelines/index.mdx#inputs-and-outputs-assets) for that path; this guide shows DuckLake because it is the most powerful default.

Already using dbt? You do not have to port the project into a pipeline. Windmill runs an unmodified dbt project as [a script of its own kind](../0_scripts_quickstart/16_dbt_quickstart/index.mdx), with dbt still owning its models, refs and tests, and shows its models in the asset graph as `dbt://` nodes beside whatever pipelines you build. Windmill's own pipelines page (`/pipeline`) points there too, next to the [warehouse settings](../0_scripts_quickstart/16_dbt_quickstart/index.mdx#configure-a-warehouse) a dbt project needs.

:::info Prerequisite
Because this guide uses DuckLake, you need a [workspace storage and a DuckLake](../../core_concepts/11_persistent_storage/ducklake.mdx) configured. The default DuckLake is named `main`; this guide uses it. (A plain S3-based pipeline needs only the [workspace storage](../../core_concepts/38_object_storage_in_windmill/index.mdx#workspace-object-storage).)

On a fresh workspace the pipelines page shows a **setup checklist** whenever either prerequisite is missing, with a link straight to the [workspace object storage](../../core_concepts/38_object_storage_in_windmill/index.mdx#workspace-object-storage) and [DuckLake](../../core_concepts/11_persistent_storage/ducklake.mdx) settings that fix it. Nothing materializes until both are set.
:::

## 1. Create a pipeline

On the home page, click **New** and select **Data pipelines** (badged _Alpha_) in the popover.

<!-- SCREENSHOT PLACEHOLDER: the "New" popover on the home page with the "Data pipelines" option (Alpha badge) highlighted, its description showing in the left pane. Replaces the outdated create_pipeline_menu.png (which showed the old "+ Flow" dropdown). Save as create_pipeline_menu.png (+ .webp) next to this file. -->
![Create a pipeline from the New popover](./create_pipeline_menu.png 'Create a pipeline from the New popover')

You can also open the pipelines index page at `/pipeline`: it lists existing pipelines with their script counts and lets you pick or create a folder. When you edit a SQL or DuckDB script that is not yet part of a pipeline, a dismissible hint below the toolbar links there too.

![The pipelines index page](./pipeline_index_page.png 'The pipelines index page')

Pipelines live in a [folder](../../core_concepts/8_groups_and_folders/index.mdx) (for example `f/demo`); every script you add to it and mark with `-- pipeline` becomes part of the same pipeline graph.

## 2. Add a producer script

Create a DuckDB script `f/demo/ingest`. The `-- pipeline` line places it in the folder's pipeline, and `-- materialize` tells Windmill to own the write: it creates the `ducklake://main/events` table from the trailing `SELECT` and records a snapshot and row count.

```sql
-- pipeline
-- materialize ducklake://main/events

SELECT * FROM (VALUES
  (1, 'click', TIMESTAMP '2026-01-01 10:00'),
  (2, 'view',  TIMESTAMP '2026-01-01 10:05'),
  (3, 'click', TIMESTAMP '2026-01-01 11:00')
) AS t(id, kind, ts);
```

## 3. Add a consumer script

Create a DuckDB script `f/demo/rollup`. The `-- on ducklake://main/events` annotation declares the table it reads, which becomes an incoming edge: this script runs automatically whenever `events` is materialized. It materializes its own aggregate table.

```sql
-- pipeline
-- on ducklake://main/events
-- materialize ducklake://main/events_by_kind

ATTACH 'ducklake://main' AS dl;

SELECT kind, count(*) AS n
FROM dl.events
GROUP BY kind;
```

## 4. Open the pipeline graph

Open the folder and select the pipeline view. You will see the lineage:

`ingest` → `ducklake://main/events` → `rollup` → `ducklake://main/events_by_kind`

## 5. Run it

On the `ingest` node, choose "Run + downstream". `ingest` materializes `events`, and the asset cascade automatically fires `rollup`, which materializes `events_by_kind`. Each node shows live status, its DuckLake snapshot and row count as the run progresses, and the result panel previews the materialized table.

That is the whole model: mark scripts with `-- pipeline`, declare inputs with `-- on`, and Windmill infers and runs the graph from asset lineage. Adding `-- materialize` (the optional DuckLake layer used here) is what also gives you idempotent re-runs, time-travel, [data tests](../../core_concepts/63_pipelines/materialization.mdx#data-tests) and [backfill](../../core_concepts/63_pipelines/materialization.mdx#partition-status-and-backfill) with no extra work.

## Next steps

Add materialization strategies (merge, append, SCD2 history), partitions, schedules, AND/OR joins, data tests and debounce. Every annotation and option is documented, with examples, on the concept page.

<div className="grid grid-cols-2 gap-6 mb-4">
	- [Pipelines](https://www.windmill.dev/docs/core_concepts/pipelines) —— Full reference: every annotation and option with examples (materialize, partitions, joins, data tests, debounce).
	- [DuckLake](https://www.windmill.dev/docs/core_concepts/persistent_storage/ducklake) —— The managed lakehouse tables your pipeline steps materialize into: catalog, versioning and ACID transactions on S3.
	- [Assets](https://www.windmill.dev/docs/core_concepts/assets) —— How Windmill detects and tracks the S3 objects, resources and tables your scripts read and write.
	- [dbt](https://www.windmill.dev/docs/getting_started/scripts_quickstart/dbt) —— Run an existing dbt project on Windmill unchanged, as a script of its own, with its models in the asset graph.
</div>
