"use client"; // Next.jsのクライアントサイドで実行されるコードであることを明示

import { useState } from "react";
import Image from "next/image";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// モンスターの型定義
type Monster = {
  id: number; // 一意のID
  name: string; // モンスターの名前
  hp: number; // 現在のHP
  maxHp: number; // 最大HP
};

// カードの型定義
type Card = {
  id: number; // 一意のID
  name: string; // カード名
  power: number; // 攻撃力
};

// モンスターの初期データ
const initialMonsters: Monster[] = [
  { id: 1, name: "フシギダネ", hp: 100, maxHp: 100 },
  { id: 2, name: "フシギソウ", hp: 80, maxHp: 80 },
  { id: 3, name: "フシギバナ", hp: 60, maxHp: 60 },
];

// デッキに含まれるカードの初期データ
const seigi: Card[] = [
  { id: 1, name: "フシギダネ", power: 10 },
  { id: 2, name: "フシギソウ", power: 20 },
  { id: 3, name: "フシギバナ", power: 30 },
  { id: 4, name: "フシギダネ", power: 10 },
  { id: 5, name: "フシギソウ", power: 20 },
  { id: 6, name: "フシギバナ", power: 30 },
  { id: 7, name: "フシギダネ", power: 10 },
  { id: 8, name: "フシギソウ", power: 20 },
  { id: 9, name: "フシギバナ", power: 30 },
  { id: 10, name: "フシギダネ", power: 10 },
  { id: 11, name: "フシギソウ", power: 20 },
  { id: 12, name: "フシギバナ", power: 30 },
];

// メインコンポーネント
export default function Home() {
  const [monsters, setMonsters] = useState<Monster[]>(initialMonsters); // モンスター状態管理
  const [deck, setDeck] = useState<Card[]>(seigi); // デッキ状態管理
  const [hand, setHand] = useState<Card[]>([]); // 手札状態管理

  // カードを引く関数
  const drawCards = () => {
    // 最大3枚または手札が5枚になるまで引ける
    const cardsToDraw = Math.min(3, 5 - hand.length, deck.length);
    if (cardsToDraw > 0) {
      setHand([...hand, ...deck.slice(0, cardsToDraw)]); // 手札に追加
      setDeck(deck.slice(cardsToDraw)); // デッキから引いた分を削除
    }
  };

  // ダメージ処理関数
  const handleDamage = (monsterId: number, power: number) => {
    setMonsters((prevMonsters) =>
      prevMonsters.map((monster) =>
        monster.id === monsterId
          ? { ...monster, hp: Math.max(monster.hp - power, 0) } // ダメージ適用
          : monster
      )
    );
  };

  // ドロップ処理関数（カードを使用後に手札から削除）
  const handleDrop = (cardId: number) => {
    setHand((prevHand) => prevHand.filter((card) => card.id !== cardId));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <main>
        {/* モンスター一覧 */}
        <div className="monster-container">
          {monsters.map((monster) => (
            <MonsterCard
              key={monster.id}
              monster={monster}
              onDamage={(power) => handleDamage(monster.id, power)}
            />
          ))}
        </div>

        {/* デッキエリア */}
        <div className="deck" onClick={drawCards}>
          <p>Deck</p>
        </div>

        {/* 手札エリア */}
        <div className="hand">
          {hand.map((card) => (
            <DraggableCard key={card.id} card={card} onDrop={handleDrop} />
          ))}
        </div>

        <style jsx>{`
          .monster-container {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-bottom: 20px;
          }

          .deck {
            position: fixed;
            bottom: 10px;
            left: 10px;
            width: 100px;
            height: 140px;
            background-color: #ccc;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            border: 2px solid black;
          }

          .hand {
            display: flex;
            flex-direction: row;
            gap: 10px;
            margin-top: 20px;
          }

          main {
            margin: 0;
            padding: 0;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        `}</style>
      </main>
    </DndProvider>
  );
}

// モンスターカードコンポーネント
function MonsterCard({ monster, onDamage }: { monster: Monster; onDamage: (power: number) => void }) {
  const [, drop] = useDrop({
    accept: "CARD", // ドロップ可能なアイテムタイプ
    drop: (item: Card) => onDamage(item.power), // ドロップ時の処理
  });

  return (
    <div ref={drop} className="monster">
      <Image
        src={`/images/${monster.id}.png`} // 画像パス
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
            transform: `scaleX(${monster.hp / monster.maxHp})`, // HPバーのスケール
          }}
        ></div>
      </div>

      <style jsx>{`
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
          position: relative;
        }

        .hp-bar-inner {
          height: 100%;
          background-color: #4caf50;
          transform-origin: left center;
          transition: transform 0.3s ease;
          width: 100%;
        }
      `}</style>
    </div>
  );
}

// ドラッグ可能なカードコンポーネント
function DraggableCard({ card, onDrop }: { card: Card; onDrop: (cardId: number) => void }) {
  const [, drag] = useDrag({
    type: "CARD", // ドラッグ可能なアイテムタイプ
    item: card, // ドラッグするデータ
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        onDrop(item.id); // ドロップ後の処理
      }
    },
  });

  return (
    <div ref={drag} className="card">
      <Image
        src={`/images/${card.id}.png`} // 画像パス
        width={80}
        height={80}
        alt={card.name}
      />
      <h3>{card.name}</h3>
      <p>Power: {card.power}</p>

      <style jsx>{`
        .card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px;
          border: 1px solid #ccc;
          background-color: white;
          cursor: grab;
        }
      `}</style>
    </div>
  );
}
