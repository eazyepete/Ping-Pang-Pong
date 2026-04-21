import { useState } from "react";
import GameScreen from "./components/GameScreen";
import MenuScreenNEW from "./components/MenuScreenNEW";

export default function App() {
  const [screen, setScreen] = useState("menu");
  const [difficulty, setDifficulty] = useState("medium");
  const [playerName, setPlayerName] = useState("Player");

  if (screen === "menu") {
    return (
      <MenuScreenNEW
        onStart={(d, name) => {
          setDifficulty(d);
          setPlayerName(name || "Player");
          setScreen("game");
        }}
      />
    );
  }

  return (
    <GameScreen
      difficulty={difficulty}
      playerName={playerName}
      onExit={() => setScreen("menu")}
    />
  );
}