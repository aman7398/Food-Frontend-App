import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

export default function ForgotPassword() {
  const router = useRouter();

  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Dummy OTP for demo
  const DUMMY_OTP = "123456";

  const sendOtp = () => {
    if (!email) {
      Alert.alert("Error", "Please enter email");
      return;
    }
    setStep(2);
    Alert.alert("OTP Sent", "Your OTP is 123456");
  };

  const verifyOtp = () => {
    if (otp !== DUMMY_OTP) {
      Alert.alert("Invalid OTP");
      return;
    }
    setStep(3);
  };

  const resetPassword = () => {
    if (!password || !confirmPassword) {
      Alert.alert("Error", "All fields required");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    Alert.alert("Success", "Password changed successfully");
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password 🔐</Text>

      {/* STEP 1: EMAIL */}
      {step === 1 ? (
        <>
          <TextInput
            placeholder="Enter your email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity style={styles.button} onPress={sendOtp}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        </>
      ): <></> }

      {/* STEP 2: OTP */}
      {step === 2 ? (
        <>
          <TextInput
            placeholder="Enter OTP"
            style={styles.input}
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={verifyOtp}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
        </>
      ) : <></> }

      {/* STEP 3: NEW PASSWORD */}
      {step === 3 ? (
        <>
          <TextInput
            placeholder="New Password"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TextInput
            placeholder="Confirm Password"
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={resetPassword}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </>
      ) : <></> }

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
    marginTop: 14,
  },
});

