---
description: Windmill でフルコードのアプリを作るには。React か Svelte のアプリを作り、背後の実行対象につなぐまでを順を追って。
---
> **[原文](./index.mdx)の日本語訳。** 相違があれば原文が正。
> 原典 © Windmill Labs, Inc. — [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。この訳も同じライセンスで提供します。

# フルコードのアプリのクイックスタート

このページでは、最初の[フルコードのアプリ](../../full_code_apps/index.mdx)を作ります。Windmill の画面から React のアプリを作り、雛形のコードを読み、背後の実行対象をもう 1 つ足して、その両方を整えた UI につなぎます。

![フルコードのアプリ](./full_code_app_demo.png 'Full code apps')

フルコードのアプリでは、UI を React か Svelte で完全に自分の手で書けます。実行・権限・配備は Windmill が引き受けます。

| | フルコードのアプリ | ローコードのアプリ |
|---|---|---|
| **UI** | 自分で書く React／Svelte の部品 | ドラッグ＆ドロップの部品一覧 |
| **画面側のロジック** | フレームワークの機能をすべて（hook、store、routing） | 部品をつなぐ ＋ その場のスクリプト |
| **背後** | `backend/` フォルダのスクリプト。言語は自由 | 実行対象のパネル。その場かワークスペースのスクリプト |
| **手元での開発** | `wmill app dev` で自動再読み込み | web のエディタのみ |
| **向いているもの** | 作り込んだ UI、込み入った操作、既にあるコード | 手早いダッシュボード、フォーム、CRUD の画面 |

<div className="grid grid-cols-2 gap-6 mb-4">
	- [ローコードのアプリのクイックスタート](https://www.windmill.dev/docs/getting_started/apps_quickstart) —— ドラッグ＆ドロップのほうがよいですか。ローコードのエディタでアプリを作る。
</div>

## 手順 1: アプリを作る

### 画面から

[Windmill](../00_how_to_use_windmill/index.mdx) のホーム画面で **新規（New）** をクリックし、**アプリ（フルコード）** を選びます。

![フルコードのアプリを選ぶ](./pick_raw_app.png 'Pick full-code app')

設定の対話で、

1. フレームワークを選びます（React か Svelte 5）。ここでは React 19 を使います
2. データの設定を選びます。ここでは新しいデータテーブルにします。アプリにデータテーブルは必須ではなく、このクイックスタートでは[専用の節](#手順-5-データテーブルで残す)でしか使いません
3. 「AI なし（without AI）」で始めます。あるいは指示を 1 つ書いて AI に任せれば、クイックスタートはそこで終わりです :)

![React を選ぶ](./pick_react.png 'Pick React framework')

雛形の入った状態で [UI エディタ](../../full_code_apps/6_ui_editor/index.mdx)が開きます。

### CLI から

同じことが [Windmill の CLI](../../advanced/3_cli/index.mdx) からもできます。

```bash
wmill app new
```

同じ選択を対話で訊かれます。そのあと依存を入れ、開発用のサーバを起動します。

```bash
cd f/folder/my_app.raw_app
npm install
wmill app dev
```

`http://localhost:4000` に、自動再読み込み付きの手元のサーバが立ちます。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [CLI での進め方](https://www.windmill.dev/docs/full_code_apps/cli_workflow) —— 端末から雛形を作り、開発し、配備するまでの案内。
</div>

## 手順 2: 雛形を読む

作られたアプリはこういう構成です。

```
f/folder/my_app.raw_app/
├── raw_app.yaml          # App metadata and configuration
├── package.json          # Frontend dependencies
├── index.tsx             # Entry point (renders App)
├── App.tsx               # Main React component
├── index.css             # Styles
└── backend/
    ├── a.yaml            # Sample backend runnable config
    └── a.ts              # Sample backend runnable code
```

![既定の App.tsx](./default_tsx.png 'Default App.tsx')

### 既定の App.tsx

雛形の `App.tsx` はこうなっています。

```tsx
import React, { useState } from 'react'
import { backend } from './wmill'
import './index.css'

const App = () => {
    const [value, setValue] = useState(undefined as string | undefined)
    const [loading, setLoading] = useState(false)

    async function runA() {
        setLoading(true)
        try {
            setValue(await backend.a({ x: 42 }))
        } catch (e) {
            console.error(e)
        }
        setLoading(false)
    }

    return <div style={{ width: "100%" }}>
        <h1>hello world</h1>

        <button style={{ marginTop: "2px" }} onClick={runA}>Run 'a'</button>

        <div style={{ marginTop: "20px", width: '250px' }} className='myclass'>
            {loading ? 'Loading ...' : value ?? 'Click button to see value here'}
        </div>
    </div>
}

export default App
```

`./wmill` から `backend` を読み込んでいます。これは自動生成される module で、[背後の実行対象](../../full_code_apps/2_backend_runnables/index.mdx)を型付きの関数として呼べるようにします。ここではボタンを押すと `backend.a()` が呼ばれ、`backend/` フォルダにある見本の実行対象 `a` が動きます。

### 既定の実行対象

見本の `backend/a.ts` は、ただの TypeScript の関数です。

```typescript
// import * as wmill from "windmill-client"

export async function main(x: string) {
  return x
}

```

UI は 'App.tsx' を選べば右側の枠に見えますし、UI エディタで「下見（Preview）」を押せば全画面で見られます。CLI を使っているなら、ブラウザで `http://localhost:4000` を開いてください。ボタンを押すと、背後に要求が飛び、返ってきた結果が表示されます。

![既定の実行対象](./default_backend.png 'Default backend runnable')

### 仕組み

肝は、`backend.a({ x: 42 })` がその呼び出しを Windmill の worker へ送り、そこで `backend/a.ts` が実行され、結果が返る、という点です。**画面側が背後のコードを直に走らせることはありません。** WebSocket 越しに Windmill の実行機構を通るので、記録・権限・誤りの扱いが何もせずに付いてきます。

## 手順 3: 実行対象を直す・足す

雛形のアプリには実行対象が 1 つ（`a`）あります。これを書き換え、もう 1 つ足します。

### UI エディタから

実行対象のパネルで `a` をクリックします。要約に「Multiply」と付け、コードをこう入れ替えます。

```typescript
// backend/a.ts
export async function main(x: number) {
  // Simulate some processing
  await new Promise(resolve => setTimeout(resolve, 500));
  return `Result: ${x} × 2 = ${x * 2}`;
}
```

![Multiply の実行対象](./multiply.png 'Multiply runnable')

次に 2 つ目の実行対象を足します。今度は [Python](../../getting_started/0_scripts_quickstart/2_python_quickstart/index.mdx) です —— 1 つのアプリの中で言語を混ぜられます。

1. 右側の実行対象のパネルで `+` をクリックします
2. 言語に **Python** を選びます
3. 名前を `b`、要約を「Get timestamp」とします

![言語を選ぶ](./choose_language.png 'Choose language')

このコードを貼ります。

```python
# backend/b.py
from datetime import datetime

def main(format: str):
    now = datetime.now()
    if format == "iso":
        return now.isoformat()
    elif format == "locale":
        return now.strftime("%c")
    else:
        return str(now)
```

![Get timestamp の実行対象](./get_timestamp.png 'Get timestamp runnable')

見てのとおり、[自動生成される UI](../../core_concepts/6_auto_generated_uis/index.mdx) が新しい入力の名前（`format`）で更新されました。

これで、別々の言語で書かれた実行対象が 2 つあります。`a`（TypeScript）は数を 2 倍にし、`b`（Python）は整えた日時を返します。**画面側からの呼び方はまったく同じ**で、背後でどの言語が動いているかを知る必要はありません。

### 手元のファイルから

代わりに、`backend/` で直に作業してもかまいません。

- `backend/a.ts` を上の multiply のコードに書き換える
- `backend/b.py` を作り、上の Python のコードを入れる

言語は拡張子から判別され（TypeScript なら `.ts`、Python なら `.py`）、実行対象の id はファイル名から取られます（`a`、`b`）。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [背後の実行対象](https://www.windmill.dev/docs/full_code_apps/backend_runnables) —— 背後のスクリプトを任意の言語で定義するすべての方法。
</div>

## 手順 4: 画面側を作る

では `App.tsx` を書き換えて、両方の実行対象を呼びます。自動生成される `wmill` module は新しい `b` を自動で拾うので、`backend.a()` と `backend.b()` をすぐに呼べます。

`App.tsx` の中身をこう入れ替えます。

```tsx
import React, { useState } from 'react'
import { backend } from './wmill'
import './index.css'

const App = () => {
    const [valueA, setValueA] = useState<string | undefined>(undefined)
    const [valueB, setValueB] = useState<string | undefined>(undefined)
    const [loadingA, setLoadingA] = useState(false)
    const [loadingB, setLoadingB] = useState(false)
    const [inputNumber, setInputNumber] = useState(42)

    async function runA() {
        setLoadingA(true)
        try {
            setValueA(await backend.a({ x: inputNumber }))
        } catch (e) {
            console.error('Error running a:', e)
        }
        setLoadingA(false)
    }

    async function runB() {
        setLoadingB(true)
        try {
            setValueB(await backend.b({ format: 'locale' }))
        } catch (e) {
            console.error('Error running b:', e)
        }
        setLoadingB(false)
    }

    async function runBoth() {
        setLoadingA(true)
        setLoadingB(true)
        try {
            const [resultA, resultB] = await Promise.all([
                backend.a({ x: inputNumber }),
                backend.b({ format: 'iso' })
            ])
            setValueA(resultA)
            setValueB(resultB)
        } catch (e) {
            console.error('Error running both:', e)
        }
        setLoadingA(false)
        setLoadingB(false)
    }

    return (
        <div className="container">
            <h1>Full-code app demo</h1>
            <p className="subtitle">Calling 2 backend runnables</p>

            <div className="input-section">
                <label>
                    Input number:
                    <input
                        type="number"
                        value={inputNumber}
                        onChange={(e) => setInputNumber(Number(e.target.value))}
                    />
                </label>
            </div>

            <div className="buttons">
                <button onClick={runA} disabled={loadingA}>
                    {loadingA ? 'Running...' : 'Multiply number'}
                </button>
                <button onClick={runB} disabled={loadingB}>
                    {loadingB ? 'Running...' : 'Get timestamp'}
                </button>
                <button onClick={runBoth} disabled={loadingA || loadingB} className="primary">
                    Run both
                </button>
            </div>

            <div className="results">
                <div className="result-card">
                    <h3>Multiply (TypeScript)</h3>
                    <div className="result-value">
                        {loadingA ? 'Loading...' : valueA ?? 'Click a button to see result'}
                    </div>
                </div>

                <div className="result-card">
                    <h3>Timestamp (Python)</h3>
                    <div className="result-value">
                        {loadingB ? 'Loading...' : valueB ?? 'Click a button to see result'}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App
```

いくつか気に留めておくこと。

- ボタンごとに別の実行対象を呼んでいます（`backend.a()` か `backend.b()`）
- **Run both** は `Promise.all` で両方を並行に呼びます —— それぞれが別々の Windmill の job として動きます
- `backend.b()` の `format` は、`backend.a()` の `x` と同じように引数として渡します
- `a` は Bun の worker で TypeScript を、`b` は Python を動かします —— 画面側はそれを気にしなくてよい

### 見た目を整える

`index.css` を入れ替えて、見た目を整えます。

```css
.container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

h1 {
    margin-bottom: 5px;
    color: #333;
}

.subtitle {
    color: #666;
    margin-top: 0;
    margin-bottom: 24px;
}

.input-section {
    margin-bottom: 20px;
}

.input-section label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
}

.input-section input {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
    width: 100px;
}

.buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 24px;
}

button {
    padding: 10px 18px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: white;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
}

button:hover:not(:disabled) {
    background: #f5f5f5;
    border-color: #ccc;
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

button.primary {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
}

button.primary:hover:not(:disabled) {
    background: #2563eb;
}

.results {
    display: grid;
    gap: 16px;
}

.result-card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    background: #fafafa;
}

.result-card h3 {
    margin: 0 0 10px 0;
    font-size: 14px;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.result-value {
    font-size: 16px;
    color: #333;
    font-family: 'Monaco', 'Menlo', monospace;
    word-break: break-all;
}
```

結果は App.tsx の画面右側の下見で見られます（UI エディタで「下見（Preview）」を押せば全画面、CLI なら `http://localhost:4000`）。ボタンを 1 つずつ押してみて、そのあと「Run both」で並行に動くところを見てください。

![書き換えた App.tsx](./updated_tsx.png 'Updated App.tsx')

![index.css](./index_css.png 'Index CSS')

:::info Svelte
React ではなく Svelte 5 を選んだ場合も、やり方は同じです。`./wmill` から `backend` を読み込み、反応の仕組みには Svelte の `$state` と `$effect` を使います。Svelte の例は[画面側の参照](../../full_code_apps/3_frontend/index.mdx)にあります。
:::

### 背後の呼び出しの仕組み

`backend.a()` や `backend.b()` の呼び出しは、どれも本物の Windmill の job の実行です。

- `backend.xxx(args)` —— 実行対象を呼び、結果を待つ（同期）
- `backendAsync.xxx(args)` —— 実行対象を起こし、job の id をすぐ返す（長くかかる処理向け）
- `waitJob(jobId)` —— 非同期の job が終わるのを待つ

<div className="grid grid-cols-2 gap-6 mb-4">
	- [画面側](https://www.windmill.dev/docs/full_code_apps/frontend) —— React／Svelte の対応と wmill.ts の API 参照。
</div>

## 手順 5: データテーブルで残す

ここまでの実行対象は、値をその場で計算するだけでした。フルコードのアプリは Windmill の[データテーブル](../../core_concepts/11_persistent_storage/data_tables.mdx)（組み込みの保存の層）を読み書きすることもできます。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [データテーブル](https://www.windmill.dev/docs/full_code_apps/data_tables) —— アプリから Windmill のデータテーブルを許可し、問い合わせる。
</div>

### データベースを用意する

まず、ワークスペースにデータベースが設定されていることを確かめます。**ワークスペースの設定（Workspace settings）** > **データテーブル（Data Tables）** で接続を設定してください（使えるなら[インスタンス専用のデータベース](../../core_concepts/53_custom_instance_database/index.mdx)でもかまいません）。

![テーブルを作る](./create_table.png 'Create table')

### アプリにテーブルを足す

raw app のエディタで、左の枠の **データ（Data）** の節を開き、`+` をクリックします。既にあるテーブル（公開のものか、他のアプリのもの）を選ぶことも、このアプリ用に新しく作ることもできます。

ここでは新しく作ります。

1. データの節で `+` をクリック
2. **新しいテーブルを作る（Create new table）** を選ぶ
3. 名前を `computation_logs` にする
4. 列を決める
   - `id` — `BIGSERIAL`（主キー。既定で付く）
   - `input` — `INT`
   - `result` — `TEXT`
   - `created_at` — `TIMESTAMP`、既定値は `now()`
5. **テーブルを作る（Create table）** をクリック

![テーブルの列を作る](./create_table_2.png 'Create table columns')

これでテーブルがこのアプリに許可されました。スキーマと中身はデータの節から見られます。

### SQL の実行対象を足す

次に、このテーブルに問い合わせる実行対象を作ります。実行対象のパネルで `+` をクリックし、言語に **PostgreSQL** を選びます。名前は `get_logs` にします。

データベースのリソースには、ワークスペースのデータテーブルの設定で選んだものと同じリソースを指定します。

```sql
-- backend/get_logs.pg.sql
SELECT * FROM app_demo.computation_logs ORDER BY created_at DESC LIMIT 10;
```

![get_logs の実行対象](./get_logs.png 'Get logs runnable')

画面側からは、他の実行対象と同じように呼びます。

```typescript
const logs = await backend.get_logs();
```

画面側のコードは、実行対象が TypeScript なのか Python なのか SQL なのかを知る必要がありません。`wmill` module がすべて同じ形で扱います。

:::tip CLI
手元のファイルでは、`.pg.sql` という拡張子が「PostgreSQL の問い合わせとして実行せよ」という指示になります。他の SQL の方言にも対応しています（MySQL なら `.my.sql`、BigQuery なら `.bq.sql` など）。すべての一覧は[背後の実行対象](../../full_code_apps/2_backend_runnables/index.mdx)の参照にあります。
:::

<div className="grid grid-cols-2 gap-6 mb-4">
	- [データテーブル](https://www.windmill.dev/docs/full_code_apps/data_tables) —— アプリから Windmill のデータテーブルを許可し、問い合わせる。
	- [データテーブル（中核の考え方）](https://www.windmill.dev/docs/core_concepts/persistent_storage/data_tables) —— ほとんど準備なしに、関係のあるデータを保存し問い合わせる。
</div>

## 手順 6: 配備する

### UI エディタから

ツールバーの **配備（Deploy）** ボタンをクリックします。配備のたびに新しい版ができます。

![配備する](./deploy.png 'Deploy')

![配備されたアプリ](./deployed_app.png 'Deployed app')

### CLI から

実行対象の lockfile を作り、送ります。

```bash
wmill generate-metadata
wmill sync push
```

### 誰でも見られるようにする

ログインなしでアプリを開けるようにするには、`raw_app.yaml` に `public: true` を足します。

```yaml
summary: "Full-code app demo"
public: true
```

管理者なら、URL の道筋を自分で決めることもできます。

```yaml
custom_path: "my-demo"
```

そのアプリは `https://<instance>/apps/custom/my-demo` で開けるようになります。

<div className="grid grid-cols-2 gap-6 mb-4">
	- [配備](https://www.windmill.dev/docs/full_code_apps/deployment) —— 配備し、公開の可否と URL の道筋を設定する。
</div>

## 実行対象の設定

ここまでは、コードだけの実行対象（`backend/` にファイルが 1 つあるだけ）を使ってきました。もっと細かく決めたいときは、コードの隣に `.yaml` の設定ファイルを置いて、入力をあらかじめ埋められます。

```yaml
# backend/a.yaml
type: inline
fields:
  x:
    type: static
    value: 100
```

こうすると `x` があらかじめ埋まるので、画面側から渡す必要がなくなります。その場にコードを書く代わりに、ワークスペースにある[スクリプト](../../script_editor/index.mdx)や[フロー](../../flows/1_flow_editor.mdx)を指すこともできます。

```yaml
# backend/send_notification.yaml
type: script
path: f/production/send_slack_notification
```

<div className="grid grid-cols-2 gap-6 mb-4">
	- [背後の実行対象](https://www.windmill.dev/docs/full_code_apps/backend_runnables) —— 実行対象のすべての種類、YAML の設定、対応する言語。
</div>

## 次にすること

これで、自分で書いた React の画面から複数の実行対象を呼ぶ、動くフルコードのアプリができました。ここからは、

- 任意の言語で[背後の実行対象](../../full_code_apps/2_backend_runnables/index.mdx)を足す（Python、SQL、Go など）
- CSS や Tailwind、好きな React のライブラリで見た目を作る
- 複数人で進めるために [git sync による CI/CD](../../advanced/11_git_sync/index.mdx) を用意する
- [Windmill AI](../../core_concepts/22_ai_generation/index.mdx) で、指示からアプリを作らせる

<div className="grid grid-cols-2 gap-6 mb-4">
	- [フルコードのアプリ](../../full_code_apps/index.mdx) —— フルコードのアプリの完全な参照。
	- [画面側](https://www.windmill.dev/docs/full_code_apps/frontend) —— React／Svelte の対応と wmill.ts の API。
	- [UI エディタ](https://www.windmill.dev/docs/full_code_apps/ui_editor) —— ブラウザでフルコードのアプリを編集する。
	- [CLI での進め方](https://www.windmill.dev/docs/full_code_apps/cli_workflow) —— 端末から雛形を作り、開発し、配備する。
</div>
