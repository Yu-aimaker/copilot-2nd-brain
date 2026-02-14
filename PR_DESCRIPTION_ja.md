# Pull Request: 2nd Brainインテリジェント知識管理システムの実装

AI駆動型のコンテンツ処理、カレンダーベースの整理、外部AIアクセスのためのMCP連携を備えたフルスタック知識管理アプリケーション。

## アーキテクチャ

**モノレポ構造:**
- `apps/mobile` - React Native + Expo SDK 54、Expo Router 6、NativeWind 4
- `apps/server` - Express + tRPC 11、Drizzle ORM、MySQL 8
- `packages/shared` - TypeScript型定義、Zodバリデーションスキーマ

## バックエンド

**データベーススキーマ（Drizzle ORM）:**
- `sources` - AIが生成したメタデータ（要約、タグ、優先度、メディアタイプ）を持つユーザーコンテンツ
- `projects` - 組織的なグループ化
- `actions` - AIが提案したタスクと手動タスク
- `reports` - 定期的な分析レポート
- `tags` - 使用状況の追跡

**tRPC APIルート:**
- `sources.*` - 作成時にAI処理パイプラインを備えたCRUD操作
- `projects.*`、`actions.*`、`tags.*`、`reports.*` - 標準的なCRUD操作
- `actions.suggestActions` - ソースを横断参照して実行可能なインサイトを提供

**AIサービス:**
```typescript
// ソース作成時の自動処理
const result = await aiService.processSource(content);
// 返り値: { mediaType, summary, tags[], priority }

// メディアタイプ: TEXT、IMAGE、VIDEO、AUDIO、LINK、PDF、CODE
// 優先度: LOW、MEDIUM、HIGH、URGENT（緊急度の指標に基づく）
```

**MCPエンドポイント（REST）:**
- `GET /mcp/thinking-history` - フィルター付きの完全な履歴
- `POST /mcp/query` - メディアタイプ/優先度/プロジェクト/タグフィルターによる検索
- `GET /mcp/context` - AIアシスタント用の最近のコンテキスト

## モバイル

**3タブナビゲーション（Expo Router）:**
- **HOME** - ソースフィード、AI要約、クイックキャプチャ用のフローティングアクションボタン
- **RECORD** - 日次ソースリスト付きのカレンダービュー（react-native-calendars）
- **NEXT** - AIアクション提案 + 完了追跡機能付きの手動アクション管理

**型安全なtRPCクライアント:**
```typescript
const { data: sources } = trpc.sources.list.useQuery({ limit: 20 });
const createSource = trpc.sources.create.useMutation({
  onSuccess: () => refetch(),
});
```

## 型安全性

tRPCによるエンドツーエンドの型安全性 - バックエンドの型変更が自動的にフロントエンドに伝播します。Zodスキーマがすべてのapi入力を検証します。

## 実装メモ

- React Native StyleSheetの互換性を修正（`gap`を`marginRight`に置き換え）
- 日付範囲フィルター用のMCPルート変数スコープを修正
- TypeScriptモジュール解決: サーバーはNode16（CommonJS）、モバイルはBundler（ESNext）
