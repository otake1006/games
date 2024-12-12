"use client";

import { useState } from "react";
import Image from "next/image";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// モンスターの型定義
type Monster = {
  id: number;
  name: string;
  hp: number;
  maxHp: number;
};

// カードの種類を定義
type attackCard = {
  id: number;
  type: "attack";
  name: string;
  power: number;
};

type drawCard = {
  id: number;
  type: "draw";
  name: string;
  draw: number;
};

type healCard = {
  id: number;
  type: "heal";
  name: string;
  heal: number;
};

type Card = attackCard | drawCard | healCard;

// 初期のモンスター情報
const initialMonsters: Monster[] = [
  { id: 1, name: "フシギダネ", hp: 100, maxHp: 100 },
  { id: 2, name: "フシギソウ", hp: 80, maxHp: 80 },
  { id: 3, name: "フシギバナ", hp: 60, maxHp: 60 },
];

// カードデッキの定義
const seigi: attackCard[] = [
  { id: 1, type: "attack", name: "フシギダネ", power: 10 },
  { id: 2, type: "attack", name: "フシギソウ", power: 20 },
  { id: 3, type: "attack", name: "フシギバナ", power: 30 },
];

const drewseigi: drawCard[] = [
  { id: 10, type: "draw", name: "フシギダネ", draw: 1 },
  { id: 11, type: "draw", name: "フシギソウ", draw: 1 },
  { id: 12, type: "draw", name: "フシギバナ", draw: 1 },
];

const healseigi: healCard[] = [
  { id: 16, type: "heal", name: "フシギダネ", heal: 10 },
  { id: 17, type: "heal", name: "フシギソウ", heal: 10 },
  { id: 18, type: "heal", name: "フシギバナ", heal: 10 },
];

// デッキをシャッフルする関数
const shuffleDeck = (deck: Card[]) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // ランダムなインデックスを生成
    [deck[i], deck[j]] = [deck[j], deck[i]]; // 要素を入れ替え
  }
  return deck; // シャッフル後のデッキを返す
};

// メインコンポーネント
export default function Home() {
  const [isBattle, setIsBattle] = useState(false); // 戦闘画面かどうか
  const [monsters, setMonsters] = useState<Monster[]>(initialMonsters); // モンスター情報
  const [playerHp, setPlayerHp] = useState(100); // プレイヤーのHP
  const [deck, setDeck] = useState<Card[]>(shuffleDeck([...seigi, ...drewseigi, ...healseigi])); // カードデッキ
  const [hand, setHand] = useState<Card[]>([]); // プレイヤーの手札

  // 戦闘状態を初期化する関数
  const resetBattleState = () => {
    setMonsters(initialMonsters); // モンスターを初期化
    setPlayerHp(100); // プレイヤーHPを最大値に戻す
    setDeck(shuffleDeck([...seigi, ...drewseigi, ...healseigi])); // デッキを再シャッフル
    setHand([]); // 手札を空にする
  };

  // カードを引く関数（最大5枚まで）
  const drawCards = (drawAmount: number) => {
    const availableSpace = 5 - hand.length; // 手札に空きがある枚数を計算
    const cardsToDraw = Math.min(drawAmount, availableSpace, deck.length); // 引けるカード数を決定
    if (cardsToDraw > 0) {
      setHand([...hand, ...deck.slice(0, cardsToDraw)]); // 手札にカードを追加
      setDeck(deck.slice(cardsToDraw)); // デッキから引いたカードを削除
    }
  };

  // モンスターにダメージを与える関数
  const handleDamage = (monsterId: number, power: number) => {
    setMonsters((prevMonsters) =>
      prevMonsters.map((monster) =>
        monster.id === monsterId
          ? { ...monster, hp: Math.max(monster.hp - power, 0) } // HPが0未満にならないようにする
          : monster
      )
    );
  };

  // プレイヤーを回復させる関数
  const handleHeal = (healAmount: number) => {
    if (playerHp < 100) {
      setPlayerHp(Math.min(playerHp + healAmount, 100)); // プレイヤーHPが最大HPを超えないようにする
    }
  };

  // カードがドロップされた時の処理
  const handleDrop = (cardId: number) => {
    setHand((prevHand) => prevHand.filter((card) => card.id !== cardId)); // 手札からカードを削除
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <main>
        {isBattle ? (
          // 戦闘画面
          <>
            <div className="monster-container">
              {monsters.map((monster) => (
                <MonsterCard
                  key={monster.id}
                  monster={monster}
                  onDamage={(power) => handleDamage(monster.id, power)} // モンスターにダメージを与える関数
                  drawCards={drawCards} // カードを引く関数
                  handleHeal={handleHeal} // 回復カードを処理する関数
                />
              ))}
            </div>

            <div className="deck" onClick={() => drawCards(3)}>
              <p>Deck</p>
            </div>

            <div className="hand">
              {hand.map((card) => (
                <DraggableCard
                  key={card.id}
                  card={card}
                  onDrop={handleDrop}
                  drawCards={drawCards}
                />
              ))}
            </div>

            <div className="player-hp-container">
              <h2>Player HP: {playerHp} / 100</h2>
              <div className="hp-bar">
                <div
                  className="hp-bar-inner"
                  style={{
                    width: `${(playerHp / 100) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="button-container">
            <button className="close-btn" onClick={() => setIsBattle(false)}>
              Close
            </button>
            <button
              className="back-btn"
              onClick={() => {
                resetBattleState(); // 戦闘状態をリセット
                setIsBattle(false); // 戦闘を終了してタイトル画面に戻る
              }}
            >
              Back
            </button>
            </div>
          </>
        ) : (
          // タイトル画面
          <div className="title-screen">
            <h1>モンスターと戦うゲーム</h1>
            <button className="start-btn" onClick={() => setIsBattle(true)}>
              Start
            </button>
          </div>
        )}
      </main>

      <style jsx>
        {`
          main {
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 100vh;
            justify-content: center;
            background-color: #f0f0f0;
          }

          .title-screen {
            text-align: center;
          }

          .start-btn {
            padding: 10px 20px;
            font-size: 18px;
            cursor: pointer;
            background-color: #4caf50;
            color: white;
            border: none;
            border-radius: 5px;
          }

          .monster-container {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
          }

          .deck {
            background-color: #ccc;
            width: 100px;
            height: 140px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            border: 2px solid black;
            position: fixed;
            bottom: 10px;
            left: 10px;
          }

          .hand {
            display: flex;
            gap: 10px;
            margin-top: 20px;
          }

          .player-hp-container {
             position: fixed;
             bottom: 10px; /* 画面の下部に配置 */
             left: 50%; /* 横中央 */
             transform: translateX(-50%); /* 中央揃え */
             width: 300px; /* 必要に応じて幅を調整 */
             text-align: center;
             background-color: #fff; /* 背景色を追加して視認性を向上 */
             border: 1px solid #ccc; /* 境界線を追加 */
             border-radius: 10px; /* 角丸 */
             padding: 10px; /* 内側余白 */
             box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 少し影をつける */
           }

          .hp-bar {
           width: 100%; /* 親要素に合わせる */
           height: 20px;
           background-color: #ccc;
           border-radius: 10px;
           margin-top: 10px;
           }

          .hp-bar-inner {
           height: 100%;
           background-color: #4caf50;
          transition: width 0.3s ease;
           }

               .button-container {
                  position: fixed;
                  top: 10px; /* 画面の上部 */
                  right: 10px; /* 画面の右側 */
                  display: flex;
                  gap: 10px; /* ボタンの間隔 */
                }

                .close-btn,
                .back-btn {
                  padding: 10px;
                  background-color: red;
                  color: white;
                  border: none;
                  border-radius: 5px;
                  cursor: pointer;
                }

                .close-btn:hover,
                .back-btn:hover {
                  background-color: darkred;
                }
        `}
      </style>
    </DndProvider>
  );
}

// モンスターカードのコンポーネント
function MonsterCard({
  monster,
  onDamage,
  drawCards,
  handleHeal,
}: {
  monster: Monster;
  onDamage: (power: number) => void;
  drawCards: (drawAmount: number) => void;
  handleHeal: (healAmount: number) => void;
}) {
  const [, drop] = useDrop({
    accept: "CARD", // ドロップできるカードのタイプを指定
    drop: (item: Card) => {
      if (item.type === "attack") {
        onDamage(item.power);
      } else if (item.type === "draw") {
        drawCards(item.draw);
      } else if (item.type === "heal") {
        handleHeal(item.heal);
      }
    },
  });

  return (
    <div ref={drop} className="monster">
      <Image
        src={`/images/${monster.id}.png`}
        width={80}
        height={80}
        alt={monster.name}
      />
      <h2>{monster.name}</h2>
      <p>
        HP: {monster.hp} / {monster.maxHp}
      </p>
      <div className="hp-bar">
        <div
          className="hp-bar-inner"
          style={{
            transform: `scaleX(${monster.hp / monster.maxHp})`,
          }}
        ></div>
      </div>

      <style jsx>
        {`
          .monster {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            margin: 10px;
          }

          .hp-bar {
            width: 100px;
            height: 10px;
            background-color: #ccc;
            border-radius: 5px;
            overflow: hidden;
            margin-top: 5px;
          }

          .hp-bar-inner {
            height: 100%;
            background-color: #4caf50;
            transform-origin: left center;
            transition: transform 0.3s ease;
          }
        `}
      </style>
    </div>
  );
}

// ドラッグ可能なカードコンポーネント
function DraggableCard({
  card,
  onDrop,
  drawCards,
}: {
  card: Card;
  onDrop: (cardId: number) => void;
  drawCards: (drawAmount: number) => void;
}) {
  const [, drag] = useDrag({
    type: "CARD", 
    item: card,
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        onDrop(item.id);
      }
    },
  });

  return (
    <div ref={drag} className="card">
      <Image
        src={`/images/${card.id}.png`}
        width={80}
        height={80}
        alt={card.name}
      />
      <h3>{card.name}</h3>
      <p>
        {card.type === "attack"
          ? `Power: ${card.power}`
          : card.type === "draw"
          ? `Draw: ${card.draw}`
          : `Heal: ${card.heal}`}
      </p>

      <style jsx>
        {`
          .card {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 10px;
            border: 1px solid #ccc;
            background-color: white;
            cursor: grab;
          }
        `}
      </style>
    </div>
  );
}
