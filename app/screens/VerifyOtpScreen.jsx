import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { verifyOtp } from "app/api/api/auth.api";
import { BASE_URL } from "app/api/lib";

const VerifyOtpScreen = ({ route, navigation }) => {
    const { email, mobile } = route.params;
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    console.log("VERIFY OTP FOR:", email, mobile);

    const handleVerifyOtp = async () => {
        if (!otp) return Alert.alert("Error", "Enter OTP");

        try {
            setLoading(true);

            const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
                method: "POST",
                headers:{
                    'Content-Type':"application/json"
                },
                body: JSON.stringify({ email, otp })
            });

            if (!res.ok) throw new Error("Otp validation failed")
            const resData = await res.json()
            console.log("VERIFY OTP RESPONSE:", res);

            // ✅ Save token AFTER verification
            await AsyncStorage.setItem("token", resData.token);
            await AsyncStorage.setItem("userData", JSON.stringify(resData.user));

            navigation.replace("Home")

            Alert.alert("Success", "Account verified successfully", [
                {
                    text: "Continue",
                    onPress: () => navigation.replace("Home"),
                },
            ]);
        } catch (error) {
            Alert.alert(
                "Verification Failed",
                error?.response?.data?.message || "Invalid OTP"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Verify OTP 🔐</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                keyboardType="number-pad"
                value={otp}
                onChangeText={setOtp}
            />

            <TouchableOpacity
                style={[styles.button, loading ? { opacity: 0.6 } : null ]}
                onPress={handleVerifyOtp}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? "Verifying..." : "Verify OTP"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default VerifyOtpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    button: {
        backgroundColor: "#E53935",
        height: 50,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
