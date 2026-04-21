import { View, Text, Switch, Button } from "react-native";

export default function SettingsModal({ settings, setSettings, onClose }) {
  return (
    <View style={{
      position: "absolute",
      top: 100,
      left: 20,
      right: 20,
      padding: 20,
      backgroundColor: "#0f172a",
      borderRadius: 12
    }}>

      <Text style={{ color: "#00f5ff", fontSize: 20, marginBottom: 10 }}>
        Settings
      </Text>

      {/* Vibration Toggle */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10 }}>
        <Text style={{ color: "white" }}>Vibration</Text>
        <Switch
          value={settings.vibration}
          onValueChange={(v) => setSettings({ ...settings, vibration: v })}
        />
      </View>

      {/* Theme Toggle */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10 }}>
        <Text style={{ color: "white" }}>Dark Mode</Text>
        <Switch
          value={settings.theme === "dark"}
          onValueChange={(v) =>
            setSettings({ ...settings, theme: v ? "dark" : "light" })
          }
        />
      </View>

      <Button title="Close" onPress={onClose} />
    </View>
  );
}