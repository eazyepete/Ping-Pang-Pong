import AsyncStorage from "@react-native-async-storage/async-storage";

export async function loadSettings() {
  const data = await AsyncStorage.getItem("settings");
  return data ? JSON.parse(data) : { vibration: true, theme: "dark" };
}

export async function saveSettings(settings) {
  await AsyncStorage.setItem("settings", JSON.stringify(settings));
}