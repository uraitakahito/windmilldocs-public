# 本家追随の手順 (uraitakahito/windmilldocs-public)

## 原則

- `upstream → main → develop` の**一方向のみ**。
- `main` は本家 mirror。**訳もビルド設定も commit しない**。
- `develop → main` の逆流 (PR / merge) は**しない**。
- 訳とビルド設定は `develop` に積む。**こちらを既定ブランチにする。**

`uraitakahito/specs` と違い、`main` を fork へ push してよい —— 本家に `.github` が
無いので、継承した workflow が英語を publish して日本語版を上書きする心配がない。

## 上流が動いたかの目印

`.source-sha` に、mirror が生成された元 (本家の private repo) の commit が入っている。

```sh
git -C . show main:.source-sha
```

mirror は private 側から定期的に再生成されるので、この値が変わったら追随する。

## 手順

```sh
# 1. main を本家へ追随 (無編集なので fast-forward)
git remote add upstream https://github.com/windmill-labs/windmilldocs-public.git  # 初回のみ
git fetch upstream
git checkout main && git merge --ff-only upstream/main && git push origin main

# 2. develop に取り込む
git checkout develop && git merge main

# 3. 訳し直しが要る範囲を出す
git diff <前の .source-sha 時点の main>..main -- docs/
```

3 が肝。**訳した本文と原文がずれていないか**は、この差分でしか分からない。

## 訳の置き場所

```
docs/                                            英語 (本家のまま、触らない)
i18n/ja/docusaurus-plugin-content-docs/current/  訳したものだけ
```

Docusaurus の i18n は**訳が無いページを英語に落とす**ので、401 本のうち数本だけ
訳した状態が正常。`crawler/` の docs-site と違い、en/ja の 1:1 は要求されない。
