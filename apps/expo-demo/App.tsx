import { useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#007AFF");

  const colors = ["#007AFF", "#FF3B30", "#34C759", "#FF9500", "#AF52DE"];

  const handlePress = () => {
    setCount(count + 1);
    Alert.alert(
      "Button Pressed!",
      `You've pressed the button ${count + 1} times`
    );
  };

  const handleReset = () => {
    setCount(0);
    setText("");
    setIsEnabled(false);
    Alert.alert("Reset", "All values have been reset!");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🚀 Revyl Demo App</Text>
          <Text style={styles.subtitle}>Built with Expo & React Native</Text>
        </View>

        {/* Counter Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Counter Demo</Text>
          <Text style={styles.counterText}>Count: {count}</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={handlePress}>
            <Text style={styles.buttonText}>Tap Me! 👆</Text>
          </TouchableOpacity>
        </View>

        {/* Text Input Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Text Input</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Type something here..."
            value={text}
            onChangeText={setText}
            multiline
          />
          <Text style={styles.inputDisplay}>
            {text
              ? `You typed: "${text}"`
              : "Start typing to see your text here"}
          </Text>
        </View>

        {/* Switch Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Toggle Switch</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>
              Feature is {isEnabled ? "ON" : "OFF"}
            </Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled ? "#007AFF" : "#f4f3f4"}
              onValueChange={setIsEnabled}
              value={isEnabled}
            />
          </View>
        </View>

        {/* Color Picker Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Color Picker</Text>
          <View style={styles.colorContainer}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorButton,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColor,
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
          <View
            style={[styles.colorPreview, { backgroundColor: selectedColor }]}
          >
            <Text style={styles.colorText}>Selected Color</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleReset}
          >
            <Text style={styles.secondaryButtonText}>Reset All 🔄</Text>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This is a demo app for testing Revyl's build pipeline with Expo EAS.
          </Text>
          <Text style={styles.footerText}>Version: 1.0.0 • Built with ❤️</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    paddingVertical: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 25,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 15,
  },
  counterText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#007AFF",
    marginBottom: 15,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
  },
  inputDisplay: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchLabel: {
    fontSize: 16,
    color: "#1a1a1a",
  },
  colorContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "transparent",
  },
  selectedColor: {
    borderColor: "#1a1a1a",
  },
  colorPreview: {
    height: 60,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  colorText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginBottom: 5,
  },
});
