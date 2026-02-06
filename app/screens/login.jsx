import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { loginUser } from "app/api/api/auth.api";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

export default function LoginScreen() {
  const navigation = useNavigation()
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  // const handleLogin = () => {
  //   if (email && password) {
  //     console.log("Login pressed with email:", email);
  //     if (onNavigateHome) {
  //       onNavigateHome();
  //     }
  //   } else {
  //     alert("Please enter email and password");
  //   }
  // };
  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Error", "All fields required");
    }

    try {
      setLoading(true);

      const res = await loginUser({ email, password });
      console.log("LOGIN RESPONSE:", res);

      // 🔑 SAVE TOKEN (handle different response shapes)
      const token = res?.token ?? res?.data?.token ?? res?.accessToken ?? res?.user?.token;

      if (!token) {
        Alert.alert("Login Failed", "No token returned from server");
        return;
      }

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("userData", JSON.stringify(res?.user ?? res));
      Alert.alert("Success", "Login successful");

      // navigate to Home
      navigation.replace("Home");

    } catch (error) {
      Alert.alert(
        "Login Failed",
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };



  const handleSignupClick = () => {
    console.log("Navigate to signup");
    navigation.navigate("Signup");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.togglePassword}>{showPassword ? "Hide" : "Show"}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.loginButton, loading ? { opacity: 0.6 } : null ]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSignupClick}>
        <Text style={styles.signupText}>
          Dont have account? <Text style={styles.link}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    width: "100%",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
  },
  passwordInput: {
    // flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
    borderRadius: 8,
    width: "100%",
  },
  togglePassword: {
    paddingRight: 10,
    color: "#ff6347",
  },
  loginButton: {
    backgroundColor: "#ff6347",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupText: {
    marginTop: 20,
    color: "#666",
  },
  link: {
    color: "#ff6347",
    fontWeight: "bold",
  },
});
