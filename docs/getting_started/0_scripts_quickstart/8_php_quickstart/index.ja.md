---
title: 'PHP quickstart'
description: 'How do I write PHP scripts in Windmill? Create, test and deploy PHP scripts with Composer dependency management.'
slug: '/getting_started/scripts_quickstart/php'
---
> **[原文](./index.mdx)の日本語訳。** 相違があれば原文が正。
> 原典 © Windmill Labs, Inc. — [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。この訳も同じライセンスで提供します。
>
> **未訳。** 以下は原文のままです。

# PHP quickstart

In this quick start guide, we will write our first script in php.

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

This tutorial covers how to create a simple script through Windmill web IDE. See the dedicated page to [develop scripts locally](../../../advanced/4_local_development/index.mdx).

<div className="grid grid-cols-2 gap-6 mb-4">
	- [Local development](https://www.windmill.dev/docs/advanced/local_development) —— Develop from various environments such as your terminal, VS Code, and JetBrains IDEs.
</div>

Scripts are the basic building blocks in Windmill. They can be [run and scheduled](../../../triggers/index.mdx) as standalone, chained together to create [Flows](../../../flows/1_flow_editor.mdx) or displayed with a personalized User Interface as [Apps](../../7_apps_quickstart/index.mdx).

<div className="grid grid-cols-2 gap-6 mb-4">
	- [Script editor](../../../script_editor/index.mdx) —— All the details on scripts.
	- [Triggers](../../../triggers/index.mdx) —— Trigger scripts and flows on-demand, by schedule or on external events.
</div>

Scripts consist of 2 parts:

- [Code](#code): for php scripts, it must have at least a main function.
- [Settings](#settings): settings & metadata about the Script such as its path, summary, description, [JSON Schema](../../../core_concepts/13_json_schema_and_parsing/index.mdx) of its inputs (inferred from its signature).

When stored in a code repository, these 2 parts are stored separately at `<path>.php` and `<path>.script.yaml`

Windmill automatically manages [dependencies](../../../advanced/6_imports/index.mdx) for you. When you import libraries in your php script, Windmill parses these imports upon saving the script and automatically generates a list of dependencies. It then spawns a dependency job to associate these Composer packages with a lockfile, ensuring that the same version of the script is always executed with the same versions of its dependencies.

This is a simple example of a script built in php with Windmill:

```
<?php

// remove the first // of the following lines to specify packages to install using composer
// // require:
// // monolog/monolog@3.6.0
// // stripe/stripe-php

function main(
	// Postgresql $a,
  // array $b,
  // object $c,
	int $d = 123,
	string $e = "default value",
	float $f = 3.5,
  bool $g = true,
) {
	return $d;
}
```

From the Home page, click **New** and select **Script**. This will take you to the first step of script creation: [Metadata](../../../script_editor/settings.mdx#metadata).

## Settings

![New script](../../../../static/images/script_languages.png "New script")

As part of the [settings](../../../script_editor/settings.mdx) menu, each script has metadata associated with it, enabling it to be defined and configured in depth.

- **Summary** (optional) is a short, human-readable summary of the Script. It will be displayed as a title across Windmill. If omitted, the UI will use the `path` by default.
- **Path** is the Script's unique identifier that consists of the [script's owner](../../../core_concepts/16_roles_and_permissions/index.mdx), and the script's name. The owner can be either a user, or a group ([folder](../../../core_concepts/8_groups_and_folders/index.mdx#folders)).
- **Description** is where you can give instructions through the [auto-generated UI](../../../core_concepts/6_auto_generated_uis/index.mdx) to users on how to run your Script. It supports markdown.
- **Language** of the script.
- **Script kind**: Action (by default), [Trigger](../../../flows/10_flow_trigger.mdx), [Approval](../../../flows/11_flow_approval.mdx), [Error handler](../../../flows/7_flow_error_handler.md) or [Preprocessor](../../../core_concepts/43_preprocessors/index.mdx). This acts as a tag to filter appropriate scripts from the [flow editor](../../6_flows_quickstart/index.mdx).

This menu also has additional settings on [Runtime](../../../script_editor/settings.mdx#runtime), [Generated UI](#generated-ui) and [Triggers](../../../script_editor/settings.mdx#triggers).

<div className="grid grid-cols-2 gap-6 mb-4">
	- [Settings](../../../script_editor/settings.mdx) —— Each script has metadata & settings associated with it, enabling it to be defined and configured in depth.
</div>

Now click on the code editor on the left side.

## Code

Windmill provides an online editor to work on your Scripts. The left-side is
the editor itself. The right-side [previews the UI](../../../core_concepts/6_auto_generated_uis/index.mdx) that Windmill will
generate from the Script's signature - this will be visible to the users of the
Script. You can preview that UI, provide input values, and [test your script](#instant-preview--testing) there.

![Editor for php](./editor_php.png "Editor for php")

<div className="grid grid-cols-2 gap-6 mb-4">
	- [Code editor](../../../code_editor/index.mdx) —— The code editor is Windmill's integrated development environment.
	- [Auto-generated UIs](https://www.windmill.dev/docs/core_concepts/auto_generated_uis) —— Windmill creates auto-generated user interfaces for scripts and flows based on their parameters.
</div>

As we picked `php` for this example, Windmill provided some php
boilerplate. Let's take a look:

```php
<?php

// remove the first // of the following lines to specify packages to install using composer
// // require:
// // monolog/monolog@3.6.0
// // stripe/stripe-php

function main(
	// Postgresql $a,
  // array $b,
  // object $c,
	int $d = 123,
	string $e = "default value",
	float $f = 3.5,
  bool $g = true,
) {
	return $d;
}
```

In Windmill, scripts need to have a `main` function that will be the script's
entrypoint. There are a few important things to note about the `main`.

- The main arguments are used for generating
  1.  the [input spec](../../../core_concepts/13_json_schema_and_parsing/index.mdx) of the Script
  2.  the [frontend](../../../core_concepts/6_auto_generated_uis/index.mdx) that you see when running the Script as a standalone app.
- Type annotations are used to generate the UI form, and help pre-validate
  inputs. While not mandatory, they are highly recommended. You can customize
  the UI in later steps (but not change the input type!).

<div className="grid grid-cols-2 gap-6 mb-4">
	- [JSON schema and parsing](https://www.windmill.dev/docs/core_concepts/json_schema_and_parsing) —— JSON Schemas are used for defining the input specification for scripts and flows, and specifying resource types.
</div>

Packages can be installed using composer. Just uncomment the `require` lines and add the packages you need. Windmill will install them for you:

```php
<?php

// require:
// monolog/monolog@3.6.0
// stripe/stripe-php

function main(
	// Postgresql $a,
  // array $b,
  // object $c,
	int $d = 123,
	string $e = "default value",
	float $f = 3.5,
  bool $g = true,
) {
	return $d;
}

```

## Instant preview & testing

Look at the UI preview on the right: it was updated to match the input
signature. Run a test (`Ctrl` + `Enter`) to verify everything works.

<video
	className="border-2 rounded-lg object-cover w-full h-full dark:border-gray-800"
	controls
	src="/videos/auto_g_ui_landing.mp4"
/>

<br />

You can change how the UI behaves by changing the main signature. For example, if you add a default for the `name` argument, the UI won't consider this field as required anymore.

```php
function main(string $e = "default value")
```

<div className="grid grid-cols-2 gap-6 mb-4">
	- [Instant preview & testing](https://www.windmill.dev/docs/core_concepts/instant_preview) —— On top of its integrated editors, Windmill allows users to see and test what they are building directly from the editor, even before deployment.
</div>

Now let's go to the last step: the "Generated UI" settings.

## Generated UI

From the Settings menu, the "Generated UI" tab lets you customize the script's arguments.

The UI is generated from the Script's main function signature, but you can add additional constraints here. For example, we could use the `Customize property`: add a regex by clicking on `Pattern` to make sure users are providing a name with only alphanumeric characters: `^[A-Za-z0-9]+$`. Let's still allow numbers in case you are some tech billionaire's kid.

![Advanced settings for php](./customize_php.png "Advanced settings for php")

<div className="grid grid-cols-2 gap-6 mb-4">
	- [Script kind](../../../script_editor/script_kinds.mdx) —— You can attach additional functionalities to Scripts by specializing them into specific Script kinds.
	- [Generated UI](../../../script_editor/customize_ui.mdx) —— main function's arguments can be given advanced settings that will affect the inputs' auto-generated UI and JSON Schema.
</div>

## Run!

We're done! Now let's look at what users of the script will do. Click on the [Deploy](../../../core_concepts/0_draft_and_deploy/index.mdx) button
to load the script. You'll see the user input form we defined earlier.

Note that Scripts are [versioned](../../../core_concepts/34_versioning/index.mdx#script-versioning) in Windmill, and
each script version is uniquely identified by a hash.

Fill in the input field, then hit "Run". You should see a run view, as well as
your logs. All script runs are also available in the [Runs](../../../core_concepts/5_monitor_past_and_future_runs/index.mdx) menu on
the left.

![Run in php](./run_php.png "Run in php")

You can also choose to [run the script from the CLI](../../../advanced/3_cli/index.mdx) with the pre-made Command-line interface call.

<div className="grid grid-cols-2 gap-6 mb-4">
	- [Triggers](../../../triggers/index.mdx) —— Trigger scripts and flows on-demand, by schedule or on external events.
</div>

## What's next?

This script is a minimal working example, but there's a few more steps that can be useful in a real-world use case:

- Pass [variables and secrets](../../../core_concepts/2_variables_and_secrets/index.mdx)
  to a script.
- Connect to [resources](../../../core_concepts/3_resources_and_types/index.mdx).
- Mount a [volume](../../../core_concepts/67_volumes/index.mdx) with a `// volume:` annotation below the `<?php` opener to persist files across runs ([Enterprise Edition](/pricing)).
- [Trigger that script](../../../triggers/index.mdx) in many ways.
- Compose scripts in [Flows](../../../flows/1_flow_editor.mdx), [low-code apps](../../../apps/0_app_editor/index.mdx) or [full-code apps](../../../full_code_apps/index.mdx).
- You can [share your scripts](../../../misc/1_share_on_hub/index.md) with the community on [Windmill Hub](https://hub.windmill.dev). Once
  submitted, they will be verified by moderators before becoming available to
  everyone right within Windmill.

Scripts are immutable and there is an hash for each deployment of a given script. Scripts are never overwritten and referring to a script by path is referring to the latest deployed hash at that path.

<div className="grid grid-cols-2 gap-6 mb-4">
	- [Versioning](https://www.windmill.dev/docs/core_concepts/versioning#script-versioning) —— Scripts, when deployed, can have a parent script identified by its hash.
</div>

For each script, a UI is autogenerated from the JSON schema inferred from the script signature, and can be customized further as standalone or embedded into rich UIs using the [App builder](../../7_apps_quickstart/index.mdx).

<div className="grid grid-cols-2 gap-6 mb-4">
	- [Auto-generated UIs](https://www.windmill.dev/docs/core_concepts/auto_generated_uis) —— Windmill creates auto-generated user interfaces for scripts and flows based on their parameters.
	- [Generated UI](../../../script_editor/customize_ui.mdx) —— main function's arguments can be given advanced settings that will affect the inputs' auto-generated UI and JSON Schema.
</div>

In addition to the UI, sync and async [webhooks](../../../core_concepts/4_webhooks/index.mdx) are generated for each deployment.

<div className="grid grid-cols-2 gap-6 mb-4">
	- [Webhooks](https://www.windmill.dev/docs/core_concepts/webhooks) —— Trigger scripts and flows from webhooks.
</div>
