---
title: 'Quickstart PostgreSQL, MySQL, MS SQL, BigQuery, Snowflake'
description: 'Windmill で SQL の問い合わせを実行するには。PostgreSQL・MySQL・BigQuery・Snowflake などのデータベースにつなぐ。'
slug: '/getting_started/scripts_quickstart/sql'
---
> **[原文](./index.mdx)の日本語訳。** 相違があれば原文が正。
> 原典 © Windmill Labs, Inc. — [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。この訳も同じライセンスで提供します。

# PostgreSQL, MySQL, MS SQL, BigQuery, Snowflake, Redshift, Oracle, DuckDB

このクイックスタートでは、最初のスクリプトを SQL で書きます。Windmill のインスタンスを外部の SQL のサービスにつなぎ、Windmill のスクリプトからデータベースへ問い合わせるところまでを見ます。

![Windmill & PostgreSQL, MySQL, BigQuery and Snowflake](./sqls.png)

ここでは Windmill の web IDE で簡単なスクリプトを作ります。手元で書きたい場合は[手元での開発](../../../advanced/4_local_development/index.mdx)のページを参照してください。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [手元での開発](https://www.windmill.dev/docs/advanced/local_development) —— 端末、VS Code、JetBrains の IDE など、好きな場所で書く。
</div>

<video
	className="border-2 rounded-lg object-cover w-full h-full dark:border-gray-800"
	controls
	id="main-video"
	src="/videos/test_postgres.mp4"
/>

<br />

Windmill は [PostgreSQL](https://www.postgresql.org/)、[MySQL](https://www.mysql.com/)、[Microsoft SQL Server](https://www.microsoft.com/sql-server)、[BigQuery](https://cloud.google.com/bigquery)、[Snowflake](https://www.snowflake.com/) に対応しています。いずれの場合も、専用のリソースを作る必要があります。

PostgreSQL、MySQL、BigQuery、Snowflake、DuckDB は、community edition を含むすべての版で専用の言語として使えます。Oracle DB と MS SQL も、リソースと[誰でも使える言語](../index.mdx)（TypeScript、Python、Go、Bash など）を通せば誰でも使えますが、専用の言語として使えるのは [Enterprise edition](/pricing) のインスタンスと cloud のワークスペースだけです。

## リソースを作る

Windmill は[リソース](../../../core_concepts/3_resources_and_types/index.mdx)を通して、さまざまなアプリやサービスとつながります。リソースは設定と資格情報を収める、中身のある JSON の値です。

リソースにはそれぞれ _リソース型_（[PostgreSQL](https://hub.windmill.dev/resource_types/114/postgresql)、[MySQL](https://hub.windmill.dev/resource_types/111/mysql)、[MS SQL](https://hub.windmill.dev/resource_types/132/ms_sql_server)、[BigQuery](https://hub.windmill.dev/resource_types/108/bigquery)、[Snowflake](https://hub.windmill.dev/resource_types/107/snowflake)）
があり、その型のリソースが満たすべき schema を定めています。schema は [JSON Schema の仕様](https://json-schema.org/)に従います。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [リソースとリソース型](https://www.windmill.dev/docs/core_concepts/resources_and_types) —— リソースは外部の仕組みへの設定と接続を形にしたもの。リソース型がそれぞれの schema を定める。
</div>

:::tip

公式に対応しているリソース型の一覧は [Windmill Hub](https://hub.windmill.dev/resource_types) にあります。

:::

:::tip

スクリプトに `-- database resource_path` の行を足せば、SQL の問い合わせにリソースを固定できます。自動生成される画面で指定しなくても、その問い合わせがそのリソースを使うようになります。

:::

### PostgreSQL

[PostgreSQL](https://www.postgresql.org/) のインスタンス（[Supabase](../../../integrations/supabase.md)、[Neon.tech](../../../integrations/neon.md) など）につなぐには、まず `PostgreSQL` のリソース型でリソースを定義します。

[リソース](../../../core_concepts/3_resources_and_types/index.mdx)のページへ行き、右上の「リソースを追加（Add resource）」をクリックして `PostgreSQL` の型を選びます。

![Select PostgreSQL Resource Type](../../../assets/integrations/psql-1-resources.png.webp)

PostgreSQL のインスタンスの情報をフォームに埋め、必要なら「接続を試す（Test connection）」を押します。

![Paste in Resource Values](../../../assets/integrations/psql-2-postgres-rt.png.webp)

:::tip

試すだけなら、誰にでも用意されている見本の PostgreSQL のリソースが使えます。`f/examples/demo_windmillshowcases` のパスにあります。

:::

#### PostgreSQL: Supabase のデータベースを足す

Windmill には、[Supabase](../../../integrations/supabase.md) のデータベースを PostgreSQL 経由で手軽に足すための案内があります。

<video
	className="border-2 rounded-lg object-cover w-full h-full dark:border-gray-800"
	controls
	src="/videos/supabase_wizard.mp4"
/>

<br />

新しい PostgreSQL のリソースを作るとき、「Supabase の DB を足す（Add a Supabase DB）」を押すだけです。Supabase のページに移るので組織を選び、Windmill に戻ってデータベースを選び、データベースのパスワードを入れれば終わりです。

#### Sequin を使い、外部の API の上に SQL で組み立てる

[Sequin](https://sequin.io) を使うと、Salesforce や HubSpot のような外部のサービスの上に SQL で組み立てられます。詳しくは、

<div className="grid grid-cols-2 gap-6 mb-4">
	- [Sequin を使い、外部の API の上に SQL で組み立てる](https://www.windmill.dev/docs/misc/guides/sequin) —— Sequin を使うと、Salesforce や HubSpot のような外部のサービスの上に SQL で組み立てられる。
</div>

### MySQL

[MySQL](https://www.mysql.com/) のインスタンスにつなぐには、まず `MySQL` のリソース型でリソースを定義します。

[リソース](../../../core_concepts/3_resources_and_types/index.mdx)のページへ行き、右上の「リソースを追加（Add resource）」をクリックして `MySQL` の型を選びます。

![Select MySQL Resource Type](./select_mysql.png.webp)

MySQL のインスタンスの情報をフォームに埋め、必要なら「接続を試す（Test connection）」を押します。

![Paste in Resource Values](./fill_mysql.png.webp)

| 項目 | 型 | 意味 | 既定 | 必須 | どこで分かるか |
| -------- | ------ | --------------- | ------- | -------- | -------------------------------------------------------------------------------------- |
| host | string | インスタンスのホスト |  | false | 契約先の管理画面か、サーバの MySQL の設定ファイル |
| port | number | インスタンスのポート | 3306 | false | 契約先の管理画面か、サーバの MySQL の設定ファイル |
| user | string | 利用者名 |  | true | MySQL で作る（phpMyAdmin や MySQL Workbench など）か、契約先から渡される |
| database | string | データベース名 |  | true | MySQL で作る（phpMyAdmin や MySQL Workbench など）か、契約先から渡される |
| password | string | 利用者のパスワード |  | true | MySQL で作る（phpMyAdmin や MySQL Workbench など）か、契約先から渡される |

### MS SQL

[Microsoft SQL Server](https://www.microsoft.com/sql-server) のインスタンスにつなぐには、まず `ms_sql_server` のリソース型でリソースを定義します。

[リソース](../../../core_concepts/3_resources_and_types/index.mdx)のページへ行き、右上の「リソースを追加（Add resource）」をクリックして `ms_sql_server` の型を選びます。

![Select MySQL Resource Type](./select_mssql.png.webp)

MS SQL のインスタンスの情報をフォームに埋め、必要なら「接続を試す（Test connection）」を押します。

![Paste in Resource Values](./fill_mssql.png.webp)

| 項目 | 型 | 意味 | 既定 | 必須 | どこで分かるか |
| --------- | ------ | ------------------------ | ------- | -------- | ----------------------------------------------------------------------------------------------- |
| host | string | インスタンスのホスト |  | true | 契約先の管理画面か、サーバの MS SQL の設定ファイル |
| port | number | インスタンスのポート |  | false | 契約先の管理画面か、サーバの MS SQL の設定ファイル |
| user | string | 利用者名 |  | false | MS SQL で作る（SQL Server Management Studio など）か、契約先から渡される |
| dbname | string | データベース名 |  | true | MS SQL で作る（SQL Server Management Studio など）か、契約先から渡される |
| password | string | 利用者のパスワード。worker の [Azure workload identity](../../../integrations/mssql.md#azure-workload-identity-for-azure-sql) として認証するなら `ms_entraid` | | false | MS SQL で作る（SQL Server Management Studio など）か、契約先から渡される |
| integrated_auth | bool | Windows 統合認証を使う | false | false | 利用者名とパスワードの代わりに worker の Kerberos の資格情報を使うとき |
| aad_token | object | AD の OAuth トークン |  | false | Windmill 側で OAuth の用意が要る |
| instance_name | string | 名前付きインスタンス |  | false | 名前付きの SQL Server のインスタンス向け（`MSSQLSERVER` など） |
| encrypt | bool | TLS で暗号化する | true | false | false にするのは手元での開発のときだけ |
| trust_cert| bool | サーバの証明書を信頼する | true | false | true にすると、信頼された認証局の署名が無くてもサーバの証明書を信頼する |
| ca_cert | string | CA の証明書 |  | false | サーバの証明書を検証するための CA の証明書。[MS SQL の証明書について詳しくは](https://learn.microsoft.com/en-us/sql/linux/sql-server-linux-docker-container-security?view=sql-server-ver16#encrypt-connections-to-sql-server-linux-containers) |

#### 認証のしかた

MS SQL Server は 4 とおりの認証に対応しています。

1. **利用者名とパスワード**: `user` と `password` の欄を埋めます。
2. **Azure AD (Entra)**: `aad_token` の欄と OAuth を使います。
3. **Azure workload identity**: [workload identity](../../../integrations/mssql.md#azure-workload-identity-for-azure-sql) を持つ AKS の worker で、`password` を `ms_entraid` にします。
4. **Windows 統合認証 (Kerberos)**: `integrated_auth` を有効にします。

#### Windows 統合認証

Active Directory を使う企業の環境では、`integrated_auth` を有効にすると Kerberos による認証が使えます。有効にすると、利用者名とパスワードの代わりに worker のサービスアカウントの資格情報が使われます。

**必要なもの:**
- worker が有効な Kerberos のチケットを持っていること（`kinit` か keytab による）
- worker が、realm の設定が正しい `/etc/krb5.conf` を読めること
- サービスアカウントが対象のデータベースへの権限を持っていること

**Docker / Kubernetes での用意:**
1. keytab のファイルを worker のコンテナに mount する
2. `/etc/krb5.conf` に realm の設定を書く
3. 必要なら、コンテナの起動時に `kinit` を走らせるか、環境変数 `KRB5_KTNAME` を使う

読み取り専用の要求であることを伝えるには、スクリプトに `-- ApplicationIntent=ReadOnly` を足します。

:::info Azure AD (Entra)
Entra (Azure Active Directory) 経由でドメインの資格情報を使うときは、[Windmill の OAuth のインスタンス設定](../../../advanced/27_setup_oauth/index.mdx#azure-oauth)に `https://database.windows.net//.default` のスコープを足す必要があります。

AKS では [Azure workload identity](../../../integrations/mssql.md#azure-workload-identity-for-azure-sql) を使えば OAuth の用意がまったく要りません。リソースのパスワードを `ms_entraid` にすれば、worker は自身の managed identity として認証します。[Azure Database for PostgreSQL](../../../integrations/postgresql.md#azure-workload-identity-for-azure-database-for-postgresql) でも同じです。
:::

### BigQuery

[BigQuery](https://cloud.google.com/bigquery) のインスタンスにつなぐには、まず `BigQuery` のリソース型でリソースを定義します。

[リソース](../../../core_concepts/3_resources_and_types/index.mdx)のページへ行き、右上の「リソースを追加（Add resource）」をクリックして `BigQuery` の型を選びます。

![Select BigQuery Resource Type](./select_bigquery.png.webp)

| 項目 | 型 | 意味 | 必須 |
| --------------------------- | ------ | ---------------------------------------------- | -------- |
| auth_provider_x509_cert_url | string | 認証の提供元の X.509 証明書の URL。 | false |
| client_x509_cert_url | string | クライアントの X.509 証明書の URL。 | false |
| private_key_id | string | 認証に使う秘密鍵の ID。 | false |
| client_email | string | サービスアカウントに結び付いたメールアドレス。 | false |
| private_key | string | 認証に使う秘密鍵。 | false |
| project_id | string | Google Cloud の project の ID。 | true |
| token_uri | string | OAuth 2.0 のトークンの URI。 | false |
| client_id | string | OAuth 2.0 の認証に使うクライアント ID。 | false |
| auth_uri | string | OAuth 2.0 の認可の URI。 | false |
| type | string | 認証のしかたの種類。 | false |

それぞれの値がどこにあるかを、順に見ていきます。

1. **サービスアカウントを作る**:

   - [Google Cloud Console](https://console.cloud.google.com/) を開きます。
   - 上のメニューから対象の project を選びます。
   - 左のナビゲーションで「IAM & Admin」>「Service accounts」へ進みます。
   - 「+ CREATE SERVICE ACCOUNT」のボタンを押します。
   - サービスアカウントの名前と、必要なら説明を入れます。
   - 「Create」を押します。

2. **ロールを割り当てる**:

   - サービスアカウントを作ると、ロールを与えるよう促されます。用途に応じて「BigQuery Admin」や「BigQuery Data Editor」などの BigQuery のロールを選びます。
   - 「Continue」「Done」を押すとサービスアカウントができます。

3. **鍵を作る**:

   - 「Service accounts」の一覧で、いま作ったサービスアカウントを探します。
   - 右の 3 点をクリックして「Manage keys」、続いて「Add Key」を選びます。
   - 鍵の種類に「JSON」を選び、「Create」を押します。

4. **各項目の値**:

   鍵を作ると、ダウンロードされる JSON のファイルに必要な項目がすべて入っています。

<video
	className="border-2 rounded-lg object-cover w-full h-full dark:border-gray-800"
	controls
	src="/videos/add_bigquery.mp4"
/>

<br />
必要なら、そのまま「接続を試す（Test connection）」を押せます。

### Snowflake

[Snowflake](https://www.snowflake.com/) につなぐには、[Snowflake の OAuth](../../../advanced/27_setup_oauth/index.mdx#oauth) を用意するか、Snowflake のリソースを定義するかのどちらかを選べます。

Snowflake の OAuth の接続があるなら、[リソース](../../../core_concepts/3_resources_and_types/index.mdx)へ行き、右上の「リソースを追加（Add Resource）」をクリックして `snowflake_oauth` を選べば、新しいリソースを作れます。Snowflake の OAuth を使ったアプリの作り方は[この手引き](../../../misc/9_guides/snowflake_app_with_user_roles/index.mdx#sample-app-setup)を参照してください。

OAuth を使いたくなければ、右上の「リソースを追加（Add Resource）」をクリックして `Snowflake` の型を選びます。

![Select Snowflake Resource Type](./select_snowflake.png.webp)

| 項目 | 型 | 意味 | 必須 |
| ------------------ | ------ | ---------------------------------------------------------------------- | -------- |
| account_identifier | string | `<orgname>-<account_name>` の形の Snowflake のアカウントの識別子。 | true |
| private_key | string | 認証に使う秘密鍵。 | true |
| public_key | string | 認証に使う公開鍵。 | true |
| warehouse | string | 問い合わせに使う Snowflake の warehouse。 | false |
| username | string | Snowflake にログインする利用者名。 | true |
| database | string | つなぐ Snowflake の database の名前。 | true |
| schema | string | その database の中の schema。 | false |
| role | string | つなぐときに引き受けるロール。 | false |

それぞれの値がどこにあるかを、順に見ていきます。

1. **アカウントの識別子**:

   アカウントの識別子はたいてい `<orgname>-<account_name>` の形です。Snowflake の web の画面で見つかります。

   - Snowflake のアカウントにログインします。
   - ログイン後、識別子は URL か画面の上のほうに出ていることが多いです（`https://app.snowflake.com/orgname/account_name/` の形）。

   [アカウントの識別子についての Snowflake のドキュメント](https://docs.snowflake.com/en/user-guide/admin-account-identifier)

2. **利用者名**:

   利用者名は、データベースにつなぐのに使う Snowflake の利用者です。無ければ作る必要があります。

   - Snowflake の web の画面で「ACCOUNT」のタブへ行きます。
   - 左のナビゲーションで「Users」を選びます。
   - 「+ CREATE USER」のボタンを押し、利用者名とパスワードを決めて新しい利用者を作ります。

3. **公開鍵と秘密鍵**:

   公開鍵と秘密鍵は、OpenSSL のような道具で作る必要があります。

   - 端末を開きます。
   - OpenSSL で公開鍵と秘密鍵の組を作ります。正確なコマンドは OS によって変わります。
   - 例えば公開鍵を作るには: `openssl rsa -pubout -in private_key.pem -out public_key.pem`

   鍵ができたら、中身を写して設定のそれぞれの欄に貼ります。

   [鍵の組による認証と鍵の入れ替えについての Snowflake のドキュメント](https://docs.snowflake.com/en/user-guide/key-pair-auth)

4. **warehouse・schema・database・role**:

   これらは Snowflake の環境ごとのもので、インスタンスをどう設定したかによります。

   - `warehouse`: つなぎたい Snowflake の warehouse の名前。
   - `schema`: 使いたい Snowflake の schema の名前。
   - `database`: つなぎたい Snowflake の database の名前。
   - `role`: 認証に使いたいロール。

   これらは Snowflake の web の画面で見つかります。

   - Snowflake のアカウントにログインします。
   - warehouse・schema・database・role の名前は、画面で見るか、SQL を実行すれば分かります。

必要なら、そのまま「接続を試す（Test connection）」を押せます。

### Amazon Redshift

Amazon Redshift のインスタンスにつなぐには、対応するリソースを足します。Redshift は Windmill の PostgreSQL のリソースとスクリプトと互換があるので、まず PostgreSQL のリソース型を新しく足すところから始めます。

![Select PostgreSQL Resource Type](../../../assets/integrations/psql-1-resources.png.webp)

必要な値は AWS のコンソールの CLUSTERS > 対象の Redshift のクラスタから取れます。

![AWS Redshift Cluster Screen](../../../assets/integrations/redshift-aws-console.png)

'endpoint' という値を探してください。こういう形をしているはずです。

```
default-workgroup.475893240789.us-east-1.redshift-serverless.amazonaws.com:5439/dev
```
ここから host、port、database の名前が分かります。

- host: default-workgroup.475893240789.us-east-1.redshift-serverless.amazonaws.com
- port: 5439
- dbname: dev

これらの値を Windmill に入れ、db の利用者名とパスワードも入れて、「接続を試す（Test connection）」で動くことを確かめます。

![Fill in the required values](../../../assets/integrations/redshift-resource-filled.png)

うまくいったら保存してください。これで Redshift のインスタンスを PostgreSQL のリソースとして足せました。

### Oracle

[Oracle のデータベース](https://www.oracle.com/database/)につなぐには、Oracle のリソースを定義する必要があります。

[リソース](../../../core_concepts/3_resources_and_types/index.mdx)のページへ行き、右上の「リソースを追加（Add resource）」をクリックして `Oracle` の型を選びます。

![Select Oracle Resource Type](./select_oracle.png)

| 項目 | 型 | 意味 | 必須 |
| --------- | ------ | --------------- | -------- |
| database | string | データベース名 | true |
| user | string | 利用者名 | true |
| password | string | 利用者のパスワード | true |

それぞれの値がどこにあるかを、順に見ていきます。

1. **Database**: つなぎたい Oracle のデータベースの名前です。Oracle の設定を見るか、データベースの管理者に訊けば分かります。

2. **Username**: Oracle にログインする利用者名です。無ければ作る必要があります。

   - Oracle の画面で「Users」の節へ行きます。
   - 利用者名とパスワードを決めて新しい利用者を作ります。

3. **Password**: その利用者名に対応するパスワードです。

必要なら、そのまま「接続を試す（Test connection）」を押せます。

### DuckDB

DuckDB のスクリプトは、何もしなくてもメモリ上で動きます。

## スクリプトを作る

次に、いま作ったリソースを使うスクリプトを作ります。ホーム画面で **新規（New）** をクリックし、**スクリプト（Script）** を選びます。名前と要約を付け、好きな言語を選んでください —— [PostgreSQL](#postgresql-1)、[MySQL](#mysql-1)、[MS SQL](#ms-sql-1)、[BigQuery](#bigquery-1)、[Snowflake](#snowflake-1)。

![Script creation first step](../../../assets/integrations/sql_new_script.png.webp)

スクリプトの詳細は[設定の節](../../../script_editor/settings.mdx)で足せます。あとからいつでも戻れます。

### PostgreSQL

引数はこの形で渡します。

```sql
-- $1 name1 = default arg
-- $2 name2
INSERT INTO demo VALUES ($1::TEXT, $2::INT) RETURNING *
```

「name1」「name2」が引数の名前、「default arg」が任意の既定値です。

データベースのリソースは、画面から選ぶことも、スクリプトの中に `-- database resource_path` の 1 行を書いて直に指定することもできます。

<video
	className="border-2 rounded-lg object-cover w-full h-full dark:border-gray-800"
	controls
	src="/videos/pin_database.mp4"
/>

<br/>

あとは prepared statement を書くだけです。

<video
	className="border-2 rounded-lg object-cover w-full h-full dark:border-gray-800"
	controls
	src="/videos/test_postgres.mp4"
/>

### MySQL

引数はこの形で渡します。

```sql
-- :name1 (text) = default arg
-- :name2 (int)
INSERT INTO demo VALUES (:name1, :name2)
```

「name1」「name2」が引数の名前、「default arg」が任意の既定値です。

データベースのリソースは、画面から選ぶことも、スクリプトの中に `-- database resource_path` の 1 行を書いて直に指定することもできます。

<video
	className="border-2 rounded-lg object-cover w-full h-full dark:border-gray-800"
	controls
	src="/videos/pin_database.mp4"
/>

<br/>
あとは prepared statement を書くだけです。

![Mysql statement](./mysql_statement.png.webp)

### MS SQL

引数はこの形で渡します。

```sql
-- @P1 name1 (varchar) = default arg
-- @P2 name2 (int)
INSERT INTO demo VALUES (@P1, @P2)
```

「name1」「name2」が引数の名前、「default arg」が任意の既定値です。

データベースのリソースは、画面から選ぶことも、スクリプトの中に `-- database resource_path` の 1 行を書いて直に指定することもできます。

<video
	className="border-2 rounded-lg object-cover w-full h-full dark:border-gray-800"
	controls
	src="/videos/pin_database.mp4"
/>

<br/>
あとは prepared statement を書くだけです。

![Mysql statement](./mssql_statement.png.webp)

### BigQuery

引数はこの形で渡します。

```sql
-- @name1 (string) = default arg
-- @name2 (integer)
-- @name3 (string[])
INSERT INTO `demodb.demo` VALUES (@name1, @name2, @name3)
```

「name1」「name2」「name3」が引数の名前、「default arg」が任意の既定値、`string`・`integer`・`string[]` が型です。

データベースのリソースは、画面から選ぶことも、スクリプトの中に `-- database resource_path` の 1 行を書いて直に指定することもできます。

<video
	className="border-2 rounded-lg object-cover w-full h-full dark:border-gray-800"
	controls
	src="/videos/pin_database.mp4"
/>

<br/>
あとは prepared statement を書くだけです。

<video
	className="border-2 rounded-lg object-cover w-full h-full dark:border-gray-800"
	controls
	src="/videos/test_bigquery.mp4"
/>

### Snowflake

引数はこの形で渡します。

```sql
-- ? name1 (varchar) = default arg
-- ? name2 (int)
INSERT INTO demo VALUES (?, ?)
```

「name1」「name2」が引数の名前、「default arg」が任意の既定値、`varchar` と `int` が型です。

データベースのリソースは、画面から選ぶことも、スクリプトの中に `-- database resource_path` の 1 行を書いて直に指定することもできます。

<video
	className="border-2 rounded-lg object-cover w-full h-full dark:border-gray-800"
	controls
	src="/videos/pin_database.mp4"
/>

<br/>
あとは prepared statement を書くだけです。

![Snowflake statement](./snowflake_statement.png.webp)

### Amazon Redshift

Redshift は Windmill の PostgreSQL と互換があるので、[PostgreSQL のスクリプト](#postgresql-1)と同じ手順で進められます。リソースには Redshift のインスタンスを選んでください。

Redshift のリソースを使うときは、PostgreSQL ではなく Redshift として正しい SQL を書く必要があることに注意してください。例えば `RETURNING *` は使えないので、既定のスクリプトをこう変えるとよいでしょう。

```sql
-- $1 name1 = default arg
-- $2 name2
INSERT INTO demo VALUES ($1::TEXT, $2::INT)
```

違いについては[こちら](https://docs.aws.amazon.com/redshift/latest/dg/c_redshift-and-postgres-sql.html)で詳しく説明されています。

### Oracle

引数はこの形で渡します。

```sql
-- database f/your/path
-- :name1 (text) = default arg
-- :name2 (int)
-- :name3 (int)
INSERT INTO demo VALUES (:name1, :name2);
UPDATE demo SET col2 = :name3 WHERE col2 = :name2;
```

「name1」「name2」「name3」が引数の名前、「default arg」が任意の既定値です。

### DuckDB

DuckDB の引数はこの形で渡します。
```sql
-- $name1 (text) = default arg
-- $name2 (int)
INSERT INTO demo VALUES ($name1, $name2)
```
「name1」「name2」が引数の名前、「default arg」が任意の既定値です。  

S3 のファイルを s3object の型の引数として渡せます。実行時に正しい 's3:///...' のパスに置き換えられます。
そのファイルは read_csv / read_parquet / read_json といったいつもの関数で読めます。
```sql
-- $file (s3object)
SELECT * FROM read_parquet($file)
```

他の SQL の方言（PostgreSQL、MSSQL、MySQL、BigQuery、Snowflake）も `(s3object)` の引数を受け付けますが、こちらはファイルの中身を JSON の引数として渡し、SQL 側がその方言の JSON を表にする関数（`OPENJSON`、`jsonb_to_recordset`、`JSON_TABLE` など）で読む形になります。[SQL と S3](../../../core_concepts/65_sql_to_s3_streaming/index.mdx#reading-s3-files-as-parameters)を参照してください。

あるいは、ワークスペースのファイルを s3:// の書き方で直に指せます。

主となるワークスペースの保管先の場合:
```sql
SELECT * FROM read_parquet('s3:///path/to/file.parquet')
```

副の保管先の場合:
```sql
SELECT * FROM read_parquet('s3://<secondary_storage>/path/to/file.parquet')
```

この書き方は glob の模様でも使えます。
```sql
SELECT * FROM read_parquet('s3:///myfiles/*.parquet')
```

s3:// の書き方は、いまは既定で Windmill の [S3 Proxy](../../../core_concepts/38_object_storage_in_windmill/index.mdx#s3-proxy) を通ります。

他のデータベースのリソース（BigQuery、PostgreSQL、MySQL）に attach することもできます。裏では DuckDB の公式・有志の拡張を使っています。
```sql
ATTACH '$res:u/demo/amazed_postgresql' AS db (TYPE postgres);
SELECT * FROM db.public.friends;
```


データベースのリソースは、画面から選ぶことも、スクリプトの中に `-- database resource_path` の 1 行を書いて直に指定することもできます。

<video
	className="border-2 rounded-lg object-cover w-full h-full dark:border-gray-800"
	controls
	src="/videos/pin_database.mp4"
/>

<br/>
あとは prepared statement を書くだけです。

## 結果の集め方

`result_collection` の指示で、スクリプトが何を返すかを選べます。

| 集め方                            | 返るもの                                 |
| --------------------------------- | ---------------------------------------- |
| last_statement_all_rows（既定）   | レコードの配列                           |
| last_statement_first_row          | レコード                                 |
| last_statement_all_rows_scalar    | 単一の値の配列                           |
| last_statement_first_row_scalar   | 単一の値                                 |
| all_statements_all_rows           | レコードの配列の配列                     |
| all_statements_first_row          | レコードの配列                           |
| all_statements_all_rows_scalar    | 単一の値の配列の配列                     |
| all_statements_first_row_scalar   | 単一の値の配列                           |
| legacy（非推奨）                  | この指示が入る前の挙動                   |

例:

```sql
-- result_collection=all_statements_first_row_scalar
SELECT 1;
SELECT 2;
SELECT 3;

-- Result: [1, 2, 3]
```

```sql
-- result_collection=last_statement_all_rows
INSERT INTO my_table VALUES ('a', 'b', 'c');
INSERT INTO my_table VALUES ('1', '2', '3');
SELECT * FROM my_table;
-- Result: [
--   { "col1": "a", "col2": "b", "col3": "c" },
--   { "col1": "1", "col2": "2", "col3": "3" }
-- ]
--
```


## 文脈の変数

問い合わせの中で[文脈の変数](../../../core_concepts/47_environment_variables/index.mdx#contextual-variables)を使えます。こうして `%%` で囲む必要があります。

```sql
SELECT '%%WM_WORKSPACE%%'
```

## 生の問い合わせ

### 安全に埋め込む引数

prepared statement より自由にしたい場合のために、Windmill は[サーバ側での schema の検証](../../../core_concepts/13_json_schema_and_parsing/index.mdx#backend-schema-validation)を使って、問い合わせに文字列を安全に埋め込めるようにしています。これにより、表や列の名前のような、普通なら引数にできないところにもスクリプトの引数を使えます。ただし SQL の注入を防ぐため、これらの引数は実行時に検査され、次のどれかに反すると job が失敗します。

- 引数が空でない文字列であること。
- 文字が英字（ASCII のみ）・数字・下線（`_`）のいずれかだけであること。つまり空白も記号も許されません。
- 数字で始まらないこと。
- 引数が列挙なら、定義した候補のどれかであること。

この決まりは、思わぬ注入を防ぐには十分に厳しく、それでいて役に立つ使い方ができる程度にはゆるやかです。例を見てみましょう。

```sql
-- :daily_minimum_calories (int)
-- %%table_name%% fruits/vegetables/cereals

SELECT name, calories FROM %%table_name%% WHERE calories > daily_minimum_calories
```

この例では、引数 `table_name` は `"fruits"`・`"vegetables"`・`"cereals"` のいずれかを取る文字列として定義されていて、スクリプトを使う人はこの引数でどの表に問い合わせるかを選べます。別の表を指そうとすると、DB につなぐ前に job が失敗するので、見せたくないデータが守られます。

列挙の候補を書かなければ、その欄は普通の文字列として扱われ、他の決まりだけが効きます。

```sql
-- :daily_minimum_calories (int)
-- %%table_name%%

SELECT name, calories FROM %%table_name%% WHERE calories > daily_minimum_calories
```

この場合、スクリプトを使う人がデータベースの在る表・無い表すべてに対してこの問い合わせを試せる、ということに注意してください。


### REST のスクリプトでの危うい埋め込み

もっと手軽ですが安全でないやり方として、TypeScript・Deno・Python のクライアントから生の問い合わせを実行する手があります。例えば文字列を埋め込んで、表の名前をスクリプトの引数にできます: `SELECT * FROM ${table}`。ただし文字列がそのまま埋め込まれるので危険で、[SQL の注入](https://en.wikipedia.org/wiki/SQL_injection)の入り口になります。信頼できる環境でのみ、気を付けて使ってください。

#### PostgreSQL


#### TypeScript (Bun)


```ts
import * as wmill from 'windmill-client';
import { Client } from 'pg';

// Define the resource type as specified
type Postgresql = {
  host: string,
  port: number,
  user: string,
  dbname: string,
  sslmode: string,
  password: string,
  root_certificate_pem: string
}

// The main function that will execute a query on a Postgresql database
export async function main(query = 'SELECT * FROM demo', pg_resource: Postgresql) {
  // Initialize the PostgreSQL client, deriving the SSL configuration from the resource's sslmode
  const client = new Client({
    host: pg_resource.host,
    port: pg_resource.port,
    user: pg_resource.user,
    password: pg_resource.password,
    database: pg_resource.dbname,
    ssl: pg_resource.sslmode === 'disable' ? false : { rejectUnauthorized: false },
  });

  try {
    // Connect to the database
    await client.connect();

    // Execute the query
    const res = await client.query(query);

    // Close the connection
    await client.end();

    // Return the query result
    return res.rows;
  } catch (error) {
    console.error('Database query failed:', error);
    // Rethrow the error to handle it outside or log it appropriately
    throw error;
  }
}
```

スクリプトを [Windmill Hub](https://hub.windmill.dev/scripts/postgresql/7105/execute-arbitrary-query-and-return-results-postgresql).


#### TypeScript (Deno)


```ts
import {
  type Sql,
} from "https://deno.land/x/windmill@v1.88.1/mod.ts";

import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts"

type Postgresql = {
  host: string;
  port: number;
  user: string;
  dbname: string;
  sslmode: string;
  password: string;
};
export async function main(db: Postgresql, query: Sql = "SELECT * FROM demo;") {
  if (!query) {
    throw Error("Query must not be empty.");
  }
  const { rows } = await pgClient(db).queryObject(query);
  return rows;
}

export function pgClient(db: any) {
  let db2 = {
    ...db,
    hostname: db.host,
    database: db.dbname,
    tls: {
        enabled: false,
    },
  }
  return new Client(db2)
}
```

スクリプトを [Windmill Hub](https://hub.windmill.dev/scripts/postgresql/1294/execute-query-and-return-results-postgresql).


#### Python


```python
from typing import TypedDict, Dict, Any
import psycopg2

# Define the PostgreSQL resource type as specified
class postgresql(TypedDict):
    host: str
    port: int
    user: str
    dbname: str
    sslmode: str
    password: str
    root_certificate_pem: str

def main(query: str, db_config: postgresql) -> Dict[str, Any]:
    # Connect to the PostgreSQL database
    conn = psycopg2.connect(
        host=db_config["host"],
        port=db_config["port"],
        user=db_config["user"],
        password=db_config["password"],
        dbname=db_config["dbname"],
        sslmode=db_config["sslmode"],
        sslrootcert=db_config["root_certificate_pem"],
    )

    # Create a cursor object
    cur = conn.cursor()

    # Execute the query
    cur.execute(query)

    # Fetch all rows from the last executed statement
    rows = cur.fetchall()

    # Close the cursor and connection
    cur.close()
    conn.close()

    # Convert the rows to a list of dictionaries to make it more readable
    columns = [desc[0] for desc in cur.description]
    result = [dict(zip(columns, row)) for row in rows]

    return result
```

スクリプトを [Windmill Hub](https://hub.windmill.dev/scripts/postgresql/7106/execute-arbitrary-query-postgresql).


:::tip

PostgreSQL に関するスクリプトの例は [Windmill Hub](https://hub.windmill.dev/?app=postgresql) にもっとあります。

:::

#### MySQL

MySQL でも同じです。


#### TypeScript (Bun)


```ts
import { createConnection } from 'mysql';

// Define the Mysql resource type as specified
type Mysql = {
  ssl: boolean,
  host: string,
  port: number,
  user: string,
  database: string,
  password: string
}

// The main function that will execute a query on a Mysql resource
export async function main(mysqlResource: Mysql, query: string): Promise<any> {
  // Create a promise to handle the MySQL connection and query execution
  return new Promise((resolve, reject) => {
    // Create a connection to the MySQL database using the resource credentials
    const connection = createConnection({
      host: mysqlResource.host,
      port: mysqlResource.port,
      user: mysqlResource.user,
      password: mysqlResource.password,
      database: mysqlResource.database,
      ssl: mysqlResource.ssl
    });

    // Connect to the MySQL database
    connection.connect(err => {
      if (err) {
        reject(err);
        return;
      }

      // Execute the query provided as a parameter
      connection.query(query, (error, results) => {
        // Close the connection after the query execution
        connection.end();

        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  });
}
```

スクリプトを [Windmill Hub](https://hub.windmill.dev/scripts/mysql/7108/execute-arbitrary-query-mysql).


#### TypeScript (Deno)


```ts
import { createPool as createMysqlPool } from "npm:mysql2/promise";

// Define the MySQL resource type as specified
type Mysql = {
  ssl: boolean,
  host: string,
  port: number,
  user: string,
  database: string,
  password: string

}

// The main function that executes a query on a MySQL database
export async function main(
  mysqlResource: Mysql,
  query: string,
): Promise<any> {
  // Adjust the SSL configuration based on the mysqlResource.ssl value
  const sslConfig = mysqlResource.ssl ? { rejectUnauthorized: true } : false;

  // Create a new connection pool using the provided MySQL resource
  const pool = createMysqlPool({
    host: mysqlResource.host,
    user: mysqlResource.user,
    database: mysqlResource.database,
    password: mysqlResource.password,
    port: mysqlResource.port,
    // Use the adjusted SSL configuration
    ssl: sslConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  try {
    // Get a connection from the pool and execute the query
    const [rows] = await pool.query(query);
    return rows;
  } catch (error) {
    // If an error occurs, throw it to be handled by the caller
    throw new Error(`Failed to execute query: ${error}`);
  } finally {
    // Always close the pool after the operation is complete
    await pool.end();
  }
}

```

スクリプトを [Windmill Hub](https://hub.windmill.dev/scripts/mysql/7107/execute-arbitrary-query-mysql).


#### Python


```python
from typing import TypedDict
import mysql.connector as mysql_connector

# Define the MySQL resource type
class mysql(TypedDict):
    ssl: bool
    host: str
    port: float
    user: str
    database: str
    password: str

def main(mysql_credentials: mysql, query: str) -> str:
    # Connect to the MySQL database using the provided credentials
    connection = mysql_connector.connect(
        host=mysql_credentials["host"],
        user=mysql_credentials["user"],
        password=mysql_credentials["password"],
        database=mysql_credentials["database"],
        port=int(mysql_credentials["port"]),
        ssl_disabled=not mysql_credentials["ssl"],
    )

    # Create a cursor object
    cursor = connection.cursor()

    # Execute the query
    cursor.execute(query)

    # Fetch one result
    result = cursor.fetchone()

    # Close the cursor and connection
    cursor.close()
    connection.close()

    # Return the result
    return str(result[0])
```

スクリプトを [Windmill Hub](https://hub.windmill.dev/scripts/mysql/7109/execute-arbitrary-query-mysql).


[MS SQL](#ms-sql)、[BigQuery](#bigquery)、[Snowflake](#snowflake) も同様です。

## スクリプトを調整する

できあがったら「[配備（Deploy）](../../../core_concepts/0_draft_and_deploy/index.mdx)」をクリックすると、ワークスペースに保存されます。これでこのスクリプトを[フロー](../../../flows/1_flow_editor.mdx)や[アプリ](../../../full_code_apps/index.mdx)の中で使えますし、単体でも使えます。

スクリプトのメタデータ（[パス](../../../core_concepts/16_roles_and_permissions/index.mdx#path)、名前、説明）、実行のしかた（[同時実行の上限](../../../script_editor/concurrency_limit.mdx)、[worker のグループ](../../../script_editor/settings.mdx#worker-group-tag)、[キャッシュ](../../../core_concepts/24_caching/index.md)、[専用の worker](../../../core_concepts/25_dedicated_workers/index.mdx)）、[生成される UI](../../../script_editor/customize_ui.mdx) は自由に調整してください。

![Customize SQL](./customize_sql.png 'Customize SQL')

<div className="grid grid-cols-2 gap-6 mb-4">
	- [Settings](../../../script_editor/settings.mdx) —— Each script has metadata & settings associated with it, enabling it to be defined and configured in depth.
	- [Generated UI](../../../script_editor/customize_ui.mdx) —— main function's arguments can be given advanced settings that will affect the inputs' auto-generated UI and JSON Schema.
</div>

## 次は

これらのスクリプトは動く最小の例ですが、実際に使うにはもう少し段が要ります。

- スクリプトに[変数と秘密](../../../core_concepts/2_variables_and_secrets/index.mdx)を渡す。
- [リソース](../../../core_concepts/3_resources_and_types/index.mdx)につなぐ。
- いろいろなやり方で[そのスクリプトを起こす](../../../triggers/index.mdx)。
- [フロー](../../../flows/1_flow_editor.mdx)、[ローコードのアプリ](../../../apps/0_app_editor/index.mdx)、[フルコードのアプリ](../../../full_code_apps/index.mdx)にスクリプトを組み合わせる（特に、アプリの中でデータベースを見て触るための [Database studio](#database-studio)）。
- [Windmill Hub](https://hub.windmill.dev) で、みんなに[スクリプトを公開](../../../misc/1_share_on_hub/index.md)できます。出すと、まず取りまとめ役が確かめ、そのあと Windmill の中から誰でも使えるようになります。

スクリプトは書き換えられないもので、配備のたびに hash が付きます。上書きされることはなく、パスで指すというのは、そのパスに最後に配備された hash を指すという意味です。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [版の管理](https://www.windmill.dev/docs/core_concepts/versioning#script-versioning) —— 配備されたスクリプトは、hash で指される親のスクリプトを持てる。
</div>

スクリプトごとに、署名から推測した JSON schema をもとに UI が自動生成されます。単体で細かく調整することも、[アプリの作成画面](../../7_apps_quickstart/index.mdx)で作り込んだ UI に埋め込むこともできます。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [自動生成される UI](https://www.windmill.dev/docs/core_concepts/auto_generated_uis) —— Windmill はスクリプトとフローの引数から UI を自動で作る。
	- [Generated UI](../../../script_editor/customize_ui.mdx) —— main function's arguments can be given advanced settings that will affect the inputs' auto-generated UI and JSON Schema.
</div>

UI に加えて、配備ごとに同期・非同期の [webhook](../../../core_concepts/4_webhooks/index.mdx) が作られます。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [webhook](https://www.windmill.dev/docs/core_concepts/webhooks) —— webhook からスクリプトとフローを起こす。
</div>

## Database studio

Windmill の[ローコードのアプリエディタ](../../../apps/0_app_editor/index.mdx)（旧来のもの）では、[Database studio](../../../apps/4_app_configuration_settings/database_studio.mdx) の部品を使ってデータベースを見て触ることもできます（PostgreSQL / MySQL / MS SQL / Snowflake / BigQuery のすべてに対応）。

![Database studio](../../../assets/apps/4_app_component_library/db_studio.png "Database studio")

<iframe
	style={{ aspectRatio: '16/9' }}
	src="https://www.youtube.com/embed/Fd_0EffVDtw"
	title="Database studio"
	frameBorder="0"
	allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
	allowFullScreen
	className="border-2 rounded-lg object-cover w-full dark:border-gray-800"
></iframe>

<br/>

Database studio の部品でできることは、
- 表の中身を見る。
- 升目を直に編集して、表の中身を書き換える（編集できる升目に限る）。
- 行を足す。
- 行を消す。

詳しくは、

<div className="grid grid-cols-2 gap-6 mb-4">
	- [Database studio](https://www.windmill.dev/docs/apps/app_configuration_settings/database_studio) —— Ag Grid で表を見せて操作する、web のデータベース管理の道具。
</div>

## 大きな結果を S3 へ流す（Enterprise の機能）

SQL のスクリプトが返すデータが多すぎて、Windmill の 10,000 行という上限を超えることがあります。そういうときは s3 のフラグを使い、結果をファイルへ流し込みます。

<div className="grid grid-cols-2 gap-6 mb-4">
  - [SQL の結果を S3 へ流す](https://www.windmill.dev/docs/core_concepts/sql_to_s3_streaming) —— SQL の大きな結果を、ワークスペースの保管先のファイルへ流し込む。
</div>