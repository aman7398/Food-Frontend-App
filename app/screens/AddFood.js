import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Switch,
} from "react-native";

const BASE_URL = "http://localhost:5000/api/v1";

export default function AddFoodScreen({ route }) {
    const { restaurantId, data } = route.params;
    // console.log("data", data)
    const [food, setFood] = useState({
        name: "",
        price: "",
        category: "",
        image: "",
        description: "",
        isAvailable: true,
    });

    useEffect(() => {
        if (data) {
            setFood({
                name: data.name || "",
                price: String(data.price || ""),
                category: data.category || "",
                image: data.image?.[0] || "",
                description: data.description || "",
                isAvailable: data.isAvailable ?? true,
            });
        }
    }, [data]);

    const handleChange = (k, v) => setFood({ ...food, [k]: v });

    const handleAddEditFood = async () => {
        if (!food.name || !food.price) {
            return Alert.alert("Error", "Food name & price required");
        }

        const payload = {
            restaurantId,
            name: food.name,
            price: Number(food.price),
            category: food.category,
            image: food.image ? [food.image] : [],
            description: food.description,
            isAvailable: food.isAvailable,
        };

        try {
            const url = data._id ? `${BASE_URL}/foods/update-food/${data._id}` : `${BASE_URL}/foods/add-food`
            const res = await fetch(url, {
                method: data._id ? "PATCH" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${await AsyncStorage.getItem("token")}`
                },
                body: JSON.stringify(payload),
            });

            const resData = await res.json();
            if (!res.ok) throw new Error(resData.message);

            Alert.alert("Success", "Food added");
            setFood(food);

        } catch (err) {
            Alert.alert("Error", err.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Food Item</Text>

            <Input label="Food Name" value={food.name} onChangeText={(v) => handleChange("name", v)} />
            <Input label="Price" value={food.price} keyboardType="numeric" onChangeText={(v) => handleChange("price", v)} />
            <Input label="Category" value={food.category} onChangeText={(v) => handleChange("category", v)} />
            <Input label="Image URL" value={food.image} onChangeText={(v) => handleChange("image", v)} />
            <Input label="Description" value={food.description} onChangeText={(v) => handleChange("description", v)} />

            <View style={styles.switchRow}>
                <Text>Available</Text>
                <Switch
                    value={food.isAvailable}
                    onValueChange={(v) => handleChange("isAvailable", v)}
                />
            </View>

            <TouchableOpacity style={styles.btn} onPress={handleAddEditFood}>
                <Text style={styles.btnText}>{data._id ? "Update Food" : "Add Food"}</Text>
            </TouchableOpacity>
        </View>
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
        backgroundColor: "#4CAF50",
        padding: 14,
        borderRadius: 10,
    },
    btnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
});
