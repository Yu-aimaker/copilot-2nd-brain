# 2nd Brain — 知的ログ拡張アプリ

<div align="center">

**あなたの「第2の脳」として、思考を拡張し、知識を繋げ、次の行動を提案する知的基盤**

</div>

---

## 📖 概要

2nd Brainは、あらゆる形式のインプット（メモ、思考、リンク、X投稿、画像、動画、音声、PDF、ファイル）を統合管理し、AIの力で自動的にナレッジ化する知的ログ拡張アプリです。

### 特徴

- 📝 **SOURCE**: あらゆる形式のインプットを1つのフォーマットで保存
- 🎯 **NEXT**: AIが提案する次の行動・アイデア
- ⭐ **HIGHLIGHT**: 日次・週次・月次のナレッジサマリー
- 🤖 **AI統合**: 自動分類、タグ生成、要約、優先度判定
- 📱 **クロスプラットフォーム**: iOS、Android、Webに対応

---

## 🛠 技術スタック

| レイヤー | 技術 |
|---------|------|
| フレームワーク | React Native + Expo SDK 54 |
| 言語 | TypeScript 5.9 |
| ルーティング | Expo Router |
| スタイリング | NativeWind (Tailwind CSS) |
| 状態管理 | React Context + TanStack Query |
| バックエンド | Express + tRPC |
| データベース | MySQL + Drizzle ORM |
| 通知 | expo-notifications |
| MCP Server | Model Context Protocol |

---

## 📁 プロジェクト構成

```
copilot-2nd-brain/
├── apps/
│   ├── mobile/              # モバイルアプリ（Expo + React Native）
│   │   ├── app/            # Expo Router画面
│   │   │   ├── (tabs)/    # タブ画面（HOME, RECORD, NEXT）
│   │   │   └── chat.tsx   # AI対話画面
│   │   ├── components/    # 共通コンポーネント
│   │   └── lib/           # ユーティリティ・設定
│   ├── server/            # バックエンドサーバー
│   │   ├── src/
│   │   │   ├── db/       # データベース（Drizzle ORM）
│   │   │   ├── trpc/     # tRPC ルーター
│   │   │   ├── ai/       # AI処理パイプライン
│   │   │   └── mcp/      # MCP REST API
│   └── mcp-server/        # MCPサーバー
├── packages/
│   └── shared/            # 共通型定義
└── docs/                  # ドキュメント
```

---

## 🚀 セットアップ

### 前提条件

- Node.js 18以上
- MySQL 8.0以上
- npm または yarn

### 1. リポジトリのクローン

```bash
git clone https://github.com/Yu-aimaker/copilot-2nd-brain.git
cd copilot-2nd-brain
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

```bash
cd apps/server
cp .env.example .env
```

`.env`ファイルを編集してデータベース接続情報を設定:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=secondbrain
PORT=3000
```

### 4. データベースのセットアップ

```bash
# MySQLデータベースを作成
mysql -u root -p -e "CREATE DATABASE secondbrain;"

# マイグレーションの生成
npm run db:generate

# マイグレーションの実行
npm run db:migrate
```

### 5. サーバーの起動

```bash
# バックエンドサーバー
npm run dev:server

# 別のターミナルでモバイルアプリ
npm run dev:mobile
```

---

## 📱 モバイルアプリの実行

### iOS

```bash
cd apps/mobile
npm run ios
```

### Android

```bash
cd apps/mobile
npm run android
```

### Web

```bash
cd apps/mobile
npm run web
```

---

## 🎨 デザインシステム

### カラーパレット

- **Background**: `#FFFFFF` - 白ベース
- **Foreground**: `#0A0A0A` - 黒文字
- **Muted**: `#6B7280` - グレー
- **Primary**: `#0A0A0A` - プライマリカラー
- **Surface**: `#F8F8F8` - カード背景
- **Border**: `#E8E8E8` - ボーダー
- **Success**: `#22C55E` - 成功
- **Warning**: `#F59E0B` - 警告
- **Error**: `#EF4444` - エラー

### スタイルガイド

- カード/ブロック: 角丸16px、パディング14px
- フォント: システムフォント、ヘッダーBold、本文Regular
- 行間: 1.4〜1.6倍

---

## 🔌 API仕様

### tRPC API

- **sources**: SOURCE管理（作成、取得、更新、削除、統計）
- **highlights**: ハイライト取得・生成
- **nextActions**: NEXTアクション管理
- **chat**: AI対話

### MCP REST API

- `GET /api/mcp/sources` - SOURCE一覧
- `GET /api/mcp/highlights` - ハイライト取得
- `GET /api/mcp/next-actions` - NEXTアクション一覧
- `POST /api/mcp/search` - セマンティック検索
- `POST /api/mcp/chat` - AI対話

詳細は [docs/requirements.md](./docs/requirements.md) を参照してください。

---

## 🤖 AI機能

現在はモック実装ですが、以下の機能が実装されています:

- 自動分類（カテゴリ判定）
- タグ自動生成
- 要約生成
- 優先度判定
- NEXTアクション提案

将来的にOpenAI API等の実際のLLMに差し替え可能な構造になっています。

---

## 📊 データベース構造

### 主要テーブル

- **sources**: すべてのSOURCEデータ
- **highlights**: 日次・週次・月次のハイライト
- **next_actions**: AIが提案するNEXTアクション
- **chat_messages**: AI対話履歴

詳細なスキーマは [docs/requirements.md](./docs/requirements.md) を参照してください。

---

## 🔔 通知機能

- **日次レポート**: 毎日 21:00
- **週次レポート**: 毎週日曜 10:00
- **月次レポート**: 毎月28日 10:00

---

## 🧪 開発コマンド

```bash
# サーバー開発モード
npm run dev:server

# モバイルアプリ開発モード
npm run dev:mobile

# MCPサーバー開発モード
npm run dev:mcp

# データベースマイグレーション生成
npm run db:generate

# データベースマイグレーション実行
npm run db:migrate

# Drizzle Studio（データベースGUI）
npm run db:studio
```

---

## 📝 ライセンス

MIT

---

## 🤝 コントリビューション

Issue、Pull Requestをお待ちしています！

---

## 📧 お問い合わせ

プロジェクトに関する質問や提案がありましたら、Issueを作成してください。
