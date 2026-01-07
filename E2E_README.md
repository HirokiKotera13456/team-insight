# README Part2 - 動作確認 / E2Eテスト（Playwright）

このドキュメントはアプリが仕様通り動くことを第三者が確認できるようにするための手順です。

---

## 1. 前提

- Node.js: (例) 20+
- パッケージマネージャ: npm
- Firebase プロジェクト 

---

## 2. テスト（チェックリスト）

### A. 認証（Googleログイン）
- [ ] 未ログイン状態で `/app` にアクセスすると `/login` にリダイレクトされる
- [ ] `/login` から Googleログインできる
- [ ] ログイン後 `/app` に遷移する
- [ ] ログアウトできる
- [ ] ログアウト後 `/app` にアクセスすると `/login` に戻る

### B. 診断（/app/assessment）
- [ ] 12問が表示される（4軸×3問）
- [ ] 各質問でスライダーを動かせる（初期値50）
- [ ] 保存ボタン押下で保存中表示になる（disabled + spinner）
- [ ] 保存成功で `/app/result` に遷移する

### C. 結果（/app/result）
- [ ] 4軸スコアが表示される
- [ ] スコア帯に応じたコメントが表示される（左寄り/中間/右寄り）
- [ ] 未回答の場合は「診断を開始」導線が表示される

### D. Firestore
- [ ] `users/{uid}` が作成/更新される
- [ ] `users/{uid}/axis_scores/latest` が作成/更新される
- [ ] 自分以外のユーザーデータへアクセスできない（Security Rules）

---

## 3. E2Eテスト（Playwright）

### 方針
本番は Google認証だが、E2Eでは安定性のため
Firebase Auth Emulator を用いてテスト用ログインを行う。

---

## 4. セットアップ

### 4.1 Playwright インストール
```bash
npx playwright install
