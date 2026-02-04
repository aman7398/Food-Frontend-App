import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Switch,
    Alert,
    ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://localhost:5000/api/v1";

export default function AddressForm({ navigation, route }) {
    const editAddress = route?.params?.address || null;
    const isEdit = !!editAddress;

    const [form, setForm] = useState({
        name: "",
        mobile: "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false,
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit) {
            setForm({
                name: editAddress.name,
                mobile: editAddress.mobile,
                addressLine: editAddress.addressLine,
                city: editAddress.city,
                state: editAddress.state,
                pincode: editAddress.pincode,
                isDefault: editAddress.isDefault,
            });
        }
    }, []);

    const handleChange = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    const validate = () => {
        const { name, mobile, addressLine, city, state, pincode } = form;

        if (!name || !mobile || !addressLine || !city || !state || !pincode) {
            Alert.alert("Error", "All fields are required");
            return false;
        }

        if (mobile.length < 10) {
            Alert.alert("Error", "Enter valid mobile number");
            return false;
        }

        if (pincode.length < 6) {
            Alert.alert("Error", "Enter valid pincode");
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");

            const res = await fetch(
                isEdit
                    ? `${BASE_URL}/address/update/${editAddress._id}`
                    : `${BASE_URL}/address/new`,
                {
                    method: isEdit ? "PATCH" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(form),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
            }
            navigation.pop()

            Alert.alert(
                "Success",
                isEdit ? "Address updated" : "Address added",
                [{ text: "OK", onPress: () => navigation.goBack() }]
            );
        } catch (err) {
            Alert.alert("Error", err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>
                {isEdit ? "Edit Address" : "Add New Address"}
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Address Name (Home / Work)"
                value={form.name}
                onChangeText={(v) => handleChange("name", v)}
            />

            <TextInput
                style={styles.input}
                placeholder="Mobile Number"
                keyboardType="phone-pad"
                value={form.mobile}
                onChangeText={(v) => handleChange("mobile", v)}
            />

            <TextInput
                style={styles.input}
                placeholder="Full Address"
                value={form.addressLine}
                onChangeText={(v) => handleChange("addressLine", v)}
            />

            <TextInput
                style={styles.input}
                placeholder="City"
                value={form.city}
                onChangeText={(v) => handleChange("city", v)}
            />

            <TextInput
                style={styles.input}
                placeholder="State"
                value={form.state}
                onChangeText={(v) => handleChange("state", v)}
            />

            <TextInput
                style={styles.input}
                placeholder="Pincode"
                keyboardType="number-pad"
                value={form.pincode}
                onChangeText={(v) => handleChange("pincode", v)}
            />

            <View style={styles.switchRow}>
                <Text style={styles.switchText}>Set as default address</Text>
                <Switch
                    value={form.isDefault}
                    onValueChange={(v) => handleChange("isDefault", v)}
                />
            </View>

            <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.6 }]}
                onPress={handleSubmit}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? "Saving..." : isEdit ? "Update Address" : "Save Address"}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
        flexGrow: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: "800",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 14,
        marginBottom: 14,
    },
    switchRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
    },
    switchText: {
        fontSize: 14,
        fontWeight: "600",
    },
    button: {
        backgroundColor: "#FF9800",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "800",
        fontSize: 16,
    },
});
