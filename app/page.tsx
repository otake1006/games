import Image from "next/image";

type Monster = {
  id: number;
  name: String;
}
const monsters: Monster[] =[
  { id: 1, name: 'フシギダネ'},
  { id: 2, name: 'フシギソウ'},
  { id: 3, name: 'フシギバナ'},
  { id: 4, name: 'ヒトカゲ'},
  { id: 5, name: 'リザード'},
  { id: 6, name: 'リザードン'},
  { id: 7, name: 'ゼニガメ'},
  { id: 8, name: 'カメール'},
  { id: 9, name: 'カメックス'},
  { id: 10, name: 'フシギダネ'},
  { id: 11, name: 'フシギダネ'},
  { id: 12, name: 'フシギダネ'},
  { id: 13, name: 'フシギダネ'},
  { id: 14, name: 'フシギダネ'},
  { id: 15, name: 'フシギダネ'},
  { id: 16, name: 'フシギダネ'},
  { id: 17, name: 'フシギダネ'},
  { id: 18, name: 'フシギダネ'},
  { id: 19, name: 'フシギダネ'},
  { id: 20, name: 'フシギダネ'},
  { id: 21, name: 'フシギダネ'},
  { id: 22, name: 'フシギダネ'},
  { id: 23, name: 'フシギダネ'},
  { id: 24, name: 'フシギダネ'},
  { id: 25, name: 'フシギダネ'},
];

export default function Home() {
  const MonsterCount = 25;
  return(
  <main>
    {monsters.map((monster,i) => {
      return (
      <div key={monster.id}>
      <Image 
      src={`/images/${i+1}.png`}
      width={80} 
      height={80} 
      alt=""
       />
     
     <h2>{monster.name}</h2>
     <p>HP: 100</p>
     </div>
    );
    })}
  </main>
  );
}
