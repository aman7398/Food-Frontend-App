import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function Home({ onLogout }) {
  const handleLogout = () => {
    console.log("Logout button pressed");

    if (onLogout) {
      onLogout(); // 👈 App.js me navigateToLogin call hoga
    } else {
      console.log("onLogout callback not available");
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>🍔 Foodie</Text>
        <Text style={styles.subtitle}>Welcome to our restaurant</Text>

        <View style={styles.contentBox}>
          <Text style={styles.contentTitle}>Featured Dishes</Text>
          <Text style={styles.dishItem}>🍕 Margherita Pizza</Text>
          <Text style={styles.dishItem}>🍔 Cheese Burger</Text>
          <Text style={styles.dishItem}>🍜 Noodles</Text>
          <Text style={styles.dishItem}>🍗 Fried Chicken</Text>
          <Text style={styles.dishItem}>🍱 Biryani</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#ff6347",
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    marginBottom: 30,
  },
  contentBox: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    width: "100%",
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  dishItem: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: "#E53935",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
