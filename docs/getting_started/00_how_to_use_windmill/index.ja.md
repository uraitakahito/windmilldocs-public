---
description: How do I get started with Windmill? Set up your workspace, create your first script, flow or app, and deploy it in minutes.
---
> **[原文](./index.mdx)の日本語訳。** 相違があれば原文が正。
> 原典 © Windmill Labs, Inc. — [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。この訳も同じライセンスで提供します。
>
> **未訳。** 以下は原文のままです。

# Getting started with Windmill

Windmill is a fast, **<a href="https://github.com/windmill-labs/windmill">open-source</a>** workflow engine and developer platform to build endpoints, workflows and UIs, coding in TypeScript, Python, Go, and [many other languages](../0_scripts_quickstart/index.mdx). For the full pitch and how Windmill compares to its alternatives, see [What is Windmill?](../../intro.mdx).

## Choose your setup

### Windmill cloud

Quickly get started with our [Cloud App](https://app.windmill.dev/), no credit card required. Sign up using GitHub, GitLab, Google, or Microsoft SSO. Start with 1,000 monthly executions on our Community Plan, and easily upgrade for more. [Start with Windmill cloud](https://app.windmill.dev/).

Windmill cloud is hosted in the US. We offer dedicated cloud instances in the EU for [Cloud Enterprise](/pricing) customers.

### Self-host Windmill

For full control over your infrastructure, self-host Windmill using our [helm charts](https://github.com/windmill-labs/windmill-helm-charts) for Kubernetes or docker-compose for simpler setups. [Learn how to self-host Windmill](../../advanced/1_self_host/index.mdx).

<div className="grid grid-cols-2 gap-6 mb-4">
	- [Self-host Windmill](https://www.windmill.dev/docs/advanced/self_host/) —— Self host Windmill in 2 minutes.
</div>

## Development options

### Integrated Development Environment (IDE)
Windmill supports development directly within its [built-in IDE](../../code_editor/index.mdx), tailored for creating scripts, workflows, [low-code apps](../../apps/0_app_editor/index.mdx) and [full-code apps](../../full_code_apps/index.mdx) efficiently.

### Local development
Prefer your own setup? No problem. Windmill integrates smoothly with local environments, including a [VS Code extension](../../cli_local_dev/1_vscode-extension/index.mdx) and tools for [Git-based deployment to production](../../advanced/12_deploy_to_prod/index.mdx). [Explore local development options](../../advanced/4_local_development/index.mdx).
<div className="grid grid-cols-2 gap-6 mb-4">
	- [Local development](https://www.windmill.dev/docs/advanced/local_development) —— Develop from various environments such as your terminal, VS Code, and JetBrains IDEs.
	- [VS Code extension](https://www.windmill.dev/docs/cli_local_dev/vscode-extension) —— Build scripts and flows in the comfort of your VS Code or Cursor editor, while leveraging Windmill UIs for test & flows edition.
</div>

### Ready to deploy?

Move from staging to production seamlessly with Windmill's deployment guides, ensuring your projects are production-ready. [Deploy to production](../../advanced/12_deploy_to_prod/index.mdx).

## Creating resources from the home page

The workspace home page lists everything in your workspace. To create something new, use the **New** button in the top-right corner of the header. Hovering (or clicking) it opens a two-pane popover: the option list on the right, a description of the highlighted option on the left. Clicking **New** directly creates a script, the default option.

<!-- SCREENSHOT PLACEHOLDER: the "New" popover on the home page, opened. Two panes — description on the left, option list on the right — with the option rows (Script, Flow, App (full-code), Workflow-as-Code, Data pipelines, App (low-code)) and the Advanced / Alpha / Legacy badges visible. Reference PR screenshot: shots/worktree-home-plus-new-popover/1782636902-reordered.png. Save as new_popover.png (+ new_popover.png.webp) next to this file. -->

The available options are:

- [Script](../0_scripts_quickstart/index.mdx) - a single standalone script in [any supported language](../0_scripts_quickstart/index.mdx).
- [Flow](../../flows/1_flow_editor.mdx) - compose scripts into a workflow with branches, loops, approvals and retries.
- [App (full-code)](../9_full_code_apps_quickstart/index.mdx) - build a UI with React or Svelte.
- [Workflow-as-Code](../../core_concepts/31_workflows_as_code/index.mdx) - badged _Advanced_. Express a whole workflow as a single script; picking it offers a **Python** or **TypeScript** choice.
- [Data pipelines](../10_pipeline_quickstart/index.mdx) - badged _Alpha_. Visual editor to chain ingestion, transformation and materialization steps.
- [App (low-code)](../7_apps_quickstart/index.mdx) - badged _Legacy_. Drag-and-drop UI builder. For new apps, prefer full-code apps.

Some options also expose secondary import actions in their detail panel (for example _Import flow_, _Import Workflow-as-Code_, _Import full-code app_, _Import low-code app_), which open a drawer where you paste a YAML or JSON export to pre-fill the editor.

The header also has a **Hub** button that opens the [Windmill Hub](https://hub.windmill.dev/) in a new tab, and a **CLI / MCP** button to connect external tooling.