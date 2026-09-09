---
title: 'Python クイックスタート'
description: 'Windmill で Python のスクリプトを書くには。pip による依存関係の管理とあわせて、作り、テストし、配備する。'
slug: '/getting_started/scripts_quickstart/python'
---

> **[原文](./index.mdx)の日本語訳。** 相違があれば原文が正。
> 原典 © Windmill Labs, Inc. — [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。この訳も同じライセンスで提供します。

# Python クイックスタート

この手引きでは、最初のスクリプトを Python で書きます。

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

ここでは Windmill の web IDE で簡単なスクリプトを作ります。[手元で開発する](../../../advanced/4_local_development/index.mdx)方法や、[Python で依存関係を扱う](../../../advanced/15_dependencies_in_python/index.mdx)他の方式は、それぞれの節を参照してください。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [手元での開発](https://www.windmill.dev/docs/advanced/local_development) —— 端末・VS Code・JetBrains の IDE など、さまざまな環境から開発する。
	- [Python の依存関係](https://www.windmill.dev/docs/advanced/dependencies_in_python) —— Python のスクリプトで依存関係をどう扱うか。
</div>

スクリプトは Windmill の基本の部品です。単体で[実行・スケジュール](../../../triggers/index.mdx)できますし、つなげて[フロー](../../../flows/1_flow_editor.mdx)にすることも、専用の UI を付けて[アプリ](../../7_apps_quickstart/index.mdx)として見せることもできます。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [スクリプトエディタ](../../../script_editor/index.mdx) —— スクリプトのすべて。
	- [トリガー](../../../triggers/index.mdx) —— スクリプトとフローを、必要なとき・スケジュール・外部の出来事で起こす。
</div>

スクリプトは 2 つの部分でできています。

- [コード](#コード): Python のスクリプトでは、少なくとも `main` 関数が要ります。
- [設定](#設定): パス・要約・説明・入力の [JSON Schema](../../../core_concepts/13_json_schema_and_parsing/index.mdx)（署名から推論されます）といった、スクリプトの設定とメタデータ。

コードリポジトリに保存すると、この 2 つは `<path>.py` と `<path>.script.yaml` に分かれて置かれます。

[依存関係](../../../advanced/15_dependencies_in_python/index.mdx)は Windmill が自動で扱います。Python のスクリプトでライブラリを import すると、保存時に Windmill が最上位の import を読み取り、依存関係の一覧を自動で作ります。自動導入で見るのは**最上位の import だけ**です。そのうえで依存解決の job を起こし、PyPI のパッケージを lockfile に結び付けます。これにより、同じ版のスクリプトは常に同じ版の依存関係で実行されます。

Windmill で Python で組んだスクリプトの簡単な例が[こちら](https://hub.windmill.dev/scripts/%22%22/1530/do-sentiment-analysis-with-nltk-%22%22)にあります。

```py
#import wmill
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
nltk.download("vader_lexicon")

def main(text: str = "Wow, NLTK is really powerful!"):
    return SentimentIntensityAnalyzer().polarity_scores(text)
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

では左側のコードエディタに移り、Hello World を作りましょう。

## コード

Windmill にはスクリプトを書くためのオンラインエディタがあります。左側がエディタ本体です。右側は、スクリプトの署名から Windmill が[生成する UI の下見](../../../core_concepts/6_auto_generated_uis/index.mdx)で、これがスクリプトを使う人に見えるものです。その UI を確かめ、値を入れて、[その場でテスト](#その場での確認とテスト)できます。

![Editor for python](./editor_python.png.webp)

<div className="grid grid-cols-2 gap-6 mb-4">
	- [コードエディタ](../../../code_editor/index.mdx) —— コードエディタは Windmill に統合された開発環境。
	- [自動生成される UI](https://www.windmill.dev/docs/core_concepts/auto_generated_uis) —— Windmill はスクリプトとフローの引数から、UI を自動で作る。
</div>

この例では `python` を選んだので、Windmill が雛形を用意してくれています。見てみましょう。

```python
import os
import wmill

# You can import any PyPI package. 
# See here for more info: https://www.windmill.dev/docs/advanced/dependencies_in_python

# you can use typed resources by doing a type alias to dict
#postgresql = dict

def main(
    no_default: str,
    #db: postgresql,
    name="Nicolas Bourbaki",
    age=42,
    obj: dict = {"even": "dicts"},
    l: list = ["or", "lists!"],
    file_: bytes = bytes(0),
):

    print(f"Hello World and a warm welcome especially to {name}")
    print("and its acolytes..", age, obj, l, len(file_))

    # retrieve variables, resources, states using the wmill client
    try:
        secret = wmill.get_variable("f/examples/secret")
    except:
        secret = "No secret yet at f/examples/secret !"
    print(f"The variable at `f/examples/secret`: {secret}")

    # Get last state of this script execution by the same trigger/user
    last_state = wmill.get_state()
    new_state = {"foo": 42} if last_state is None else last_state
    new_state["foo"] += 1
    wmill.set_state(new_state)

    # fetch context variables
    user = os.environ.get("WM_USERNAME")

    # return value is converted to JSON
    return {"split": name.split(), "user": user, "state": new_state}
```

Windmill のスクリプトには、入口となる `main` 関数が要ります。`main` について押さえておくべき点がいくつかあります。

- `main` の引数は次の 2 つを作るのに使われます。
  1.  スクリプトの[入力仕様](../../../core_concepts/13_json_schema_and_parsing/index.mdx)
  2.  スクリプトを単体のアプリとして実行したときに見える[画面](../../../core_concepts/6_auto_generated_uis/index.mdx)
- 型注釈は UI の入力欄を作るのに使われ、入力の事前検査にも役立ちます。必須ではありませんが、強く勧めます。UI は後の段階で調整できます（ただし入力の型は変えられません）。
- Windmill は引数の型として [Pydantic の `BaseModel`](https://docs.pydantic.dev/) と [`@dataclass`](https://docs.python.org/3/library/dataclasses.html) のクラスに対応しています。引数に Pydantic のモデルか dataclass を指定すると、Windmill はクラスの field から JSON schema を推論し、構造のある入力欄を作ります。入れ子のモデル、`Optional`、`List`、`Dict` も扱えます。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [JSON schema と解釈](https://www.windmill.dev/docs/core_concepts/json_schema_and_parsing) —— JSON Schema は、スクリプトとフローの入力仕様を定め、リソースの型を指定するために使われる。
</div>

### Pydantic と dataclass への対応

`main` 関数の引数の型として、Pydantic の `BaseModel` や Python の `@dataclass` を使えます。Windmill はクラスの定義を読み取り、適切な型の入力欄を作ります。

```python
from pydantic import BaseModel
from typing import Optional, List

class Address(BaseModel):
    street: str
    city: str
    zip_code: Optional[str] = None

class User(BaseModel):
    name: str
    age: int
    addresses: List[Address] = []

def main(user: User):
    return f"Hello {user.name}, age {user.age}"
```

dataclass も同じように使えます。

```python
from dataclasses import dataclass

@dataclass
class Config:
    host: str
    port: int = 8080
    debug: bool = False

def main(config: Config):
    return f"Connecting to {config.host}:{config.port}"
```

最後の import は [Windmill のクライアント](../../../advanced/2_clients/python_client.md)で、たとえば[変数](../../../core_concepts/2_variables_and_secrets/index.mdx)や[リソース](../../../core_concepts/3_resources_and_types/index.mdx)を使うときに要ります。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [Python の依存関係](https://www.windmill.dev/docs/advanced/dependencies_in_python) —— Python のスクリプトで依存関係をどう扱うか。
	- [Python クライアント](https://www.windmill.dev/docs/advanced/clients/python_client) —— Windmill の Python クライアントは、スクリプトの job の中から Windmill の API を手軽に扱えるようにする。
</div>

Hello World に戻ります。使っていない import を消し、`main` が利用者の名前を受け取るようにします。`name` を返しておきましょう —— このスクリプトを[フロー](../../../flows/1_flow_editor.mdx)や[アプリ](../../../full_code_apps/index.mdx)の中で使い、結果を次へ渡したくなるかもしれません。

```py
def main(name: str):
  print("Hello world. Oh, it's you {}? Greetings!".format(name))
  return name
```

## その場での確認とテスト

右側の UI の下見を見てください。入力の署名に合わせて更新されています。テストを実行して（`Ctrl` + `Enter`）、動くことを確かめましょう。

<video
	className="border-2 rounded-lg object-cover w-full h-full dark:border-gray-800"
	controls
	src="/videos/auto_g_ui_landing.mp4"
/>

<br />

`main` の署名を変えれば、UI の振る舞いも変わります。たとえば `name` に既定値を付けると、UI はその欄を必須として扱わなくなります。

```py
def main(name: str = "you"):
```

<div className="grid grid-cols-2 gap-6 mb-4">
	- [その場での確認とテスト](https://www.windmill.dev/docs/core_concepts/instant_preview) —— Windmill は統合されたエディタに加えて、配備の前でも、作っているものをその場で見て試せるようにしている。
</div>

では最後の段階、「生成される UI」の設定に進みます。

## 生成される UI

設定メニューの「生成される UI（Generated UI）」タブでは、スクリプトの引数を調整できます。

UI はスクリプトの `main` 関数の署名から作られますが、ここで制約を足せます。たとえば `プロパティを調整（Customize property）` から `パターン（Pattern）` をクリックして正規表現を書き、英数字だけの名前を求められます: `^[A-Za-z0-9]+$`。数字も許しておきましょう —— どこかの技術系の富豪の子かもしれませんから。

![Advanced settings for Python](./customize_python.png.webp)

<div className="grid grid-cols-2 gap-6 mb-4">
	- [スクリプトの種類](../../../script_editor/script_kinds.mdx) —— スクリプトを特定の種類に絞ることで、追加の働きを持たせられる。
	- [生成される UI](../../../script_editor/customize_ui.mdx) —— main 関数の引数には詳細な設定を与えられ、入力の自動生成 UI と JSON Schema に反映される。
</div>

## コードとしてのワークフロー

別々の仕事を実行する分散プログラムを書く方法の 1 つは、スクリプトをつなぐ[フロー](../../../flows/1_flow_editor.mdx)を使うことです。

もう 1 つは、仕事とその依存関係を定義するプログラムを書き、それをスクリプトの中で直接実行することです。これを[コードとしてのワークフロー](../../../core_concepts/31_workflows_as_code/index.mdx)と呼びます。全体を統べる関数に `@workflow` を、個々の仕事の関数に `@task` を付けます。各 task は独自のログと時系列の記録を持つ別の job として走り、その間ワークフローは中断します（worker の枠を解放します）。

![Flow as code in Python](../../../core_concepts/31_workflows_as_code/wac-editor-1.png "Flow as code in Python")

詳しくは次を参照してください。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [コードとしてのワークフロー](https://www.windmill.dev/docs/core_concepts/workflows_as_code) —— TypeScript か Python で、チェックポイントに基づく制御・並列実行・障害への耐性を備えた分散ワークフローを書く。
</div>

## 実行する

これで完成です。次は、このスクリプトを使う人の側を見てみましょう。[配備（Deploy）](../../../core_concepts/0_draft_and_deploy/index.mdx)ボタンを押して読み込みます。さきほど定義した入力欄が出ます。

Windmill のスクリプトは[版管理されて](../../../core_concepts/34_versioning/index.mdx#script-versioning)おり、各版はハッシュで一意に識別されます。

入力欄を埋めて「実行（Run）」を押します。実行の様子とログが出ます。すべての実行は左側の[実行履歴](../../../core_concepts/5_monitor_past_and_future_runs/index.mdx)メニューからも見られます。

![Run hello world in Python](./run_python.png.webp)

用意されたコマンドを使って、[CLI からスクリプトを実行する](../../../advanced/3_cli/index.mdx)こともできます。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [トリガー](../../../triggers/index.mdx) —— スクリプトとフローを、必要なとき・スケジュール・外部の出来事で起こす。
</div>

## Python の版を選ぶ

スクリプトごとに使う Python の版を、次の注釈で指定できます: py310、py311、py312、py313。

```python
# py312

type Foo = str

def main():
	foo: Foo = "Foo"
	return foo
```

### 版の指定子

短い書き方に加えて、より細かい指定子で正確な版の条件を書けます。

```python
# py: >=3.12

def main():
    return "Hello from Python 3.12+"
```

```python
# py: ==3.12.*

def main():
    return "Hello from any Python 3.12 version"
```

```python
# py: >=3.11,<3.14

def main():
    return "Hello from Python 3.11 to 3.13"
```

これらの指定子は [PEP 440](https://peps.python.org/pep-0440/) の記法で、単純な注釈より細かく版を制御できます。特定の Python の機能に頼るときや、ある版の既知の不具合を避けたいときに役立ちます。

<video
	className="border-2 rounded-lg object-cover w-full h-full dark:border-gray-800"
	controls
	src="/videos/annotate_py_version.mp4"
/>
<br/>

これとは別に、[環境変数](../../../core_concepts/47_environment_variables/index.mdx) `INSTANCE_PYTHON_VERSION` を上記のいずれかに設定して全体の版を決めることも、空にして「最新の安定版」を使うこともできます。空のままなら「最新の安定版」を引き継ぎ、それが何かは Windmill 側で決まります。

<video
	className="border-2 rounded-lg object-cover w-full h-full dark:border-gray-800"
	controls
	src="/videos/set_instance_py_version.mp4"
/>
<br/>

新しく配備するスクリプトでは、注釈またはインスタンスの版が lockfile に記録され、以後の実行はすべてその版に従います。

既に配備されていて lockfile に版が書かれていないスクリプトでは、インスタンスの版を変えても、既定で Python 3.11 が使われます。

テスト実行や配備のとき、他のスクリプトを import していれば、Windmill はそのすべてを探して注釈された版を見つけ、それを最終的な版とします。見つからなければインスタンスの版が使われます。

[Enterprise 版](/pricing)（EE）のお客様の場合、[S3 のキャッシュ](../../../core_concepts/38_object_storage_in_windmill/index.mdx#instance-object-storage-distributed-cache-for-python-rust-go)の tarball は Python の版ごとに分けて整理されます。

## キャッシュ

Python の依存関係は既定でディスクにキャッシュされます。さらに[分散キャッシュの保管](../../../core_concepts/38_object_storage_in_windmill/index.mdx#instance-object-storage-distributed-cache-for-python-rust-go)を使えば、他のすべての worker からも使えるようになり、どの worker でも起動が速くなります。

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
