import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

const BASE_URL = "http://localhost:5000/api/v1";

export default function ApproveRestaurants({ navigation }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);

  /* ---------------- FETCH RESTAURANTS ---------------- */
  const fetchRestaurants = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/restaurant/get-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      // ⬆️ Unapproved at top
      const sorted = json.data.sort(
        (a, b) => a.isApproved - b.isApproved
      );

      setRestaurants(sorted);
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  /* ---------------- APPROVE RESTAURANT ---------------- */
  const approveRestaurant = async (id) => {
    try {
      setApprovingId(id);
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(
        `${BASE_URL}/restaurant/approve/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      // Update UI instantly
      setRestaurants((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, isApproved: true } : r
        )
      );
    } catch (err) {
      Alert.alert("Approval failed", err.message);
    } finally {
      setApprovingId(null);
    }
  };

  /* ---------------- RENDER ITEM ---------------- */
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>
          📍 {item.address?.pincode} • ⏱️ {item.deliveryTime} mins
        </Text>
      </View>

      {!item.isApproved ? (
        <TouchableOpacity
          style={styles.approveBtn}
          onPress={() => approveRestaurant(item._id)}
          disabled={approvingId === item._id}
        >
          {approvingId === item._id ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.approveText}>Approve</Text>
          )}
        </TouchableOpacity>
      ) : (
        <Text style={styles.approved}>Approved ✅</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF9800" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Restaurant Approvals</Text>
      </View>

      <FlatList
        data={restaurants}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  back: {
    color: "#FF9800",
    fontWeight: "800",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "900",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: "800",
  },
  meta: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },

  approveBtn: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  approveText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
  },

  approved: {
    color: "#4CAF50",
    fontWeight: "800",
    fontSize: 12,
  },
});
