
# モンスターと戦うカードゲーム

このプロジェクトは、React（Next.js）と React DnD を使って構築されたシンプルなカードバトルゲームです。プレイヤーは手札からカードをドラッグしてモンスターに攻撃、回復、またはカードをドローすることができます。

## 特徴

- ドラッグ & ドロップによる直感的なインターフェース
- プレイヤーHP・モンスターHPの視覚的表示
- 攻撃・回復・ドローの3種類のカード
- カードを使ってモンスターとバトル
- 状態の初期化と再挑戦機能

## 使用技術

- [Next.js](https://nextjs.org/)（App Router 使用）
- [React DnD](https://react-dnd.github.io/react-dnd/about)
- TypeScript
- CSS（`styles.css`）

## デモ画面

![タイトル画面](./public/images/demo-title.png)  
![バトル画面](./public/images/demo-battle.png)

※ `public/images/` ディレクトリに画像ファイルを配置してください。

## 起動方法

1. このリポジトリをクローンします:

```bash
git clone https://github.com/your-username/monster-card-game.git
cd monster-card-game
```

2. 依存関係をインストールします:

```bash
npm install
```

3. 開発サーバーを起動します:

```bash
npm run dev
```

4. ブラウザで `http://localhost:3000` を開いてゲームを開始してください。

## ファイル構成

- `page.tsx`: ゲームのロジックとUIを定義
- `styles.css`: ゲームのスタイリング
- `public/images/`: モンスターとカードの画像を格納するディレクトリ

## TODO / 今後実装したいこと

- モンスターのAI追加（反撃機能など）
- スコア機能の実装
- モンスター・カードの種類追加
- モバイル対応

## ライセンス

MIT License
