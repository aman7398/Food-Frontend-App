import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

const LoginScreen = ({ navigation }) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    // Email empty
    if (!email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    }

    // Email format
    else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email";
      valid = false;
    }

    // Password empty
    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    // Password length
    else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = () => {
    if (validateForm()) {
      router.replace("/Catalog");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      <TextInput
        placeholder="hello@gmail.com"
        style={[styles.input, errors.email && { borderColor: "red" }]}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrors({ ...errors, email: null });
        }}
        keyboardType="email-address"
      />

      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <View
        style={[
          styles.passwordContainer,
          errors.password && { borderColor: "red" },
        ]}
      >
        <TextInput
          placeholder="Password"
          style={styles.passwordInput}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrors({ ...errors, password: null });
          }}
          secureTextEntry={!showPassword}
        />

        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={22}
            color="#777"
          />
        </TouchableOpacity>
      </View>

      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.link}>Don’t have an account? Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/forgotpassword")}>
        <Text style={styles.link}>Forget Password</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 24,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  button: {
    backgroundColor: "#E53935", 
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    textAlign: "center",
    color: "#E53935",
    marginTop: 12,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 14,
  },
  passwordInput: {
    flex: 1,
    height: "100%",
  },
});
