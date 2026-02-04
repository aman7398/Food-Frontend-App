import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { signUpUser } from "app/api/api/auth.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";

const SignupScreen = ({ navigation, onNavigateLogin, onNavigateHome }) => {
  // const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = "Full name is required";
      valid = false;
    } else if (name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
      valid = false;
    } else if (!/^[A-Za-z ]+$/.test(name)) {
      newErrors.name = "Name can contain only letters";
      valid = false;
    }

    // phone validtion
    if (!mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
      valid = false;
    } else if (!/^[6-9]\d{9}$/.test(mobile)) {
      newErrors.mobile = "Enter valid 10 digit mobile number";
      valid = false;
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email";
      valid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const res = await signUpUser({
        name,
        email,
        mobile,
        password,
      });

      Alert.alert("OTP Sent", "Please verify OTP sent to your email");

      navigation.navigate("OtpVerify", {
        mobile,
        email,
      });
    } catch (error) {
      Alert.alert(
        "Signup Failed",
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };




  const handleBackToLogin = () => {
    console.log("Navigate back to login");
    navigation.navigate("Login")
    // else {
    //   router.push("/login");
    // }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account 🍕</Text>
      <Text style={styles.subtitle}>Sign up to start ordering</Text>

      <TextInput
        placeholder="Full Name"
        style={[styles.input, errors.name && { borderColor: "red" }]}
        value={name}
        onChangeText={(text) => {
          setName(text);
          setErrors({ ...errors, name: null });
        }}
      />

      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      <TextInput
        placeholder="Mobile Number"
        style={[styles.input, errors.mobile && { borderColor: "red" }]}
        value={mobile}
        onChangeText={(text) => {
          setMobile(text.replace(/[^0-9]/g, ""));
          setErrors({ ...errors, mobile: null });
        }}
        keyboardType="number-pad"
        maxLength={10}
      />

      {errors.mobile && (
        <Text style={styles.errorText}>{errors.mobile}</Text>
      )}

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

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating Account..." : "Sign Up"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleBackToLogin}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;

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
