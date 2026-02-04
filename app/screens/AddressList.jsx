import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://localhost:5000/api/v1";

export default function AddressList({ navigation }) {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAddresses = async () => {
        try {
            const token = await AsyncStorage.getItem("token");

            const res = await fetch(`${BASE_URL}/address`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            setAddresses(data.data || []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", fetchAddresses);
        return unsubscribe;
    }, [navigation]);

    if (loading) {
        return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.topPart}>
                <Text>Keep one address as default to get foods suggestion on home page</Text>
                <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() =>
                        navigation.push("AddressForm")
                    }
                >
                    <Text style={styles.editText}>Add New</Text>
                </TouchableOpacity>
            </View>

            {addresses.map((item) => (
                <View key={item._id} style={styles.card}>
                    <View style={styles.row}>
                        <Text style={styles.name}>{item.name}</Text>
                        {item.isDefault && <Text style={styles.default}>DEFAULT</Text>}
                    </View>

                    <Text style={styles.text}>{item.addressLine}</Text>
                    <Text style={styles.text}>
                        {item.city}, {item.state} - {item.pincode}
                    </Text>
                    <Text style={styles.text}>📞 {item.mobile}</Text>

                    <TouchableOpacity
                        style={styles.editBtn}
                        onPress={() =>
                            navigation.push("AddressForm", { address: item })
                        }
                    >
                        <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#fff",
    },
    topPart: {
        flexDirection: "row",
        gap:"4px",
        padding:"4px",
        marginBottom:"4px"
    },
    card: {
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    name: {
        fontWeight: "800",
        fontSize: 16,
    },
    default: {
        color: "#50C878",
        fontWeight: "700",
    },
    text: {
        marginTop: 4,
        color: "#555",
    },
    editBtn: {
        alignSelf: "flex-end",
        marginTop: 10,
    },
    editText: {
        color: "#FF9800",
        fontWeight: "700",
    },
});
