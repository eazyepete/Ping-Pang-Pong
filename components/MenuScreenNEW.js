import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated
} from "react-native";
import { useEffect, useRef, useState } from "react";
import SettingsModal from "./SettingsModal";
import { loadSettings, saveSettings } from "../utils/settings";

export default function MenuScreenNEW({ onStart }) {
  const [name, setName] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({ vibration: true, theme: "dark" });

  const glowAnim = useRef(new Animated.Value(0)).current;

  // ✅ Load settings
  useEffect(() => {
    async function init() {
      const s = await loadSettings();
      setSettings(s);
    }
    init();
  }, []);

  // ✅ Save settings
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // ✨ Glow animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false
        })
      ])
    ).start();
  }, []);

  const glow = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [5, 20]
  });

  const Button = ({ title, level }) => (
    <TouchableOpacity
      onPress={() => onStart(level, name)}
      style={{
        width: 220,
        paddingVertical: 14,
        marginVertical: 8,
        borderRadius: 12,
        backgroundColor: "#0f172a",
        borderWidth: 2,
        borderColor: "#00f5ff",
        alignItems: "center"
      }}
    >
      <Text style={{
        color: "#00f5ff",
        fontSize: 18,
        fontWeight: "bold"
      }}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{
      flex: 1,
      backgroundColor: settings.theme === "dark" ? "#020617" : "#f1f5f9",
      justifyContent: "center",
      alignItems: "center"
    }}>

      {/* ⚙️ SETTINGS BUTTON (NEW) */}
      <TouchableOpacity
        onPress={() => setSettingsOpen(true)}
        style={{
          position: "absolute",
          top: 60,
          right: 20,
          padding: 10
        }}
      >
        <Text style={{
          color: "#00f5ff",
          fontWeight: "bold",
          fontSize: 16
        }}>
          Settings
        </Text>
      </TouchableOpacity>

      {/* ✨ Title */}
      <Animated.Text style={{
        fontSize: 44,
        color: "#00f5ff",
        marginBottom: 30,
        fontWeight: "bold",
        textShadowColor: "#00f5ff",
        textShadowRadius: glow
      }}>
        Ping Pang Pong
      </Animated.Text>

      {/* 🧑 Name Input */}
      <TextInput
        placeholder="Enter your name"
        placeholderTextColor="#64748b"
        value={name}
        onChangeText={setName}
        style={{
          width: 220,
          borderWidth: 1,
          borderColor: "#00f5ff",
          borderRadius: 10,
          padding: 10,
          color: settings.theme === "dark" ? "white" : "black",
          marginBottom: 20,
          textAlign: "center"
        }}
      />

      {/* 🎮 Buttons */}
      <Button title="EASY" level="easy" />
      <Button title="MEDIUM" level="medium" />
      <Button title="HARD" level="hard" />

      {/* ⚙️ SETTINGS MODAL */}
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