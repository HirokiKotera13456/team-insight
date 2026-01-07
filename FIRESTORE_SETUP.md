# Firestore Security Rules セットアップ

## 問題: Firestoreへの保存が失敗する場合

Firestoreへの保存が失敗する場合、主な原因は**Security Rulesがデプロイされていない**ことです。

## 解決方法

### 方法1: Firebase Consoleから手動でデプロイ

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. プロジェクト `personal-insight-2d2fe` を選択
3. 左メニューから「Firestore Database」を選択
4. 「ルール」タブをクリック
5. `firestore.rules` の内容をコピーして貼り付け
6. 「公開」ボタンをクリック

### 方法2: Firebase CLIを使用（推奨）

```bash
# Firebase CLIをインストール（未インストールの場合）
npm install -g firebase-tools

# Firebaseにログイン
firebase login

# プロジェクトを初期化（初回のみ）
firebase init firestore

# ルールをデプロイ
firebase deploy --only firestore:rules
```

## 確認方法

Firebase Consoleの「Firestore Database」→「ルール」タブで、以下のルールが表示されていることを確認してください：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
      
      match /axis_scores/{scoreId} {
        allow read, write: if request.auth != null && request.auth.uid == uid;
      }
    }
  }
}
```

## トラブルシューティング

### エラー: "permission-denied"

- Security Rulesが正しくデプロイされているか確認
- ログインしているユーザーのUIDと、保存しようとしているドキュメントのUIDが一致しているか確認

### エラー: "unavailable"

- ネットワーク接続を確認
- Firebaseプロジェクトが有効になっているか確認

### その他のエラー

ブラウザのコンソール（F12）でエラーメッセージを確認し、詳細を確認してください。
