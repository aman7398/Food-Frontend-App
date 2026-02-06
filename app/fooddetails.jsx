import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    FlatList,
} from "react-native";

const FOOD_ITEMS = [
    { id: 1, name: "Paneer Butter Masala", price: 299, rating: 4.5, reviews: 156, emoji: "🍲", desc: "Creamy and delicious paneer curry with butter and cream", cuisine: "North Indian" },
    { id: 2, name: "Garlic Naan", price: 79, rating: 4.8, reviews: 245, emoji: "🥖", desc: "Soft and fluffy naan bread with garlic butter", cuisine: "Breads" },
    { id: 3, name: "Chicken Tikka Masala", price: 349, rating: 4.6, reviews: 189, emoji: "🍗", desc: "Tender chicken pieces in a creamy tomato sauce", cuisine: "Non-Veg" },
    { id: 4, name: "Dal Makhani", price: 249, rating: 4.4, reviews: 102, emoji: "🥘", desc: "Rich and buttery lentil curry cooked overnight", cuisine: "Veg" },
    { id: 5, name: "Biryani Rice", price: 249, rating: 4.7, reviews: 367, emoji: "🍚", desc: "Aromatic basmati rice cooked with spices", cuisine: "Rice" },
    { id: 6, name: "Rasgulla", price: 129, rating: 4.9, reviews: 234, emoji: "🍮", desc: "Soft and spongy cheese balls in sugar syrup", cuisine: "Desserts" },
];

export default function FoodDetails({ selectedFoodId, onClose, onAddToCart }) {
    const [quantity, setQuantity] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("all");

    const selectedFood = FOOD_ITEMS.find((item) => item.id === selectedFoodId);
    const filteredFoods = selectedCategory === "all"
        ? FOOD_ITEMS
        : FOOD_ITEMS.filter((f) => f.cuisine === selectedCategory);

    if (!selectedFood) {
        return null;
    }

    const categories = ["all", "North Indian", "Veg", "Non-Veg", "Breads", "Rice", "Desserts"];

    const renderFoodCard = ({ item }) => (
        <TouchableOpacity activeOpacity={0.8} style={styles.foodCard}>
            <View style={styles.foodCardImage}>
                <Text style={styles.foodEmoji}>{item.emoji}</Text>
            </View>
            <View style={styles.foodCardContent}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodCuisine}>{item.cuisine}</Text>
                <View style={styles.foodCardBottom}>
                    <Text style={styles.foodPrice}>₹{item.price}</Text>
                    <View style={styles.ratingSmall}>
                        <Text style={styles.ratingSmallText}>⭐ {item.rating}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>🍽️ Menu</Text>
                <View style={{ width: 50 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
                {/* Featured Food Details */}
                <View style={styles.featuredSection}>
                    <View style={styles.featuredImage}>
                        <Text style={styles.largeEmoji}>{selectedFood.emoji}</Text>
                    </View>

                    <View style={styles.detailsCard}>
                        <Text style={styles.foodTitle}>{selectedFood.name}</Text>
                        <Text style={styles.foodDescription}>{selectedFood.desc}</Text>

                        {/* Rating and Reviews */}
                        <View style={styles.ratingRow}>
                            <View style={styles.ratingBadge}>
                                <Text style={styles.ratingBadgeText}>⭐ {selectedFood.rating}</Text>
                            </View>
                            <Text style={styles.reviewsText}>({selectedFood.reviews} reviews)</Text>
                        </View>

                        {/* Price and Category */}
                        <View style={styles.priceRow}>
                            <Text style={styles.price}>₹{selectedFood.price}</Text>
                            <View style={styles.categoryBadge}>
                                <Text style={styles.categoryBadgeText}>{selectedFood.cuisine}</Text>
                            </View>
                        </View>

                        {/* Quantity Selector */}
                        <View style={styles.quantitySection}>
                            <Text style={styles.quantityLabel}>Quantity</Text>
                            <View style={styles.quantityControls}>
                                <TouchableOpacity
                                    style={styles.quantityBtn}
                                    onPress={() => {
                                        if (quantity > 1) {
                                            setQuantity(quantity - 1);
                                        }
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.quantityBtnText}>−</Text>
                                </TouchableOpacity>
                                <Text style={styles.quantityValue}>{quantity}</Text>
                                <TouchableOpacity
                                    style={styles.quantityBtn}
                                    onPress={() => setQuantity(quantity + 1)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.quantityBtnText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Add to Cart Button */}
                        <TouchableOpacity
                            style={styles.addToCartButton}
                            onPress={() => {
                                onAddToCart(selectedFood.id, quantity);
                                setQuantity(1);
                                onClose();
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.addToCartButtonText}>🛒 Add to Cart (₹{selectedFood.price * quantity})</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* More Items Section */}
                <View style={styles.moreItemsSection}>
                    <Text style={styles.sectionTitle}>More Items</Text>

                    {/* Category Filter */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.categoryScroll}
                    >
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category}
                                style={[
                                    styles.categoryFilterButton,
                                    selectedCategory === category ? styles.categoryFilterButtonActive : null,
                                ]}
                                onPress={() => setSelectedCategory(category)}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[
                                        styles.categoryFilterText,
                                        selectedCategory === category ? styles.categoryFilterTextActive : null,
                                    ]}
                                >
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Food Grid */}
                    <FlatList
                        scrollEnabled={false}
                        data={filteredFoods}
                        renderItem={renderFoodCard}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        columnWrapperStyle={styles.foodGrid}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    backButton: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FF9800",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#1F1F1F",
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    featuredSection: {
        marginBottom: 20,
    },
    featuredImage: {
        width: "100%",
        height: 200,
        backgroundColor: "#FFF3E0",
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        elevation: 4,
        shadowColor: "#FF9800",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    largeEmoji: {
        fontSize: 100,
    },
    detailsCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#F0F0F0",
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    foodTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#1F1F1F",
        marginBottom: 8,
    },
    foodDescription: {
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
        marginBottom: 12,
        fontWeight: "500",
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    ratingBadge: {
        backgroundColor: "#FFF3E0",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        marginRight: 8,
    },
    ratingBadgeText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#FF9800",
    },
    reviewsText: {
        fontSize: 13,
        color: "#666",
        fontWeight: "500",
    },
    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#F0F0F0",
    },
    price: {
        fontSize: 24,
        fontWeight: "800",
        color: "#FF9800",
    },
    categoryBadge: {
        backgroundColor: "#E3F2FD",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    categoryBadgeText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#2196F3",
    },
    quantitySection: {
        marginBottom: 16,
    },
    quantityLabel: {
        fontSize: 14,
        fontWeight: "700",
        color: "#1F1F1F",
        marginBottom: 8,
    },
    quantityControls: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        borderRadius: 10,
        padding: 8,
    },
    quantityBtn: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: "#FF9800",
        justifyContent: "center",
        alignItems: "center",
    },
    quantityBtnText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    quantityValue: {
        flex: 1,
        textAlign: "center",
        fontSize: 16,
        fontWeight: "700",
        color: "#1F1F1F",
    },
    addToCartButton: {
        backgroundColor: "#FF9800",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        elevation: 3,
        shadowColor: "#FF9800",
        shadowOpacity: 0.3,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },
    addToCartButtonText: {
        fontSize: 16,
        fontWeight: "800",
        color: "#FFFFFF",
    },
    moreItemsSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#1F1F1F",
        marginBottom: 12,
    },
    categoryScroll: {
        marginBottom: 16,
    },
    categoryFilterButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: "#F5F5F5",
        marginRight: 10,
        borderWidth: 2,
        borderColor: "transparent",
    },
    categoryFilterButtonActive: {
        backgroundColor: "#FFF3E0",
        borderColor: "#FF9800",
    },
    categoryFilterText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#666",
    },
    categoryFilterTextActive: {
        color: "#FF9800",
        fontWeight: "700",
    },
    foodGrid: {
        justifyContent: "space-between",
        marginBottom: 12,
    },
    foodCard: {
        width: "48%",
        backgroundColor: "#F9F9F9",
        borderRadius: 12,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#F0F0F0",
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
    },
    foodCardImage: {
        width: "100%",
        height: 100,
        backgroundColor: "#FFF3E0",
        justifyContent: "center",
        alignItems: "center",
    },
    foodEmoji: {
        fontSize: 48,
    },
    foodCardContent: {
        padding: 10,
    },
    foodName: {
        fontSize: 13,
        fontWeight: "700",
        color: "#1F1F1F",
        marginBottom: 4,
    },
    foodCuisine: {
        fontSize: 11,
        color: "#666",
        marginBottom: 8,
    },
    foodCardBottom: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    foodPrice: {
        fontSize: 13,
        fontWeight: "700",
        color: "#FF9800",
    },
    ratingSmall: {
        backgroundColor: "#FFF3E0",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    ratingSmallText: {
        fontSize: 10,
        fontWeight: "700",
        color: "#FF9800",
    },
});
