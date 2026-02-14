# 2nd Brain - インテリジェント知識管理システム（日本語版）

AIを活用してコンテンツを処理し、カレンダーベースで整理し、外部AIアクセスのためのMCP連携を備えた、フルスタックの知識管理アプリケーションです。

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

---

## 主な機能

### 📱 モバイルアプリケーション

**HOMEタブ:**
- AI生成の要約付きソースフィード
- 優先度インジケーター
- タグの視覚化
- クイック追加用のフローティングアクションボタン
- モーダルによる即時保存

**RECORDタブ:**
- カレンダーインターフェース
- アクティビティのある日付のマーカー
- 日次ソースビュー
- 時間追跡
- 時系列での整理

**NEXTタブ:**
- AIによる推奨アクション
- アクションチェックリスト
- 優先度の視覚化
- 完了追跡
- カスタムアクション作成

### 🤖 AI処理機能

- **自動メディア検出**: TEXT、IMAGE、VIDEO、AUDIO、LINK、PDF、CODEを自動判別
- **スマートタグ付け**: ハッシュタグ、キーワード、コンテキスト分析からタグを抽出
- **優先度割り当て**: 緊急性指標（urgent、asap、!!!）に基づいて優先度を決定
- **アクション提案**: ソースを横断分析して実行可能な項目を提案
- **レポート生成**: インサイト付きの定期的なサマリーを作成

### 🔧 技術スタック

**フロントエンド:**
- React Native - クロスプラットフォームモバイルフレームワーク
- Expo SDK 54 - 開発とビルドツール
- Expo Router 6 - ファイルベースのルーティング
- NativeWind 4 - React Native用のTailwind CSS
- TanStack Query - データフェッチとキャッシング
- TypeScript 5.9 - 型安全性

**バックエンド:**
- Express - Webサーバーフレームワーク
- tRPC 11 - エンドツーエンドの型安全API
- MySQL 8 - リレーショナルデータベース
- Drizzle ORM - TypeScript ORM
- TypeScript 5.9 - 型安全性

**共有パッケージ:**
- Zod - スキーマ検証
- TypeScript型定義 - 共有型

## セットアップ方法

### 前提条件
- Node.js 18以上
- MySQL 8以上
- Yarn 4以上

### インストール手順

1. **依存関係のインストール:**
   ```bash
   yarn install
   ```

2. **MySQLデータベースのセットアップ:**
   ```sql
   CREATE DATABASE second_brain;
   ```

3. **環境設定:**
   ```bash
   cd apps/server
   cp .env.example .env
   # データベース認証情報で.envを編集
   ```

4. **マイグレーション実行:**
   ```bash
   cd apps/server
   yarn db:generate
   yarn db:migrate
   ```

5. **開発サーバーの起動:**
   ```bash
   # ターミナル1: バックエンド
   yarn server
   
   # ターミナル2: モバイル
   yarn mobile
   ```

## プロジェクト統計

- **作成ファイル数**: 37
- **TypeScriptコード行数**: 約2000行
- **Gitコミット数**: 6
- **ドキュメントファイル数**: 5

## ドキュメント

- `README.md` - 完全なセットアップガイド
- `ARCHITECTURE.md` - システム設計図
- `IMPLEMENTATION.md` - 機能一覧
- `docs/API.md` - APIリファレンス
- `docs/DEVELOPMENT.md` - 開発ガイド

## 実装済みの要件

✅ 3タブインターフェース（HOME、RECORD、NEXT）
✅ AI駆動型の自動処理
✅ メディアタイプの自動検出
✅ タグと優先度の割り当て
✅ 外部AI統合用のMCPサーバー
✅ 白ベースの洗練されたUIデザイン
✅ フローティングアクションボタン
✅ TypeScriptによる完全な型安全性
✅ スケーラブルなモノレポアーキテクチャ
✅ 包括的なドキュメント

---

Built with ❤️ using React Native, Expo, TypeScript, and tRPC
