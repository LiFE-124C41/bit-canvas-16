# Bit Canvas 16

16x16のドット絵を描画し、0と1のマップとして出力するWebアプリケーションです。マイコンやレトロゲーム向けのグラフィックデータの作成等に利用できます。

## 特徴

- **16x16 グリッド**: ドット絵の描画にシンプルなキャンバス
- **ドラッグ描画**: クリックしたままなぞることで、連続してドットを配置/消去できます
- **プレーンテキストエクスポート**: 描画した結果をすぐにクリップボードへコピー可能な `0` / `1` のマップテキスト(16x16)として出力
- **自動保存**: ブラウザをリロードしても、直前の描画状態が `localStorage` によって復元されます
- **モダンデザイン**: グラスモーフィズムとダークモードを利用した、高品質なUI

## アーキテクチャ

本プロジェクトは **Clean Architecture** の考え方に沿い、React等のフレームワークからドメインロジックを分離しています。

- `src/domain`: `PixelMap` エンティティとリポジトリのインターフェース
- `src/usecase`: ピクセル反転や初期化を管理するUseCase
- `src/infrastructure`: `localStorage` を用いたデータの永続化(Repository)
- `src/presentation`: UI層からユースケースを呼び出すカスタムフック (`useCanvasController`)
- `src/ui`: React コンポーネント群

## 開発環境のセットアップ

```bash
npm install
npm run dev
```

## テストの実行

ドメインモデルおよびユースケースの単体テスト（Vitest）を実行します。

```bash
npm run test
```

## デプロイ

本プロジェクトは GitHub Actions を利用して GitHub Pages へ自動デプロイされるよう設定されています。

1. **GitHub リポジトリ設定**:
   - リポジトリの `Settings` > `Pages` に移動します。
   - `Build and deployment` > `Source` を **GitHub Actions** に変更します。
2. **公開**:
   - `main` ブランチにプッシュすると自動的にビルドとデプロイが開始されます。
   - 公開URLはリポジトリの Settings > Pages で確認できます。
