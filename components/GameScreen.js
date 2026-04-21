import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Button,
  ActivityIndicator,
  Animated
} from "react-native";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createGame, updateGame } from "../utils/gameLogic";
import SettingsModal from "./SettingsModal";

const { width, height } = Dimensions.get("window");

const TOP_BAR_HEIGHT = 180;

export default function GameScreen({ difficulty, playerName, onExit }) {
  const [game, setGame] = useState(createGame(width, height, difficulty));
  const [paused, setPaused] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({ vibration: true, theme: "dark" });
  const [loaded, setLoaded] = useState(false);

  const input = useRef({ y: height / 2 });

  // ✅ Score animation refs
  const playerAnim = useRef(new Animated.Value(1)).current;
  const aiAnim = useRef(new Animated.Value(1)).current;

  const prevPlayerScore = useRef(game.playerScore);
  const prevAiScore = useRef(game.aiScore);

  // ✅ Load settings
  useEffect(() => {
    async function init() {
      try {
        const data = await AsyncStorage.getItem("settings");
        if (data) setSettings(JSON.parse(data));
      } catch {}
      setLoaded(true);
    }
    init();
  }, []);

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem("settings", JSON.stringify(settings));
    }
  }, [settings, loaded]);

  const vibrate = () => {
    if (settings.vibration) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // ✅ Score animation function
  const animateScore = (anim) => {
    anim.setValue(1);

    Animated.sequence([
      Animated.timing(anim, {
        toValue: 1.5,
        duration: 150,
        useNativeDriver: true
      }),
      Animated.spring(anim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true
      })
    ]).start();
  };

  // ✅ Detect score changes
  useEffect(() => {
    if (game.playerScore !== prevPlayerScore.current) {
      animateScore(playerAnim);
      prevPlayerScore.current = game.playerScore;
    }

    if (game.aiScore !== prevAiScore.current) {
      animateScore(aiAnim);
      prevAiScore.current = game.aiScore;
    }
  }, [game.playerScore, game.aiScore]);

  // ✅ Game loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (!paused && loaded) {
        setGame(prev => {
          const g = JSON.parse(JSON.stringify(prev));
          updateGame(g, input.current);

          if (Math.random() < 0.03) vibrate();

          return g;
        });
      }
    }, 16);

    return () => clearInterval(interval);
  }, [paused, loaded]);

  const restartGame = () => {
    setGame(createGame(width, height, difficulty));
  };

  const bgColor = settings.theme === "dark" ? "#020617" : "#f1f5f9";
  const textColor = settings.theme === "dark" ? "white" : "black";

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#020617" }}>
        <ActivityIndicator size="large" color="#00f5ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>

      {/* ✅ TOP BAR */}
      <View style={{
        height: TOP_BAR_HEIGHT,
        paddingTop: 60,
        paddingHorizontal: 20
      }}>

        {/* Buttons */}
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between"
        }}>
          <TouchableOpacity onPress={onExit}>
            <Text style={{ color: "#f87171", fontWeight: "bold", fontSize: 16 }}>
              Menu
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setSettingsOpen(true)}>
            <Text style={{ color: "#00f5ff", fontWeight: "bold", fontSize: 16 }}>
              Settings
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setPaused(!paused)}>
            <Text style={{ color: "#00f5ff", fontWeight: "bold", fontSize: 16 }}>
              {paused ? "Resume" : "Pause"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Player Name */}
        <Text style={{
          color: "#94a3b8",
          textAlign: "center",
          marginTop: 15,
          fontSize: 14
        }}>
          {playerName}
        </Text>

        {/* ✅ SCOREBOARD */}
        <View style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10
        }}>

          {/* Player */}
          <Animated.Text style={{
            transform: [{ scale: playerAnim }],
            color: "#00f5ff",
            fontSize: 42,
            fontWeight: "bold",
            textShadowColor: "#00f5ff",
            textShadowRadius: 15
          }}>
            {game.playerScore}
          </Animated.Text>

          {/* Divider */}
          <View style={{
            width: 2,
            height: 30,
            backgroundColor: "#475569",
            marginHorizontal: 15
          }} />

          {/* AI */}
          <Animated.Text style={{
            transform: [{ scale: aiAnim }],
            color: "#a855f7",
            fontSize: 42,
            fontWeight: "bold",
            textShadowColor: "#a855f7",
            textShadowRadius: 15
          }}>
            {game.aiScore}
          </Animated.Text>

        </View>

      </View>

      {/* ✅ GAME AREA */}
      <View
        style={{ flex: 1 }}
        onTouchMove={(e) => {
          input.current.y = e.nativeEvent.locationY;
        }}
      >

        {/* Player Paddle */}
        <View style={{
          position: "absolute",
          left: game.player.x,
          top: game.player.y,
          width: game.player.w,
          height: game.player.h,
          backgroundColor: "#00f5ff"
        }} />

        {/* AI Paddle */}
        <View style={{
          position: "absolute",
          left: game.ai.x,
          top: game.ai.y,
          width: game.ai.w,
          height: game.ai.h,
          backgroundColor: "#a855f7"
        }} />

        {/* Ball */}
        <View style={{
          position: "absolute",
          left: game.ball.x,
          top: game.ball.y,
          width: game.ball.size,
          height: game.ball.size,
          backgroundColor: settings.theme === "dark" ? "white" : "black"
        }} />

      </View>

      {/* Pause */}
      {paused && (
        <Text style={{
          position: "absolute",
          top: height / 2,
          alignSelf: "center",
          color: textColor,
          fontSize: 40
        }}>
          Paused
        </Text>
      )}

      {/* Game Over */}
      {game.gameOver && (
        <View style={{
          position: "absolute",
          top: height / 2 - 80,
          alignSelf: "center"
        }}>
          <Text style={{ color: textColor, fontSize: 40 }}>
            Game Over
          </Text>

          <Button title="Play Again" onPress={restartGame} />
        </View>
      )}

      {/* Settings */}
      {settingsOpen && (
        <SettingsModal
          settings={settings}
          setSettings={setSettings}
          onClose={() => setSettingsOpen(false)}
        />
      )}

    </View>
  );
}