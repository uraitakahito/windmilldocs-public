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

**原文の隣に `.ja.md` として置く。**

```
docs/getting_started/index.mdx      原文 (本家のまま、触らない)
docs/getting_started/index.ja.md    訳
```

別ツリーにすると 904 件の画像参照と 4135 件のリンクが壊れるため。同じ
ディレクトリなら、どちらもそのまま動く。

**上流の merge で衝突しない。** 本家は `.ja.md` を触らないので、`git merge main`
では英語だけが更新される。

## 原文が動いたとき、どこを訳し直すか

```sh
# 前回追随した時点から、原文がどう変わったか
git diff <前の main の commit>..main -- docs/

# 訳が古くなったページを名指しする (原文が新しいものだけ)
for f in $(git diff --name-only <前>..main -- docs/ | grep -E '\.mdx?$'); do
  ja="${f%.*}.ja.md"
  [ -f "$ja" ] && echo "要更新: $ja"
done
```

**訳と原文のずれは、この差分でしか分からない。** 目次 (`docs/INDEX.ja.md`) は
「訳済みか骨組みか」しか区別しないので、**古い訳は「訳済み」に見える**。
