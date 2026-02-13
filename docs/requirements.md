# 2nd Brain — 統合要件定義書 v1.0

## 1. 概要

2nd Brainは、ユーザーの「第2の脳」として機能する**知的ログ拡張アプリ**です。単なるメモアプリではなく、知的ログをナレッジへ変換し、思考を拡張し、次の行動を提案する知的基盤として設計されます。

### 1.1 コアコンセプト

- **SOURCE**: あらゆる形式のインプット（メモ、思考、リンク、X投稿、画像、音声、動画、PDF、ファイル）を1つのフォーマットで保存
- **NEXT**: AIが提案する次の行動・アイデア
- **HIGHLIGHT**: 日次・週次・月次のナレッジサマリー

## 2. 技術スタック

| レイヤー | 技術 |
|---------|------|
| フレームワーク | React Native + Expo SDK 54 |
| 言語 | TypeScript 5.9 |
| ルーティング | Expo Router |
| スタイリング | NativeWind (Tailwind CSS) |
| 状態管理 | React Context + TanStack Query |
| バックエンド | Express + tRPC |
| データベース | MySQL (Drizzle ORM) |
| 通知 | expo-notifications（ローカル通知） |

## 3. データベーススキーマ

### 3.1 sources テーブル

| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID | 主キー |
| content | TEXT | テキスト内容 |
| mediaType | ENUM | text_memo, thought, link, x_post, image, audio, video, pdf, markdown, file |
| url | VARCHAR(2048) | URL（リンク・Xポストの場合） |
| filePath | VARCHAR(1024) | ファイルパス（メディアファイルの場合） |
| category | VARCHAR(255) | AI自動分類ジャンル |
| project | VARCHAR(255) | 関連プロジェクト名 |
| priority | ENUM | urgent, high, medium, low |
| aiTags | JSON | AIが生成したタグ配列 |
| summary | TEXT | AI生成の要約 |
| status | ENUM | unprocessed, processed, archived |
| createdAt | TIMESTAMP | 作成日時 |
| updatedAt | TIMESTAMP | 更新日時 |

### 3.2 highlights テーブル

| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID | 主キー |
| date | TIMESTAMP | 対象日付 |
| period | ENUM | daily, weekly, monthly |
| content | JSON | ハイライト内容 |
| totalSources | INT | その期間のSOURCE数 |
| categorySummary | JSON | カテゴリ別サマリー |
| createdAt | TIMESTAMP | 作成日時 |

### 3.3 next_actions テーブル

| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID | 主キー |
| title | VARCHAR(500) | アクションタイトル |
| description | TEXT | 詳細説明 |
| reason | TEXT | AI提案理由 |
| category | ENUM | information_gathering, learning, execution, reflection |
| priority | ENUM | high, medium, low |
| relatedSourceIds | JSON | 関連SOURCE ID群 |
| status | ENUM | pending, completed, dismissed |
| createdAt | TIMESTAMP | 作成日時 |

### 3.4 chat_messages テーブル

| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID | 主キー |
| role | ENUM | user, assistant |
| content | TEXT | メッセージ内容 |
| createdAt | TIMESTAMP | 作成日時 |

## 4. API仕様

### 4.1 tRPC API

#### sources ルーター

- `sources.create` - SOURCE作成
- `sources.getAll` - SOURCE一覧取得（フィルタリング・ソート対応）
- `sources.getById` - 特定SOURCE取得
- `sources.getByDate` - 日付指定でSOURCE取得
- `sources.update` - SOURCE更新
- `sources.delete` - SOURCE削除
- `sources.getStats` - 統計情報取得

#### highlights ルーター

- `highlights.getByDate` - 特定日のハイライト取得
- `highlights.getByPeriod` - 期間指定でハイライト取得
- `highlights.generate` - ハイライト手動生成

#### nextActions ルーター

- `nextActions.getAll` - NEXTアクション一覧取得
- `nextActions.getHighlight` - 最重要NEXTアクション取得
- `nextActions.updateStatus` - ステータス更新
- `nextActions.generate` - NEXTアクション生成

#### chat ルーター

- `chat.send` - メッセージ送信・AI応答取得
- `chat.getHistory` - 会話履歴取得

### 4.2 MCP REST API

- `GET /api/mcp/sources` - SOURCE一覧
- `GET /api/mcp/sources/:id` - SOURCE詳細
- `GET /api/mcp/highlights` - ハイライト取得
- `GET /api/mcp/next-actions` - NEXTアクション一覧
- `GET /api/mcp/projects` - プロジェクト一覧
- `GET /api/mcp/interests` - 興味領域マップ
- `POST /api/mcp/search` - セマンティック検索
- `POST /api/mcp/chat` - コンテキスト付きAI対話

## 5. 画面設計

### 5.1 HOME画面

- 今日のハイライトブロック
- NEXTアクションプレビュー（上位2-3件）
- 統計セクション（今日のSOURCE数、合計SOURCE数、タイプ別内訳）
- フローティング「+」ボタン

### 5.2 RECORD画面

- 月間カレンダー表示
- SOURCEが記録された日にドットインジケーター
- 日付タップで詳細展開

### 5.3 NEXT画面

- NEXTハイライトブロック（最重要アクション）
- NEXTアクション詳細リスト

### 5.4 AI対話画面

- チャット形式UI
- メッセージ入力・送信
- 会話履歴表示

## 6. デザインシステム

### 6.1 カラーパレット

```
background: #FFFFFF
foreground: #0A0A0A
muted: #6B7280
primary: #0A0A0A
surface: #F8F8F8
border: #E8E8E8
success: #22C55E
warning: #F59E0B
error: #EF4444
```

### 6.2 スタイルガイド

- カード/ブロック: 角丸16px、パディング14px、ボーダー1px
- フォント: システムフォント、ヘッダーBold、本文Regular
- 行間: 1.4〜1.6倍

### 6.3 インタラクション

- ボタンタップ: スケール0.97 + ハプティクス（Light）
- カードタップ: オパシティ0.7
- 保存成功: 成功バッジ + ハプティクス（Success）

## 7. AI処理パイプライン

### 7.1 SOURCE保存時の処理

1. 内容読み取り（テキスト抽出）
2. 要約生成
3. ジャンル自動分類
4. タグ自動生成
5. 優先度判定

### 7.2 実装状況

現在はモック実装。将来的にLLM APIに差し替え可能な構造。

## 8. 通知設定

- 日次レポート通知: 毎日 21:00
- 週次レポート通知: 毎週日曜 10:00
- 月次レポート通知: 毎月28日 10:00

## 9. セキュリティ

- 環境変数による設定管理
- データベース接続情報の保護
- 入力値のバリデーション

## 10. 今後の拡張予定

- 実際のLLM統合（OpenAI API等）
- ベクトル検索によるセマンティック検索
- 画像・音声・動画からのテキスト抽出
- クラウド同期機能
- Webアプリ版の提供
