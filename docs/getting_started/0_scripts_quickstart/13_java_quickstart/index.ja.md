---
title: 'Java クイックスタート'
description: 'Windmill で Java のスクリプトを書くには。Maven による依存関係の管理とあわせて、作り、テストし、配備する。'
slug: '/getting_started/scripts_quickstart/java'
---

> **[原文](./index.mdx)の日本語訳。** 相違があれば原文が正。
> 原典 © Windmill Labs, Inc. — [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。この訳も同じライセンスで提供します。

# Java クイックスタート

この手引きでは、最初のスクリプトを [Java](https://www.java.com/) で書きます。

![Editor for Java](./java_exec.png "Script in Java")

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

- [コード](#コード): Java のスクリプトでは、`Main` クラスの中に少なくとも 1 つ、**public** な static の main メソッドが要ります。
- [設定](#設定): パス・要約・説明・入力の [JSON Schema](../../../core_concepts/13_json_schema_and_parsing/index.mdx)（署名から推論されます）といった、スクリプトの設定とメタデータ。


ホーム画面で **新規（New）** をクリックし、**スクリプト（Script）** を選びます。スクリプト作成の最初の段階、[メタデータ](../../../script_editor/settings.mdx#metadata)に進みます。

## 設定

![New script](./java_settings.png "New script")

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

![Editor for Java](./java_exec.png "Editor for Java")

<div className="grid grid-cols-2 gap-6 mb-4">
	- [コードエディタ](../../../code_editor/index.mdx) —— コードエディタは Windmill に統合された開発環境。
	- [自動生成される UI](https://www.windmill.dev/docs/core_concepts/auto_generated_uis) —— Windmill はスクリプトとフローの引数から、UI を自動で作る。
</div>

この例では `Java` を選んだので、Windmill が雛形を用意してくれています。見てみましょう。

```java
//requirements:
//com.google.code.gson:gson:2.8.9
//com.github.ricksbrown:cowsay:1.1.0

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.github.ricksbrown.cowsay.Cowsay;
import com.github.ricksbrown.cowsay.plugin.CowExecutor;

public class Main {
  public static class Person {
    private String name;
    private int age;

    // Constructor
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
  }

  public static Object main(
    // Primitive
    int a,
    float b,
    // Objects
    Integer age,
    Float d,
    Object e,
    String name,
    // Lists
    String[] f
    // No trailing commas!
    ){
    Gson gson = new Gson();

    // Get resources
    var theme = Wmill.getResource("f/app_themes/theme_0");
    System.out.println("Theme: " + theme);
    
    // Create a Person object
    Person person = new Person( (name == "") ? "Alice" : name, (age == null) ? 30 : age);

    // Serialize the Person object to JSON
    String json = gson.toJson(person);
    System.out.println("Serialized JSON: " + json);

    // Use cowsay
    String[] args = new String[]{"-f", "dragon", json };
    String result = Cowsay.say(args);
    return result;
  }
}

```

Java では、public な `Main` クラスと、public static の `main` 関数が要ります。
戻り値の型は `Object` か `void` のどちらかです。Java のプリミティブ型は、どれも自動で `Object` に変換されます。

 `Main` について押さえておくべき点がいくつかあります。

- 引数は次の 2 つを作るのに使われます。
  1.  スクリプトの[入力仕様](../../../core_concepts/13_json_schema_and_parsing/index.mdx)
  2.  スクリプトを単体のアプリとして実行したときに見える[画面](../../../core_concepts/6_auto_generated_uis/index.mdx)
- 型注釈は UI の入力欄を作るのに使われ、入力の事前検査にも役立ちます。必須ではありませんが、強く勧めます。UI は後の段階で調整できます（ただし入力の型は変えられません）。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [JSON schema と解釈](https://www.windmill.dev/docs/core_concepts/json_schema_and_parsing) —— JSON Schema は、スクリプトとフローの入力仕様を定め、リソースの型を指定するために使われる。
</div>

パッケージは [Coursier](https://get-coursier.io/) で導入できます。必要な依存関係を `groupId:artifactId:version` の形で、ファイルの先頭に 1 行ずつ並べるだけです。

```java
//requirements:
//com.google.code.gson:gson:2.8.9
//com.github.ricksbrown:cowsay:1.1.0
```
[Maven](https://maven.apache.org/what-is-maven.html) と [Ivy](https://ant.apache.org/ivy/) のリポジトリに対応しています。

### 非公開の Maven レジストリ

[Enterprise 版](/pricing)では、非公開の Maven リポジトリを設定できます。[インスタンスの設定（Instance settings）](../../../advanced/18_instance_settings/index.mdx#registries) → Registries → Maven `settings.xml` と進んでください。

Maven の `settings.xml` の中身をそのまま貼り付けます。Windmill はこのファイルを Java home の `.m2/settings.xml` に書き出すので、依存関係を解決するとき、Coursier が設定どおりのサーバー・ミラー・リポジトリの URL を使えるようになります。設定を空にすると、`settings.xml` は削除されます。

`settings.xml` の中身の例を挙げます。

```xml
<settings>
  <servers>
    <server>
      <id>my-private-repo</id>
      <username>deploy-user</username>
      <password>my-secret-token</password>
    </server>
  </servers>
  <profiles>
    <profile>
      <id>private</id>
      <repositories>
        <repository>
          <id>my-private-repo</id>
          <url>https://maven.example.com/releases</url>
        </repository>
      </repositories>
    </profile>
  </profiles>
  <activeProfiles>
    <activeProfile>private</activeProfile>
  </activeProfiles>
</settings>
```

## その場での確認とテスト


右側の UI の下見を見てください。入力の署名に合わせて更新されています。テストを実行して（`Ctrl` + `Enter`）、動くことを確かめましょう。

<video
	className="border-2 rounded-lg object-cover w-full h-full dark:border-gray-800"
	controls
	src="/videos/auto_g_ui_landing.mp4"
/>

## 生成される UI

設定メニューの「生成される UI（Generated UI）」タブでは、スクリプトの引数を調整できます。

UI はスクリプトの `main` 関数の署名から作られますが、ここで制約を足せます。たとえば `プロパティを調整（Customize property）` から `パターン（Pattern）` をクリックして正規表現を書き、英数字だけの名前を求められます: `^[A-Za-z0-9]+$`。数字も許しておきましょう —— どこかの技術系の富豪の子かもしれませんから。

![Advanced settings for Java](./ui_java.png "Advanced settings for Java")

<div className="grid grid-cols-2 gap-6 mb-4">
	- [スクリプトの種類](../../../script_editor/script_kinds.mdx) —— スクリプトを特定の種類に絞ることで、追加の働きを持たせられる。
	- [生成される UI](../../../script_editor/customize_ui.mdx) —— main 関数の引数には詳細な設定を与えられ、入力の自動生成 UI と JSON Schema に反映される。
</div>

## 実行する

これで完成です。次は、このスクリプトを使う人の側を見てみましょう。[配備（Deploy）](../../../core_concepts/0_draft_and_deploy/index.mdx)ボタンを押して読み込みます。さきほど定義した入力欄が出ます。

Windmill のスクリプトは[版管理されて](../../../core_concepts/34_versioning/index.mdx#script-versioning)おり、各版はハッシュで一意に識別されます。

入力欄を埋めて「実行（Run）」を押します。実行の様子とログが出ます。すべての実行は左側の[実行履歴](../../../core_concepts/5_monitor_past_and_future_runs/index.mdx)メニューからも見られます。

![Run in Java](./run_java.png "Run in Java")

用意されたコマンドを使って、[CLI からスクリプトを実行する](../../../advanced/3_cli/index.mdx)こともできます。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [トリガー](../../../triggers/index.mdx) —— スクリプトとフローを、必要なとき・スケジュール・外部の出来事で起こす。
</div>

## キャッシュ

Java では、バイナリも依存関係も既定でディスクにキャッシュされます。さらに[分散キャッシュの保管](../../../core_concepts/38_object_storage_in_windmill/index.mdx#instance-object-storage-distributed-cache-for-python-rust-go)を使えば、他のすべての worker からも使えるようになり、どの worker でも起動が速くなります。

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
