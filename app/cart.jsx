import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Modal,
} from "react-native";

export default function Cart({ cartItems, restaurants, onClose, onProceedToPayment }) {
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponInput, setCouponInput] = useState("");
    const [addresses] = useState([
        { id: 1, label: "Home", address: "123 Main Street, New Delhi 110001", active: true },
        { id: 2, label: "Work", address: "456 Office Plaza, New Delhi 110002", active: false },
    ]);
    const [selectedAddress, setSelectedAddress] = useState(1);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const getCartItems = () => {
        const items = [];
        restaurants.forEach((restaurant) => {
            if (cartItems[restaurant.id]) {
                items.push({
                    ...restaurant,
                    quantity: cartItems[restaurant.id],
                    price: 299 + restaurant.id * 50, // Mock price
                });
            }
        });
        return items;
    };

    const cartItemsList = getCartItems();
    const subtotal = cartItemsList.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = appliedCoupon ? Math.floor(subtotal * 0.1) : 0;
    const deliveryFee = subtotal > 500 ? 0 : 40;
    const tax = Math.floor(subtotal * 0.05);
    const total = subtotal - discount + deliveryFee + tax;

    const applyCoupon = () => {
        if (couponInput.toLowerCase() === "save10") {
            setAppliedCoupon("SAVE10");
            setCouponInput("");
        } else {
            setAppliedCoupon(null);
        }
    };

    const renderCartItem = ({ item }) => (
        <View style={styles.cartItemCard}>
            <View style={styles.itemImageSection}>
                <View style={styles.itemEmoji}>
                    <Text style={styles.emojiText}>{item.emoji}</Text>
                </View>
            </View>
            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>₹{item.price}</Text>
            </View>
            <View style={styles.quantityDisplay}>
                <Text style={styles.quantityText}>x{item.quantity}</Text>
                <Text style={styles.itemTotal}>₹{item.price * item.quantity}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>🛒 Cart</Text>
                <View style={{ width: 50 }} />
            </View>

            {cartItemsList.length > 0 ? (
                <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
                    {/* Cart Items */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Your Items</Text>
                        <FlatList
                            scrollEnabled={false}
                            data={cartItemsList}
                            renderItem={renderCartItem}
                            keyExtractor={(item) => item.id.toString()}
                        />
                    </View>

                    {/* Delivery Address */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.sectionTitle}>📍 Delivery Address</Text>
                            <TouchableOpacity onPress={() => setShowAddressModal(true)}>
                                <Text style={styles.changeLink}>Change</Text>
                            </TouchableOpacity>
                        </View>
                        {addresses.find((a) => a.id === selectedAddress) && (
                            <View style={styles.addressBox}>
                                <Text style={styles.addressLabel}>
                                    {addresses.find((a) => a.id === selectedAddress)?.label}
                                </Text>
                                <Text style={styles.addressText}>
                                    {addresses.find((a) => a.id === selectedAddress)?.address}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Coupon Code */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🎟️ Coupon Code</Text>
                        <View style={styles.couponRow}>
                            <View style={styles.couponInputContainer}>
                                <Text style={styles.couponIcon}>🏷️</Text>
                                <View style={styles.couponInput}>
                                    <Text style={styles.couponPlaceholder}>
                                        {appliedCoupon ? appliedCoupon : "Enter coupon (Try 'save10')"}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.applyButton}
                                onPress={applyCoupon}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.applyButtonText}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Bill Details */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>💵 Bill Details</Text>
                        <View style={styles.billContainer}>
                            <View style={styles.billRow}>
                                <Text style={styles.billLabel}>Subtotal</Text>
                                <Text style={styles.billValue}>₹{subtotal}</Text>
                            </View>
                            {discount > 0 && (
                                <View style={[styles.billRow, styles.discountRow]}>
                                    <Text style={styles.discountLabel}>Discount</Text>
                                    <Text style={styles.discountValue}>-₹{discount}</Text>
                                </View>
                            )}
                            <View style={styles.billRow}>
                                <Text style={styles.billLabel}>Delivery Fee</Text>
                                <Text style={deliveryFee === 0 ? styles.freeText : styles.billValue}>
                                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                                </Text>
                            </View>
                            <View style={styles.billRow}>
                                <Text style={styles.billLabel}>Tax</Text>
                                <Text style={styles.billValue}>₹{tax}</Text>
                            </View>
                            <View style={styles.billDivider} />
                            <View style={[styles.billRow, styles.totalRow]}>
                                <Text style={styles.totalLabel}>Total to Pay</Text>
                                <Text style={styles.totalValue}>₹{total}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            ) : (
                <View style={styles.emptyCart}>
                    <Text style={styles.emptyCartEmoji}>🛒</Text>
                    <Text style={styles.emptyCartText}>Your cart is empty</Text>
                    <Text style={styles.emptyCartSubtext}>Add items to get started</Text>
                </View>
            )}

            {/* Proceed Button */}
            {cartItemsList.length > 0 && (
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.proceedButton}
                        onPress={() => onProceedToPayment({ cartItems: cartItemsList, total, address: selectedAddress })}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Address Selection Modal */}
            <Modal
                visible={showAddressModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowAddressModal(false)}
            >
                <View style={styles.addressModalContainer}>
                    <View style={styles.addressModalHeader}>
                        <TouchableOpacity onPress={() => setShowAddressModal(false)}>
                            <Text style={styles.backButton}>← Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Select Address</Text>
                        <View style={{ width: 50 }} />
                    </View>
                    <ScrollView style={styles.addressModalContent} showsVerticalScrollIndicator={false}>
                        {addresses.map((addr) => (
                            <TouchableOpacity
                                key={addr.id}
                                style={[
                                    styles.addressOption,
                                    selectedAddress === addr.id && styles.addressOptionActive,
                                ]}
                                onPress={() => {
                                    setSelectedAddress(addr.id);
                                    setShowAddressModal(false);
                                }}
                            >
                                <View style={styles.addressOptionRadio}>
                                    {selectedAddress === addr.id && <View style={styles.radioInner} />}
                                </View>
                                <View style={styles.addressOptionContent}>
                                    <Text style={styles.addressOptionLabel}>{addr.label}</Text>
                                    <Text style={styles.addressOptionText}>{addr.address}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </Modal>
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
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1F1F1F",
        marginBottom: 12,
    },
    sectionHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    changeLink: {
        fontSize: 13,
        fontWeight: "600",
        color: "#FF9800",
    },
    cartItemCard: {
        flexDirection: "row",
        backgroundColor: "#F9F9F9",
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#F0F0F0",
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
    },
    itemImageSection: {
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    itemEmoji: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: "#FFF3E0",
        justifyContent: "center",
        alignItems: "center",
    },
    emojiText: {
        fontSize: 28,
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 14,
        fontWeight: "700",
        color: "#1F1F1F",
    },
    itemPrice: {
        fontSize: 13,
        fontWeight: "600",
        color: "#FF9800",
        marginTop: 4,
    },
    quantityDisplay: {
        justifyContent: "center",
        alignItems: "flex-end",
    },
    quantityText: {
        fontSize: 13,
        fontWeight: "700",
        color: "#1F1F1F",
    },
    itemTotal: {
        fontSize: 12,
        fontWeight: "600",
        color: "#666",
        marginTop: 4,
    },
    addressBox: {
        backgroundColor: "#FFF3E0",
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: "#FFE0B2",
    },
    addressLabel: {
        fontSize: 14,
        fontWeight: "700",
        color: "#FF9800",
        marginBottom: 4,
    },
    addressText: {
        fontSize: 13,
        color: "#1F1F1F",
        lineHeight: 18,
    },
    couponRow: {
        flexDirection: "row",
        gap: 10,
    },
    couponInputContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        borderRadius: 10,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "#F0F0F0",
    },
    couponIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    couponInput: {
        flex: 1,
        justifyContent: "center",
    },
    couponPlaceholder: {
        fontSize: 13,
        color: "#999",
        fontWeight: "500",
    },
    applyButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: "#FF9800",
        borderRadius: 10,
        justifyContent: "center",
    },
    applyButtonText: {
        fontSize: 13,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    billContainer: {
        backgroundColor: "#F9F9F9",
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: "#F0F0F0",
    },
    billRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    billLabel: {
        fontSize: 14,
        color: "#666",
        fontWeight: "500",
    },
    billValue: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1F1F1F",
    },
    discountRow: {
        marginBottom: 10,
    },
    discountLabel: {
        fontSize: 14,
        color: "#4CAF50",
        fontWeight: "500",
    },
    discountValue: {
        fontSize: 14,
        fontWeight: "600",
        color: "#4CAF50",
    },
    freeText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#4CAF50",
    },
    billDivider: {
        height: 1,
        backgroundColor: "#E0E0E0",
        marginVertical: 10,
    },
    totalRow: {
        paddingVertical: 6,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: "800",
        color: "#1F1F1F",
    },
    totalValue: {
        fontSize: 16,
        fontWeight: "800",
        color: "#FF9800",
    },
    footer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: "#F0F0F0",
    },
    proceedButton: {
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
    proceedButtonText: {
        fontSize: 16,
        fontWeight: "800",
        color: "#FFFFFF",
    },
    emptyCart: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    emptyCartEmoji: {
        fontSize: 80,
        marginBottom: 20,
    },
    emptyCartText: {
        fontSize: 20,
        fontWeight: "800",
        color: "#1F1F1F",
        marginBottom: 8,
    },
    emptyCartSubtext: {
        fontSize: 14,
        color: "#999",
    },
    addressModalContainer: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    addressModalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#1F1F1F",
    },
    addressModalContent: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    addressOption: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F9F9F9",
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: "transparent",
    },
    addressOptionActive: {
        borderColor: "#FF9800",
        backgroundColor: "#FFF8F3",
    },
    addressOptionRadio: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#FF9800",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#FF9800",
    },
    addressOptionContent: {
        flex: 1,
    },
    addressOptionLabel: {
        fontSize: 14,
        fontWeight: "700",
        color: "#1F1F1F",
    },
    addressOptionText: {
        fontSize: 13,
        color: "#666",
        marginTop: 4,
    },
});
