import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";

function App(): React.JSX.Element {
  const [counter, setCounter] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  const colors = ["#ffffff", "#e3f2fd", "#fff3e0", "#f3e5f5", "#e8f5e9"];

  const handleIncrement = () => {
    setCounter(counter + 1);
  };

  const handleDecrement = () => {
    setCounter(counter - 1);
  };

  const handleReset = () => {
    setCounter(0);
    Alert.alert("Reset", "Counter has been reset to 0!");
  };

  const handleColorChange = () => {
    const currentIndex = colors.indexOf(backgroundColor);
    const nextIndex = (currentIndex + 1) % colors.length;
    setBackgroundColor(colors[nextIndex]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
      >
        <View style={styles.content}>
          <Text style={styles.title}>🚀 Revyl CI Playground</Text>
          <Text style={styles.subtitle}>React Native Android App</Text>
          
          <View style={styles.counterContainer}>
            <Text style={styles.counterLabel}>Counter Value:</Text>
            <Text style={styles.counterValue}>{counter}</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.decrementButton]} 
              onPress={handleDecrement}
            >
              <Text style={styles.buttonText}>- Decrease</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.incrementButton]} 
              onPress={handleIncrement}
            >
              <Text style={styles.buttonText}>+ Increase</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.button, styles.resetButton]} 
            onPress={handleReset}
          >
            <Text style={styles.buttonText}>🔄 Reset Counter</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.colorButton]} 
            onPress={handleColorChange}
          >
            <Text style={styles.buttonText}>🎨 Change Background</Text>
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              This app demonstrates basic React Native functionality
            </Text>
            <Text style={styles.infoText}>
              Built and deployed via Revyl CI/CD
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#1976d2",
  },
  subtitle: {
    fontSize: 18,
    color: "#666666",
    marginBottom: 30,
    textAlign: "center",
  },
  counterContainer: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    alignItems: "center",
    minWidth: 200,
  },
  counterLabel: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 10,
  },
  counterValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#1976d2",
  },
  buttonRow: {
    flexDirection: "row",
    marginBottom: 15,
    gap: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: 5,
  },
  incrementButton: {
    backgroundColor: "#4caf50",
  },
  decrementButton: {
    backgroundColor: "#f44336",
  },
  resetButton: {
    backgroundColor: "#ff9800",
    marginBottom: 15,
  },
  colorButton: {
    backgroundColor: "#9c27b0",
    marginBottom: 30,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  infoBox: {
    backgroundColor: "#e3f2fd",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  infoText: {
    fontSize: 14,
    color: "#1976d2",
    textAlign: "center",
    marginBottom: 5,
  },
});

export default App;
