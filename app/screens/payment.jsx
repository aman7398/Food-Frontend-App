import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://localhost:5000/api/v1";

export default function Payment({ route, navigation }) {
    const { orderTotal } = route.params
    const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);

    /* ================= FETCH ADDRESS ================= */
    useEffect(() => {
        fetchAddress();
    }, []);

    const fetchAddress = async () => {
        try {
            const token = await AsyncStorage.getItem("token");

            const res = await fetch(`${BASE_URL}/address`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const resData = await res.json();

            if (!resData.success) {
                Alert.alert("Address Required", "Please add an address first");
                return;
            }

            const isDefault = resData.data.filter((ad)=>ad.isDefault)

            // taking default / first address
            setAddress(isDefault[0]);
        } catch (err) {
            Alert.alert("Failed to fetch address", err);
        } finally {
            setLoading(false);
        }
    };

    /* ================= PLACE ORDER ================= */
    const placeOrder = async () => {
        try {
            setPlacingOrder(true);
            const token = await AsyncStorage.getItem("token");

            const res = await fetch(`${BASE_URL}/order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    addressId: address._id,
                    paymentMethod: "COD",
                }),
            });

            const data = await res.json();

            if (!data.success) {
                Alert.alert("Order Failed", data.message);
                return;
            }

            Alert.alert("Success", "Order placed successfully");
            navigation.replace("Home"); // or Orders page
        } catch (err) {
            Alert.alert("Something went wrong", err);
        } finally {
            setPlacingOrder(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#FF9800" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView>

                {/* ORDER TOTAL */}
                <View style={styles.card}>
                    <Text style={styles.title}>🧾 Order Total</Text>
                    <Text style={styles.amount}>₹{orderTotal}</Text>
                </View>

                {/* ADDRESS */}
                <View style={styles.card}>
                    <Text style={styles.title}>📍 Delivery Address</Text>
                    <Text style={styles.text}>{address.name}</Text>
                    <Text style={styles.text}>{address.addressLine}</Text>
                    <Text style={styles.text}>
                        {address.city}, {address.state} - {address.pincode}
                    </Text>
                    <Text style={styles.text}>📞 {address.mobile}</Text>
                </View>

                {/* PAYMENT METHOD */}
                <View style={styles.card}>
                    <Text style={styles.title}>💵 Payment Method</Text>
                    <Text style={styles.cod}>Cash on Delivery</Text>
                </View>

            </ScrollView>

            {/* PLACE ORDER BUTTON */}
            <TouchableOpacity
                style={styles.button}
                onPress={placeOrder}
                disabled={placingOrder}
            >
                <Text style={styles.buttonText}>
                    {placingOrder ? "Placing Order..." : "Place Order"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        backgroundColor: "#F9F9F9",
        margin: 16,
        padding: 16,
        borderRadius: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: "800",
        marginBottom: 8,
    },
    amount: {
        fontSize: 22,
        fontWeight: "900",
        color: "#FF9800",
    },
    text: {
        fontSize: 14,
        marginBottom: 4,
    },
    cod: {
        fontSize: 16,
        fontWeight: "700",
        color: "#2E7D32",
    },
    button: {
        backgroundColor: "#FF9800",
        padding: 16,
        margin: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "800",
    },
});
