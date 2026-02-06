import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "app/api/lib";
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    Switch,
} from "react-native";

export default function Restaurant({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [restaurant, setRestaurant] = useState(null);
    const [foods, setFoods] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    const [form, setForm] = useState({
        name: "",
        description: "",
        image: "",
        fullAddress: "",
        city: "",
        pincode: "",
        lat: "",
        lng: "",
        deliveryTime: "",
        deliveryCharge: "",
        openTime: "",
        closeTime: "",
        isOpen: true,
    });

    const fetchRestaurant = async () => {
        try {
            const token = await AsyncStorage.getItem("token");

            const res = await fetch(`${BASE_URL}/restaurant`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok && data.restaurant) {
                setRestaurant(data.restaurant);
                setFoods(data.foods || []);

                // prefill form for edit
                setForm({
                    name: data.restaurant.name || "",
                    description: data.restaurant.description || "",
                    image: data.restaurant.image?.[0] || "",
                    fullAddress: data.restaurant.address?.fullAddress || "",
                    city: data.restaurant.address?.city || "",
                    pincode: data.restaurant.address?.pincode || "",
                    lat: String(data.restaurant.address?.lat || ""),
                    lng: String(data.restaurant.address?.lng || ""),
                    deliveryTime: String(data.restaurant.deliveryTime || ""),
                    deliveryCharge: String(data.restaurant.deliveryCharge || ""),
                    openTime: data.restaurant.openTime || "",
                    closeTime: data.restaurant.closeTime || "",
                    isOpen: data.restaurant.isOpen,
                });
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRestaurant();
    }, []);

    const handleChange = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    const handleCreateRestaurant = async () => {
        if (!form.name || !form.city || !form.pincode) {
            return Alert.alert("Error", "Name, City & Pincode required");
        }

        const payload = {
            name: form.name,
            description: form.description,
            image: form.image ? [form.image] : [],
            address: {
                fullAddress: form.fullAddress,
                city: form.city,
                pincode: form.pincode,
                lat: Number(form.lat),
                lng: Number(form.lng),
            },
            deliveryTime: Number(form.deliveryTime),
            deliveryCharge: Number(form.deliveryCharge),
            openTime: form.openTime,
            closeTime: form.closeTime,
            isOpen: form.isOpen,
        };

        try {
            const res = await fetch(`${BASE_URL}/restaurant`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${await AsyncStorage.getItem("token")}`
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            Alert.alert("Success", "Restaurant created");

            // 👉 Navigate to Add Food screen with restaurantId
            navigation.navigate("AddFood", {
                restaurantId: data.data._id,
            });

        } catch (err) {
            Alert.alert("Error", err.message || "Failed to create restaurant");
        }
    };

    const handleUpdateRestaurant = async () => {
        try {
            const token = await AsyncStorage.getItem("token");

            const payload = {
                name: form.name,
                description: form.description,
                image: form.image ? [form.image] : [],
                address: {
                    fullAddress: form.fullAddress,
                    city: form.city,
                    pincode: form.pincode,
                    lat: Number(form.lat),
                    lng: Number(form.lng),
                },
                deliveryTime: Number(form.deliveryTime),
                deliveryCharge: Number(form.deliveryCharge),
                openTime: form.openTime,
                closeTime: form.closeTime,
                isOpen: form.isOpen,
            };

            const res = await fetch(`${BASE_URL}/restaurant`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            Alert.alert("Success", "Restaurant updated");
            setIsEditing(false);
            fetchRestaurant();
        } catch (err) {
            Alert.alert("Error", err.message);
        }
    };

    if (loading) {
        return <Text style={{ textAlign: "center", marginTop: 40 }}>Loading...</Text>;
    }

    if (restaurant && !isEditing) {
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.title}>{restaurant.name}</Text>

                <Text>Pincode: {restaurant.address?.pincode}</Text>
                <Text>Delivery Time: {restaurant.deliveryTime} min</Text>
                <Text>Delivery Charge: ₹{restaurant.deliveryCharge}</Text>
                <Text>Status: {restaurant.isOpen ? "Open" : "Closed"}</Text>

                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => setIsEditing(true)}
                >
                    <Text style={styles.btnText}>Edit Restaurant</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.btn, { backgroundColor: "#2ecc71" }]}
                    onPress={() =>
                        navigation.navigate("AddFood", {
                            restaurantId: restaurant._id,
                        })
                    }
                >
                    <Text style={styles.btnText}>Add Food</Text>
                </TouchableOpacity>

                <Text style={[styles.title, { marginTop: 20 }]}>Foods</Text>

                {foods.map((food) => (
                    <View key={food._id} style={styles.foodCard}>
                        <Text style={{ fontWeight: "700" }}>{food.name}</Text>
                        <Text>₹{food.price}</Text>
                        <Text>{food.isAvailable ? "Available" : "Out of stock"}</Text>

                        <TouchableOpacity
                            style={styles.editFoodBtn}
                            onPress={() =>
                                navigation.navigate("AddFood", { data:food })
                            }
                        >
                            <Text style={{ color: "#fff" }}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        );
    }


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>
                {restaurant ? "Edit Restaurant" : "Create Restaurant"}
            </Text>

            <Input label="Name" onChangeText={(v) => handleChange("name", v)} />
            <Input label="Description" onChangeText={(v) => handleChange("description", v)} />
            <Input label="Image URL" onChangeText={(v) => handleChange("image", v)} />

            <Input label="Full Address" onChangeText={(v) => handleChange("fullAddress", v)} />
            <Input label="City" onChangeText={(v) => handleChange("city", v)} />
            <Input label="Pincode" onChangeText={(v) => handleChange("pincode", v)} />

            <Input label="Latitude" keyboardType="numeric" onChangeText={(v) => handleChange("lat", v)} />
            <Input label="Longitude" keyboardType="numeric" onChangeText={(v) => handleChange("lng", v)} />

            <Input label="Delivery Time (min)" keyboardType="numeric" onChangeText={(v) => handleChange("deliveryTime", v)} />
            <Input label="Delivery Charge" keyboardType="numeric" onChangeText={(v) => handleChange("deliveryCharge", v)} />

            <Input label="Open Time (10:00)" onChangeText={(v) => handleChange("openTime", v)} />
            <Input label="Close Time (23:00)" onChangeText={(v) => handleChange("closeTime", v)} />

            <View style={styles.switchRow}>
                <Text>Restaurant Open</Text>
                <Switch
                    value={form.isOpen}
                    onValueChange={(v) => handleChange("isOpen", v)}
                />
            </View>

            <TouchableOpacity
                style={styles.btn}
                onPress={restaurant ? handleUpdateRestaurant : handleCreateRestaurant}
            >
                <Text style={styles.btnText}>
                    {restaurant ? "Update Restaurant" : "Create Restaurant"}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const Input = ({ label, ...props }) => (
    <>
        <Text style={styles.label}>{label}</Text>
        <TextInput style={styles.input} {...props} />
    </>
);

const styles = StyleSheet.create({
    container: { padding: 16 },
    title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
    label: { fontWeight: "600", marginTop: 10 },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 10,
        marginTop: 6,
    },
    switchRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 16,
    },
    btn: {
        backgroundColor: "#ff6347",
        padding: 14,
        borderRadius: 10,
        marginTop: 10,
    },
    btnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
    foodCard: {
        borderWidth: 1,
        borderColor: "#eee",
        padding: 12,
        borderRadius: 10,
        marginTop: 10,
    },
    editFoodBtn: {
        backgroundColor: "#3498db",
        padding: 8,
        borderRadius: 6,
        marginTop: 6,
        alignItems: "center",
    },
});
