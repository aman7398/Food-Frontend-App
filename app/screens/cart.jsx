import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";

const BASE_URL = "http://localhost:5000/api/v1";

export default function Cart({ navigation }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/user/get-cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setCart(data);
    } catch (err) {
      console.log("CART ERROR:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

const BackButton = ({ navigation }) => (
  <TouchableOpacity
    style={{ padding: 16 }}
    onPress={() => navigation.goBack()}
    activeOpacity={0.7}
  >
    <Text style={{ color: "#FF9800", fontWeight: "700", fontSize: 16 }}>
      ← Back
    </Text>
  </TouchableOpacity>
);

if (loading) {
  return (
    <View style={{ flex: 1 }}>
      <BackButton navigation={navigation} />
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF9800" />
      </View>
    </View>
  );
}

if (!cart || cart.items.length === 0) {
  return (
    <View style={{ flex: 1 }}>
      <BackButton navigation={navigation} />
      <View style={styles.center}>
        <Text style={styles.empty}>🛒 Your cart is empty</Text>
      </View>
    </View>
  );
}

  const tax = Math.round(cart.subTotal * 0.05);
  const deliveryCharge = cart.restaurant.deliveryCharge || 0;
  const total = cart.subTotal + tax + deliveryCharge;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Your Cart</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Restaurant Info */}
        <View style={styles.restaurantBox}>
          <Text style={styles.restaurantName}>
            {cart.restaurant.name}
          </Text>
          <Text style={styles.deliveryInfo}>
            ⏱️ {cart.restaurant.deliveryTime} mins
          </Text>
        </View>

        {/* Cart Items */}
        {cart.items.map((item) => (
          <View key={item._id} style={styles.itemCard}>
            <Image
              source={{ uri: item.food.image[0] }}
              style={styles.image}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemMeta}>
                ₹{item.price} × {item.quantity}
              </Text>
            </View>

            <Text style={styles.itemTotal}>₹{item.total}</Text>
          </View>
        ))}

        {/* Bill Details */}
        <View style={styles.billBox}>
          <Row label="Subtotal" value={`₹${cart.subTotal}`} />
          <Row label="Tax (5%)" value={`₹${tax}`} />
          <Row
            label="Delivery Charges"
            value={`₹${deliveryCharge}`}
          />
          <View style={styles.divider} />
          <Row label="Total to Pay" value={`₹${total}`} bold />
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.payBtn}>
          <Text style={styles.payText} onPress={()=>navigation.navigate("Payment", {orderTotal:cart.subTotal})}>Proceed to Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const Row = ({ label, value, bold }) => (
  <View style={styles.row}>
    <Text style={[styles.label, bold && styles.bold]}>
      {label}
    </Text>
    <Text style={[styles.value, bold && styles.bold]}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  back: { color: "#FF9800", fontWeight: "700" },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
  },

  restaurantBox: {
    marginBottom: 14,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "800",
  },
  deliveryInfo: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },

  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  itemName: { fontSize: 14, fontWeight: "700" },
  itemMeta: { fontSize: 12, color: "#666" },
  itemTotal: { fontWeight: "800" },

  billBox: {
    marginTop: 16,
    backgroundColor: "#F9F9F9",
    padding: 14,
    borderRadius: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: { color: "#666" },
  value: { fontWeight: "600" },
  bold: { fontWeight: "800", fontSize: 15 },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },

  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  payBtn: {
    backgroundColor: "#FF9800",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  payText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },

  empty: { fontSize: 18, fontWeight: "700" },
});
