---
title: 'Ansible quickstart'
description: 'Windmill で Ansible の playbook を動かすには。Ansible のスクリプトを作って実行する。'
slug: '/getting_started/scripts_quickstart/ansible'
---
> **[原文](./index.mdx)の日本語訳。** 相違があれば原文が正。
> 原典 © Windmill Labs, Inc. — [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。この訳も同じライセンスで提供します。

# Ansible クイックスタート

このクイックスタートでは、[Ansible](https://www.ansible.com/) で最初のスクリプト（playbook）を書きます。

<video
	className="border-2 rounded-lg object-cover w-full h-full dark:border-gray-800"
	autoPlay
	controls
	id="main-video"
	src="/videos/ansible_quickstart.mp4"
/>

<br />

ここでは Windmill の web IDE で簡単な Ansible のスクリプトを作ります。手元で書きたい場合は[手元での開発](../../../advanced/4_local_development/index.mdx)のページを参照してください。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [手元での開発](https://www.windmill.dev/docs/advanced/local_development) —— 端末、VS Code、JetBrains の IDE など、好きな場所で書く。
</div>

スクリプトは Windmill の基本の部品です。単体で[実行・スケジュール](../../../triggers/index.mdx)できますし、つなげて[フロー](../../../flows/1_flow_editor.mdx)にすることも、専用の画面を付けて[アプリ](../../7_apps_quickstart/index.mdx)にすることもできます。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [スクリプトのエディタ](../../../script_editor/index.mdx) —— スクリプトの詳細すべて。
	- [トリガー](../../../triggers/index.mdx) —— スクリプトとフローを、手動・スケジュール・外部の出来事で起こす。
</div>

スクリプトは 2 つの部分でできています。

- [コード](#コード-playbook): Ansible では yaml で書いた playbook のファイルです。
- [設定](#設定): パス、要約、説明、（署名から推測した）入力の [JSON Schema](../../../core_concepts/13_json_schema_and_parsing/index.mdx) など、スクリプトについての設定とメタデータです。

コードのリポジトリに保存するときは、この 2 つは `<path>.playbook.yml` と `<path>.script.yaml` に分けて置かれます。

![Ansible in Windmill](./create_ansible_script.png)

## 設定

![New script](../../../../static/images/script_languages.png "New script")

[設定](../../../script_editor/settings.mdx)のメニューには、スクリプトごとのメタデータがあり、細かく決められます。

- **要約（Summary）**（任意）はスクリプトの短い説明です。Windmill の各所で見出しとして表示されます。省くと、UI は既定で `path` を使います。
- **パス（Path）** はスクリプトを一意に指す名前で、[持ち主](../../../core_concepts/16_roles_and_permissions/index.mdx)とスクリプト名からなります。持ち主は利用者か、グループ（[フォルダ](../../../core_concepts/8_groups_and_folders/index.mdx#folders)）です。
- **説明（Description）** は、[自動生成される UI](../../../core_concepts/6_auto_generated_uis/index.mdx) を通して、使う人にスクリプトの動かし方を伝える場所です。markdown が使えます。
- スクリプトの**言語（Language）**。
- **スクリプトの種類（Script kind）**: アクション（既定）、[トリガー](../../../flows/10_flow_trigger.mdx)、[承認](../../../flows/11_flow_approval.mdx)、[エラーハンドラ](../../../flows/7_flow_error_handler.md)、[前処理](../../../core_concepts/43_preprocessors/index.mdx)。[フローのエディタ](../../6_flows_quickstart/index.mdx)で目的に合うスクリプトを絞り込むための札として働きます。

このメニューには [Runtime](../../../script_editor/settings.mdx#runtime)、[生成される UI](#生成される-ui)、[トリガー](../../../script_editor/settings.mdx#triggers)の設定もあります。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [設定](../../../script_editor/settings.mdx) —— スクリプトごとにメタデータと設定があり、細かく決められる。
</div>

では左側のコードエディタをクリックしてください。

## コード (Playbook)

Ansible の playbook を Windmill の環境とスクリプトの形に合わせるため、playbook の前にいくつか情報を書き足せるようになっています。そのため Windmill の Ansible の playbook は、たいていこういう形になります。

![Ansible in Windmill](./ansible_script_ide.png)

```yml
---
inventory:
  - resource_type: ansible_inventory
    # You can pin an inventory to this script:
    # resource: u/user/your_resource

# Additional inventories available as script arguments
additional_inventories:
  - "delegate_git_repository/hosts/inventory.ini"

# File resources will be written in the relative \`target\` location before
# running the playbook
files:
  - resource: u/user/fabulous_jinja_template
    target:  ./config_template.j2

# Define the arguments of the Windmill script
extra_vars:
  world_qualifier:
    type: string

dependencies:
  galaxy:
    collections:
      - name: community.general
      - name: community.vmware
  python:
    - jmespath
---
- name: Echo
  hosts: 127.0.0.1
  connection: local
  vars:
    my_result:
      a: 2
      b: true
      c: "Hello"

  tasks:
  - name: Print debug message
    debug:
      msg: "Hello, {{world_qualifier}} world!"
  - name: Write variable my_result to result.json
    delegate_to: localhost
    copy:
      content: "{{ my_result | to_json }}"
      dest: result.json
```

YAML の文書が 2 つ続いていて、2 つ目が Ansible の playbook です。1 つ目は Windmill だけが使うもので、playbook を実行するとき Ansible からは見えません。ここにスクリプトについてのメタデータをいくつかの節に分けて書きます。

以下、それぞれの節を順に見ていきます。

### 引数 (extra-args)

Windmill のスクリプトは[引数](../../../core_concepts/13_json_schema_and_parsing/index.mdx)を取れます。その名前と型をこの節で決めます。ここに書いた定義が読み取られ、画面側がスクリプトの入力欄をその場で組み立てます。


```yaml
extra_vars:
  world_qualifier:
    type: string
  nested_object:
    type: object
    properties:
      a:
        type: string
      b:
        type: number
  some_arr:
    type: array
    objects:
      type: string
```

![Parsing Yaml and generating UI](./extra_vars_ui.png)

型の書き方は [OpenAPI のデータ型](https://swagger.io/docs/specification/data-models/data-types/)を手本にしています。ただしすべての機能・型に対応しているわけではないので、何が使えるかは web IDE で試してみるのが早いです。

:::tip Argument defaults
`default:` を使えば引数に既定値を与えられます。例えば、
```yml
extra_vars:
  my_string:
    type: string
    default: 'Fascinating String of Words'
```
:::

Windmill の[リソース](../../../core_concepts/3_resources_and_types/index.mdx)を型として使うには、こう書きます。

```yaml
extra_vars:
  my_resource:
    type: windmill_resource
    resource_type: postgresql
```

![Postgres Resource UI](./postgres_ui.png)

裏では、Windmill はこれらの変数を `--extra-vars` フラグで Ansible に渡します。挙動もそのとおりです。

### 固定のリソースと変数

特定のスクリプトに固定したリソースと[変数](../../../core_concepts/2_variables_and_secrets/index.mdx)も、`extra-vars` の節で定義できます。playbook では同じく `--extra-vars` フラグで渡されるからです。

書き方はこうです。
```yml
extra_vars:
  my_variable:
    type: windmill_variable
    variable: u/user/my_variable
  my_resource:
    type: windmill_resource
    resource: u/user/my_resource
```

`resource` や `variable` の下に、リソースや変数へのパスを固定で書けます。そうすると UI が変わり、固定になったぶんの入力欄が消えるのが分かります。

:::tip About static and non-static variables
この書き方で定義した変数は固定のものに限られます。固定でない変数を使いたいときは、`type: string` の普通の引数を定義し、UI からその欄に変数か秘密を入れてください。
:::

### 返り値

Windmill のスクリプトはたいてい返り値を持ちます。これにより、フローの中でつなげたり、前の処理の結果を見て条件を分けたりできます。Ansible の playbook でも同じことができます。タスクのどれか（結果と誤りの筋を通すなら最後のものがよいでしょう）に、返したい JSON の値を `result.json` という名前のファイルへ書かせるのです。

```yaml
---
tasks:

  [...]

  - name: Write variable my_result to result.json
    delegate_to: localhost
    copy:
      content: "{{ my_result | to_json }}"
      dest: result.json

```

正しい json を書かないと job は失敗します。またこれは制御ノード、つまり worker が行う必要があるので、`delegate_to: localhost` を付けることが大切です。


### インベントリ

Ansible の playbook を使うときは、たいてい `ansible-playbook playbook.yml -i inventory.ini` のように実行します。Windmill で Ansible にインベントリを渡すには、次の節を書きます。

```yaml
inventory:
  - resource_type: ansible_inventory
```

同じようなリソース型を作るには、[平文ファイルのリソースを作る](../../../core_concepts/3_resources_and_types/index.mdx#plain-text-file-resources)を参照してください。そうでなければ、Hub からリソース型を取り込めば `ansible_inventory` が使えるはずです。

web IDE でこれを書き足すと、新しく `inventory.ini` という引数が現れます。そこで ansible_inventory のリソースを選ぶか、新しく作れます。

![inventory ui](./inventory_ui.png)

インベントリをスクリプトの入力にしたくない場合は、パスを書いて特定のリソースを固定できます。このときは resource_type を書く必要はありません。

```yaml
inventory:
  - resource: u/user/my_ansible_inventory
```

こうすると UI はインベントリを訊かず、実行のたびにこのリソースを使います。逆にインベントリをまったく指定したくなければ、この節ごと消してかまいません。

インベントリの名前は既定で `inventory.ini` になりますが、別の拡張子が要るとき（動的インベントリなど）は、こうして名前を決められます。

```yaml
inventory:
  - resource_type: c_dynamic_ansible_inventory
    name: hcloud.yml
```

複数のインベントリを渡したいときは、yaml の配列を続けるだけです。すべてが `ansible-playbook` のコマンドに渡されます。

```yaml
# Declaring three different inventories to be passed to the playbook
inventory:
  - resource: u/user/my_base_inventory
    name: base.ini
  - resource_type: ansible_inventory
  - resource_type: c_dynamic_ansible_inventory
    name: hcloud.yml
```

### 追加のインベントリ

取得元を指定せずに、スクリプトの引数として選べるインベントリを追加で宣言することもできます。こうすると、実行するときにインベントリを選べます。

```yaml
additional_inventories:
  - name: "Extra inventories"
    options:
      - "delegate_git_repository/hosts/inventory1.ini"
      - "delegate_git_repository/hosts/inventory2.ini"
      - "delegate_git_repository/hosts/inventory3.ini"
```

このスクリプトでは常に渡す、という固定の書き方もできます。

```yaml
additional_inventories:
  - "delegate_git_repository/hosts/permanent_inventory.ini"
```

これは宣言するだけである点に注意してください。実体のほうは、git リポジトリに置くか[ファイルのリソース](#インベントリ以外のファイルリソース)を使うかして、別に用意する必要があります。そうしないと ansible が「インベントリが見つからない」と言って失敗します。

### インベントリ以外のファイルリソース

Ansible の playbook が、playbook から見た相対パスにあるテキストファイルに依存していることがあります。設定ファイルであったり、テンプレートであったり、埋め込めない・別ファイルのままのほうが簡単な何かであったりします。そういうときは、Windmill の[平文ファイルのリソース](../../../core_concepts/3_resources_and_types/index.mdx#plain-text-file-resources)を使って、playbook を動かす前に指定した場所へファイルを作れます。書き方はこうです。

```yaml
files:
  - resource: u/user/fabulous_jinja_template
    target:  ./config_template.j2
```

上の例で、`u/user/faboulous_jinja_template` は平文ファイルの特別なリソースです。`./config_template.j2` は playbook から見た相対パスで、そこにファイルが作られ、playbook から読めるようになります。

これで、実行時にはこのファイルが在るものとして playbook を書けます。

#### ファイルの中身に変数を使う

変数や秘密で同じことをしたいときは、似た書き方ができます。

```yaml
files:
  - variable: u/user/my_ssh_key
    target:  ./id_rsa
```

変数の中身がファイルに書き込まれます。

SSH の鍵のように、データを秘密として保管したいときに便利です。

#### Ansible と SSH

playbook から SSH を成功させるには、次の点に気を付けるとよいでしょう。

1) SSH の鍵を***秘密*の変数に書き、**末尾に必ず改行を入れてください**。無いと誤りになることがあります。

```
-----BEGIN OPENSSH PRIVATE KEY-----
MHgCAQEEIQDWlK/Rk2h4WGKCxRs2SwplFVTSyqouwTQKIXrJ/L2clqAKBggqhkjO
PQMBB6FEA0IABErMvG2Fa1jjG7DjEQuwRGCEDnVQc1G0ibU/HI1BjkIyf4d+sh
91GhwKDvHGbPaEQFWeTBQ+KbYwjtomLfmZM[...]
-----END OPENSSH PRIVATE KEY-----

```

2) この SSH の鍵を入れるファイルをスクリプトに作らせます。`mode: '0600'` を忘れると、また別の誤りが出ます。

```yaml
files:
  - variable: u/user/my_ssh_key
    target:  ./ssh_key
    mode: '0600'
```

3) インベントリのファイルに、次を書き足します。
```ini
...
[your_host:vars]
ansible_host=your_host
ansible_user=john # The SSH user
ansible_ssh_private_key_file=ssh_key # The file we declared where the SSH key can be found.
ansible_ssh_common_args='-o StrictHostKeyChecking=no' # This skips host key verification, avoiding the error. Alternatively, you can add the host to known_hosts, either as an init script or a task in your playbook
...
```

### 依存の管理

Ansible の playbook は、Python のパッケージや Ansible Galaxy のコレクションに依存することがよくあります。Windmill では `dependencies` の節に書いておけば、playbook を動かす前に Windmill が用意します。

```yaml
dependencies:
  galaxy:
    collections:
      - name: community.general
      - name: community.vmware
    roles:
      - name: geerlingguy.apache
  python:
    - jmespath
```

書き方は `ansible-builder` や Execution Environments に似ていますが、すべては Python スクリプトの [Python の依存](../../../advanced/15_dependencies_in_python/index.mdx)と同じ仕組みで手元に入れられます。つまりコンテナが余分に作られることはありません。

:::info Ansible vs Ansible-core
いまのところ、Ansible に対応した Windmill のイメージが動かすのは `ansible-core` ではなく完全な `ansible` です。付属のコレクションはあらかじめ入っているものと考えてかまいません。
:::

### git リポジトリからの依存

galaxy 以外にも、ロールやコレクションが git リポジトリに在って、そこから取り込めることがあります。ただしリポジトリの根がそのままロールかコレクションになっている必要があります。詳しくは [Ansible のドキュメント](https://docs.ansible.com/ansible/latest/collections_guide/collections_installing.html#install-multiple-collections-with-a-requirements-file)を参照してください。

```yaml
collections:
  - name: git+https://github.com/organization/collection.git
    type: git
    version: main
```

もっと自由にやりたいときは、playbook を動かす前に指定した場所へ git リポジトリを clone させることもできます。こう書きます。

```yaml
git_repos:
  - url: git@github.com:some_user/your_git_repo.git
    target: ./git_repo1
    commit: a34ac4fa
    branch: prod
# An https or ssh url can be used:
  - url: https://github.com/some_user/your_other_git_repo.git
    target: ./git_repo2
```

:::info Specifying a commit for your repo
使う commit を書かなかった場合、配備のときに最新の commit hash がスクリプトの lockfile に記録され、以後の実行はすべてその commit を使います。同じ結果になることを保つためです。更新したくなったら、スクリプトを配備し直せば済みます。
:::

非公開のリポジトリを clone したいときは、こうして SSH の秘密鍵を足せます。
```yaml
git_ssh_identity:
  - u/user/ssh_id_priv
git_repos:
  - url: git@github.com:some_user/your_private_repo.git
    target: ./my_roles_and_collections
```

### Ansible Vault

ansible vault で暗号化したファイルがある場合、復号のためのパスワードを渡す必要があります。パスワードを Windmill の秘密として保管し、playbook のメタデータの節にその秘密へのパスを書けば済みます。

```yaml
vault_password: u/user/ansible_vault_password
```

Vault ID を使って複数のパスワードを使い分けている場合は、少し形が変わります。パスワードのファイルを定義したうえで、[ファイルのリソース](#インベントリ以外のファイルリソース)としても足します。

```yaml
vault_id:
  - label1@password_filename1
  - label2@password_filename2
  - label3@password_filename3
files:
  - variable: u/user/password_for_label1
    target: ./password_filename1
  - variable: u/user/password_for_label2
    target: ./password_filename2
  - variable: u/user/password_for_label3
    target: ./password_filename3
```

### playbook の実行の選択肢

スクリプトのメタデータの `options` の節から、`ansible-playbook` のフラグを渡せます。

```yaml
options:
  - vvv
  - forks: 10
  - timeout: 30
  - flush_cache
  - force_handlers
  - limit: webservers:!db1.example.com
```

書けるもの:

| 書き方 | `ansible-playbook` のフラグ |
| --- | --- |
| `vv` / `vvv` / `vvvv`（`v` を 1〜6 個） | `-v`（詳しさ） |
| `verbosity: vvv` | 上と同じ |
| `forks: <int>` | `--forks` |
| `timeout: <int>` | `--timeout` |
| `flush_cache` | `--flush-cache` |
| `force_handlers` | `--force-handlers` |
| `limit: <pattern>` | `--limit`（対象のホストを絞る） |

`limit` の値には `{{ argname }}` でスクリプトの引数を参照できます。フローが実行時に対象のホストを選べるようになります。

```yaml
options:
  - limit: "{{ target_host }}"
extra_vars:
  target_host:
    type: string
```

### 環境の用意を git リポジトリに任せる（EE）

:::info EE feature
この機能の一部は、インスタンス全体の blob 保管に依存しています。[Enterprise Edition](/pricing) でのみ使えます。
:::


<video
	className="border-2 rounded-lg object-cover w-full h-full dark:border-gray-800"
	controls
	src="/videos/ansible_delegate_to_git_repo.mp4"
/>

インベントリ・独自のロール・playbook をすべて収めた git リポジトリを指定し、ansible のスクリプトをそちらで動かすこともできます。これを宣言すると、リポジトリの中を見て回れる画面と、インベントリを決めるための補助が加わります。
やり方は 2 つあり、1 つはスクリプトのメタデータの側にこの節を書くことです。

```yaml
delegate_to_git_repo:
  resource: u/user/git_repo_resource
```

もう 1 つは、使う git リポジトリのリソースを選ばせてくれるボタンを使うことです。

まず、使いたいリポジトリを指す git_repository のリソースを作る必要があります。

すると編集画面が 2 つに分かれ、別の実行のしかたを検出したことを知らせる小窓が浮かびます。初めてのときは、リポジトリを読み込むボタンがリポジトリの表示欄に出ます。押すとリポジトリが clone され、中身が blob 保管に取っておかれて、Windmill の中からファイルを見て回れるようになります。

右上の浮かんだ小窓をクリックすると、git リポジトリの定義を管理する画面が開きます。ここには便利な道具もあります。例えばインベントリの節で、インベントリを収めた下位フォルダを指定し、ファイル名をまとめてスクリプトに取り込めます。

実行させたい playbook のパスを決めたいときは、こう書きます。

```yaml
delegate_to_git_repo:
  resource: u/user/git_repo_resource
  playbook: playbooks/your_playbook.yml
```

書かなければ、worker は普段どおり 2 つ目の YAML の節を使います。

#### clone したリポジトリの中のインベントリ

clone したリポジトリの中にあるインベントリのファイル（かディレクトリ）を、ansible に指させます。

```yaml
delegate_to_git_repo:
  resource: u/user/git_repo_resource
  playbook: playbooks/site.yml
  inventories_location: inventories/dev.ini
```

パスはリポジトリの根からの相対です。スクリプトのメタデータで宣言したインベントリと並んで、`ansible-playbook` の呼び出しに `-i` として加えられます。

#### clone したリポジトリの requirements.yml を入れる

リポジトリが自前の `requirements.yml` を持っているなら、`install_requirements: true` を書けば、clone のあと playbook を動かす前に、そこに並んだロールとコレクションを Windmill が入れてくれます。

```yaml
delegate_to_git_repo:
  resource: u/user/git_repo_resource
  playbook: playbooks/site.yml
  install_requirements: true
```

worker は clone したリポジトリの根で `requirements.yml`、`requirements.yaml`、`collections/requirements.yml`、`roles/requirements.yml` を探し、見つかったものすべてに `ansible-galaxy role install -r` と `ansible-galaxy collection install -r` を走らせます。1 つも無ければ、この段は飛ばされます。

これはスクリプトのメタデータの `dependencies.galaxy` とは別ものです。合うほうを使っても、両方使ってもかまいません。

#### リポジトリの ansible.cfg を使う

Ansible が読む設定ファイルは 1 つだけです。`ANSIBLE_CONFIG`、作業ディレクトリ、`~/.ansible.cfg`、`/etc/ansible/ansible.cfg` の順に最初に見つかったものを読み、混ぜ合わせることはしません。Windmill は job のディレクトリから `ansible-playbook` を動かし、そこに自前の `ansible.cfg` を書き出すので、リポジトリに入れてある設定ファイルは普通は無視されます。`ansible_cfg` にリポジトリからの相対パスを書けば、そちらを実際の設定にできます。

```yaml
delegate_to_git_repo:
  resource: u/user/git_repo_resource
  playbook: playbooks/site.yml
  ansible_cfg: ansible.cfg
```

これを書くと、Windmill は `ANSIBLE_CONFIG` をそのファイルに向けるので、リポジトリ側の設定（ロールのパス、インベントリのプラグイン、callback、`host_key_checking`、ssh の引数など）が Windmill の外と同じように効きます。実行時の状態に依るものだけが、環境変数を通して上から重ねられます。

- 一時ディレクトリとホームディレクトリ（`ANSIBLE_HOME`、`ANSIBLE_LOCAL_TEMP`、`ANSIBLE_REMOTE_TEMP`）は、使い捨ての job のディレクトリを指します。
- スクリプトのメタデータで宣言した vault の設定（[`vault_password`、`vault_id`](#ansible-vault)）は、リポジトリの設定より優先されたままです。
- Windmill が galaxy のロールとコレクションを入れる先のディレクトリが、設定に書かれた `roles_path` と `collections_path` の先頭に足されます。Windmill が入れたもの（`dependencies.galaxy` か `install_requirements` によるもの）と、リポジトリに同梱されたものの両方が解決できるようにするためです。

clone したリポジトリにそのファイルが無ければ job は失敗します。`ansible_cfg` を書かなければ、これまでどおり Windmill が作る設定が優先されます。git リポジトリへの委譲全般と同じく、これには worker が `DISABLE_NSJAIL=true` で動いている必要があります。

#### 値を実行時に決める

`playbook`、`commit`、`inventories_location`、`ansible_cfg` の 4 つは `{{ argname }}` の形を受け付け、リポジトリを clone して playbook を動かす前に、スクリプトの引数から埋められます。これによりフローが、playbook・ブランチ・インベントリを実行時に選べます。

```yaml
delegate_to_git_repo:
  resource: u/user/git_repo_resource
  playbook: "playbooks/{{ playbook_name }}.yml"
  inventories_location: "inventories/{{ env }}.ini"
  commit: "{{ git_sha }}"
extra_vars:
  playbook_name:
    type: string
  env:
    type: string
  git_sha:
    type: string
```

埋められるのは文字列・数・真偽の引数だけです。パスの欄は、clone したリポジトリの外へ出られないよう、絶対パスと `..` を拒みます。

## その場での確認とテスト

右側の UI の下見を見てください。入力の署名に合わせて更新されています。テストを実行して（`Ctrl` + `Enter`）、思ったとおりに動くか確かめましょう。

<video
	className="border-2 rounded-lg object-cover w-full h-full dark:border-gray-800"
	controls
	src="/videos/auto_g_ui_landing.mp4"
/>

<br />


<div className="grid grid-cols-2 gap-6 mb-4">
	- [その場での確認とテスト](https://www.windmill.dev/docs/core_concepts/instant_preview) —— 組み込みのエディタに加えて、Windmill では作っているものを配備の前からエディタで見て試せる。
</div>

では最後の段、「生成される UI（Generated UI）」の設定へ進みましょう。

## 生成される UI

設定のメニューにある「生成される UI（Generated UI）」のタブで、スクリプトの引数を細かく決められます。

UI はスクリプトの main 関数の署名から作られますが、ここで制約を足せます。例えば `プロパティを調整（Customize property）` から `Pattern` をクリックして正規表現を足し、名前に英数字しか使えないようにできます: `^[A-Za-z0-9]+$`。技術系の大富豪の子どものために、数字は許しておきましょう。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [スクリプトの種類](../../../script_editor/script_kinds.mdx) —— スクリプトを特定の種類に特化させて、機能を足せる。
	- [生成される UI](../../../script_editor/customize_ui.mdx) —— main 関数の引数には、自動生成される UI と JSON Schema に効く詳しい設定を与えられる。
</div>

## コードとしてのワークフロー

別々の job を実行する分散したプログラムを書く方法の 1 つは、スクリプトをつなげる[フロー](../../../flows/1_flow_editor.mdx)を使うことです。

もう 1 つは、job とその依存関係を定義するプログラムを書き、それをスクリプトの中で直に実行することです。これを[コードとしてのワークフロー](../../../core_concepts/31_workflows_as_code/index.mdx)と呼びます。

![Flow as code in Python](../../../core_concepts/31_workflows_as_code/wac-editor-1.png "Flow as code in Python")

詳しくは、

<div className="grid grid-cols-2 gap-6 mb-4">
	- [コードとしてのワークフロー](https://www.windmill.dev/docs/core_concepts/workflows_as_code) —— タスクとその流れをコードだけで自動化する。
</div>

## 実行する

これで完成です。ここからは、このスクリプトを使う人の側を見てみましょう。[配備（Deploy）](../../../core_concepts/0_draft_and_deploy/index.mdx)ボタンを押してスクリプトを読み込みます。先ほど決めた入力フォームが出るはずです。

Windmill のスクリプトには[版](../../../core_concepts/34_versioning/index.mdx#script-versioning)があり、版ごとに hash で一意に定まります。

入力欄を埋めて「実行（Run）」を押してください。実行の画面と log が見られます。すべての実行は左側の [Runs](../../../core_concepts/5_monitor_past_and_future_runs/index.mdx) のメニューからも見られます。

用意されたコマンドを使って、[CLI からスクリプトを実行](../../../advanced/3_cli/index.mdx)することもできます。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [スクリプトを起こす](../../../triggers/index.mdx) —— スクリプトとフローを、手動・スケジュール・外部の出来事で起こす。
</div>

## キャッシュ

Python の依存は既定ですべてディスクに取っておかれます。さらに[分散キャッシュ](../../../core_concepts/38_object_storage_in_windmill/index.mdx#instance-object-storage-distributed-cache-for-python-rust-go)を使えば、他のすべての worker からも使えるようになり、どの worker も素早く立ち上がります。

## 次は

このスクリプトは動く最小の例ですが、実際に使うにはもう少し段が要ります。

- スクリプトに[変数と秘密](../../../core_concepts/2_variables_and_secrets/index.mdx)を渡す。
- [リソース](../../../core_concepts/3_resources_and_types/index.mdx)につなぐ。
- いろいろなやり方で[そのスクリプトを起こす](../../../triggers/index.mdx)。
- [フロー](../../../flows/1_flow_editor.mdx)、[ローコードのアプリ](../../../apps/0_app_editor/index.mdx)、[フルコードのアプリ](../../../full_code_apps/index.mdx)にスクリプトを組み合わせる。
- [Windmill Hub](https://hub.windmill.dev) で、みんなに[スクリプトを公開](../../../misc/1_share_on_hub/index.md)できます。出すと、まず取りまとめ役が確かめ、そのあと Windmill の中から誰でも使えるようになります。

スクリプトは書き換えられないもので、配備のたびに hash が付きます。上書きされることはなく、パスで指すというのは、そのパスに最後に配備された hash を指すという意味です。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [版の管理](https://www.windmill.dev/docs/core_concepts/versioning#script-versioning) —— 配備されたスクリプトは、hash で指される親のスクリプトを持てる。
</div>

スクリプトごとに、署名から推測した JSON schema をもとに UI が自動生成されます。単体で細かく調整することも、[アプリの作成画面](../../7_apps_quickstart/index.mdx)で作り込んだ UI に埋め込むこともできます。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [自動生成される UI](https://www.windmill.dev/docs/core_concepts/auto_generated_uis) —— Windmill はスクリプトとフローの引数から UI を自動で作る。
	- [生成される UI](../../../script_editor/customize_ui.mdx) —— main 関数の引数には、自動生成される UI と JSON Schema に効く詳しい設定を与えられる。
</div>

UI に加えて、配備ごとに同期・非同期の [webhook](../../../core_concepts/4_webhooks/index.mdx) が作られます。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [webhook](https://www.windmill.dev/docs/core_concepts/webhooks) —— webhook からスクリプトとフローを起こす。
</div>
