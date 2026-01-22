import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    FlatList,
} from "react-native";

const SAMPLE_ORDERS = [
    {
        id: "ORD-1704067200",
        date: "2024-01-01",
        restaurant: "Spice Garden",
        items: ["Paneer Butter Masala", "Garlic Naan"],
        total: 429,
        status: "Delivered",
        rating: 4.5,
        delivery_time: "35 mins",
        emoji: "🍱",
    },
    {
        id: "ORD-1704153600",
        date: "2024-01-02",
        restaurant: "Burger Palace",
        items: ["Classic Burger", "Fries", "Coke"],
        total: 329,
        status: "Delivered",
        rating: 4.3,
        delivery_time: "22 mins",
        emoji: "🍔",
    },
    {
        id: "ORD-1704240000",
        date: "2024-01-03",
        restaurant: "Pizza Hub",
        items: ["Margherita Pizza", "Garlic Bread"],
        total: 549,
        status: "Delivered",
        rating: 4.6,
        delivery_time: "38 mins",
        emoji: "🍕",
    },
    {
        id: "ORD-1704326400",
        date: "2024-01-04",
        restaurant: "Noodle Express",
        items: ["Hakka Noodles", "Spring Rolls"],
        total: 279,
        status: "Cancelled",
        rating: null,
        delivery_time: "N/A",
        emoji: "🍜",
    },
    {
        id: "ORD-1704412800",
        date: "2024-01-05",
        restaurant: "Dessert Delight",
        items: ["Rasgulla", "Gulab Jamun", "Kheer"],
        total: 399,
        status: "Delivered",
        rating: 4.7,
        delivery_time: "12 mins",
        emoji: "🍰",
    },
];

export default function Orders({ onClose, onReorder }) {
    const [filterStatus, setFilterStatus] = useState("All");
    const [selectedOrder, setSelectedOrder] = useState(null);

    const statuses = ["All", "Delivered", "Cancelled", "In Progress"];

    const filteredOrders =
        filterStatus === "All"
            ? SAMPLE_ORDERS
            : SAMPLE_ORDERS.filter((order) => order.status === filterStatus);

    const renderOrderCard = ({ item }) => (
        <TouchableOpacity
            style={styles.orderCard}
            onPress={() => setSelectedOrder(item)}
            activeOpacity={0.7}
        >
            <View style={styles.orderCardHeader}>
                <View style={styles.restaurantInfo}>
                    <View style={styles.restaurantEmoji}>
                        <Text style={styles.emojiText}>{item.emoji}</Text>
                    </View>
                    <View style={styles.restaurantDetails}>
                        <Text style={styles.restaurantName}>{item.restaurant}</Text>
                        <Text style={styles.orderId}>{item.id}</Text>
                    </View>
                </View>
                <View style={styles.statusBadge}>
                    <Text
                        style={[
                            styles.statusText,
                            item.status === "Delivered" && styles.statusDelivered,
                            item.status === "Cancelled" && styles.statusCancelled,
                        ]}
                    >
                        {item.status === "Delivered" ? "✓" : item.status === "Cancelled" ? "✕" : "⏳"}
                    </Text>
                </View>
            </View>

            <View style={styles.orderCardBody}>
                <Text style={styles.itemsLabel}>Items ordered:</Text>
                {item.items.map((itemName, index) => (
                    <Text key={index} style={styles.itemText}>
                        • {itemName}
                    </Text>
                ))}
            </View>

            <View style={styles.orderCardFooter}>
                <View style={styles.orderStats}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>₹{item.total}</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>{item.delivery_time}</Text>
                    </View>
                    {item.rating && (
                        <>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>⭐ {item.rating}</Text>
                            </View>
                        </>
                    )}
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
                <Text style={styles.headerTitle}>📋 Orders</Text>
                <View style={{ width: 50 }} />
            </View>

            {/* Status Filter */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterScroll}
            >
                {statuses.map((status) => (
                    <TouchableOpacity
                        key={status}
                        style={[
                            styles.filterButton,
                            filterStatus === status && styles.filterButtonActive,
                        ]}
                        onPress={() => setFilterStatus(status)}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                filterStatus === status && styles.filterTextActive,
                            ]}
                        >
                            {status}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Orders List */}
            {filteredOrders.length > 0 ? (
                <FlatList
                    data={filteredOrders}
                    renderItem={renderOrderCard}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.ordersList}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyEmoji}>📭</Text>
                    <Text style={styles.emptyText}>No {filterStatus.toLowerCase()} orders</Text>
                    <Text style={styles.emptySubtext}>Start ordering delicious food now!</Text>
                </View>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Modal Header */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>📦 Order Details</Text>
                            <TouchableOpacity
                                onPress={() => setSelectedOrder(null)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.closeButton}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                            {/* Order Info */}
                            <View style={styles.modalSection}>
                                <View style={styles.modalSectionHeader}>
                                    <View style={styles.restaurantEmoji}>
                                        <Text style={styles.emojiText}>{selectedOrder.emoji}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.modalRestaurantName}>
                                            {selectedOrder.restaurant}
                                        </Text>
                                        <Text style={styles.modalOrderId}>{selectedOrder.id}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Items */}
                            <View style={styles.modalSection}>
                                <Text style={styles.modalSectionTitle}>Items</Text>
                                {selectedOrder.items.map((item, index) => (
                                    <View key={index} style={styles.modalItem}>
                                        <Text style={styles.modalItemName}>{item}</Text>
                                        <Text style={styles.modalItemPrice}>₹99</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Order Timeline */}
                            <View style={styles.modalSection}>
                                <Text style={styles.modalSectionTitle}>Order Timeline</Text>
                                <View style={styles.timeline}>
                                    <View style={styles.timelineItem}>
                                        <View style={styles.timelineMarker}>
                                            <Text style={styles.timelineIcon}>✓</Text>
                                        </View>
                                        <View style={styles.timelineContent}>
                                            <Text style={styles.timelineLabel}>Order Placed</Text>
                                            <Text style={styles.timelineTime}>
                                                {new Date(selectedOrder.date).toLocaleDateString()}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.timelineItem}>
                                        <View style={[styles.timelineMarker, styles.timelineMarkerActive]}>
                                            <Text style={styles.timelineIcon}>✓</Text>
                                        </View>
                                        <View style={styles.timelineContent}>
                                            <Text style={styles.timelineLabel}>Confirmed</Text>
                                            <Text style={styles.timelineTime}>5 mins later</Text>
                                        </View>
                                    </View>

                                    <View style={styles.timelineItem}>
                                        <View
                                            style={[
                                                styles.timelineMarker,
                                                selectedOrder.status === "Delivered" &&
                                                styles.timelineMarkerActive,
                                            ]}
                                        >
                                            <Text style={styles.timelineIcon}>
                                                {selectedOrder.status === "Delivered" ? "✓" : "⏳"}
                                            </Text>
                                        </View>
                                        <View style={styles.timelineContent}>
                                            <Text style={styles.timelineLabel}>
                                                {selectedOrder.status === "Delivered"
                                                    ? "Delivered"
                                                    : "In Delivery"}
                                            </Text>
                                            <Text style={styles.timelineTime}>
                                                {selectedOrder.delivery_time}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Total */}
                            <View style={styles.modalSection}>
                                <View style={styles.totalRow}>
                                    <Text style={styles.totalLabel}>Total Paid</Text>
                                    <Text style={styles.totalValue}>₹{selectedOrder.total}</Text>
                                </View>
                            </View>

                            {/* Actions */}
                            <View style={styles.modalActions}>
                                {selectedOrder.status === "Delivered" && (
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => {
                                            setSelectedOrder(null);
                                            if (onReorder) onReorder(selectedOrder);
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.actionButtonText}>🔄 Reorder</Text>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity
                                    style={[styles.actionButton, styles.actionButtonSecondary]}
                                    onPress={() => setSelectedOrder(null)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.actionButtonSecondaryText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            )}
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
    filterScroll: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    filterButton: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: "#F5F5F5",
        marginRight: 10,
        borderWidth: 2,
        borderColor: "transparent",
    },
    filterButtonActive: {
        backgroundColor: "#FFF3E0",
        borderColor: "#FF9800",
    },
    filterText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#666",
    },
    filterTextActive: {
        color: "#FF9800",
        fontWeight: "700",
    },
    ordersList: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    orderCard: {
        backgroundColor: "#F9F9F9",
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#F0F0F0",
        overflow: "hidden",
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
    },
    orderCardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    restaurantInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    restaurantEmoji: {
        width: 44,
        height: 44,
        borderRadius: 8,
        backgroundColor: "#FFF3E0",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    emojiText: {
        fontSize: 24,
    },
    restaurantDetails: {
        flex: 1,
    },
    restaurantName: {
        fontSize: 14,
        fontWeight: "700",
        color: "#1F1F1F",
    },
    orderId: {
        fontSize: 11,
        color: "#999",
        marginTop: 2,
    },
    statusBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF3E0",
    },
    statusText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FF9800",
    },
    statusDelivered: {
        color: "#4CAF50",
    },
    statusCancelled: {
        color: "#F44336",
    },
    orderCardBody: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    itemsLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: "#666",
        marginBottom: 6,
    },
    itemText: {
        fontSize: 12,
        color: "#1F1F1F",
        marginBottom: 4,
    },
    orderCardFooter: {
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    orderStats: {
        flexDirection: "row",
        alignItems: "center",
    },
    statItem: {
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: "#1F1F1F",
        textAlign: "center",
    },
    statDivider: {
        width: 1,
        height: 16,
        backgroundColor: "#DDD",
        marginHorizontal: 8,
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1F1F1F",
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 13,
        color: "#999",
    },
    modalOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: "85%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#1F1F1F",
    },
    closeButton: {
        fontSize: 24,
        color: "#999",
    },
    modalScroll: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    modalSection: {
        marginBottom: 16,
    },
    modalSectionHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    modalRestaurantName: {
        fontSize: 16,
        fontWeight: "800",
        color: "#1F1F1F",
    },
    modalOrderId: {
        fontSize: 12,
        color: "#999",
        marginTop: 4,
    },
    modalSectionTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#1F1F1F",
        marginBottom: 10,
    },
    modalItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    modalItemName: {
        fontSize: 13,
        color: "#666",
        fontWeight: "500",
    },
    modalItemPrice: {
        fontSize: 13,
        fontWeight: "700",
        color: "#1F1F1F",
    },
    timeline: {
        marginLeft: 12,
    },
    timelineItem: {
        flexDirection: "row",
        marginBottom: 16,
    },
    timelineMarker: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#F0F0F0",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
        marginTop: -8,
    },
    timelineMarkerActive: {
        backgroundColor: "#4CAF50",
    },
    timelineIcon: {
        fontSize: 14,
        color: "#999",
        fontWeight: "700",
    },
    timelineContent: {
        flex: 1,
        paddingVertical: 4,
    },
    timelineLabel: {
        fontSize: 13,
        fontWeight: "700",
        color: "#1F1F1F",
    },
    timelineTime: {
        fontSize: 12,
        color: "#999",
        marginTop: 2,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: "#F0F0F0",
    },
    totalLabel: {
        fontSize: 14,
        fontWeight: "700",
        color: "#1F1F1F",
    },
    totalValue: {
        fontSize: 16,
        fontWeight: "800",
        color: "#FF9800",
    },
    modalActions: {
        paddingTop: 12,
        paddingBottom: 20,
    },
    actionButton: {
        backgroundColor: "#FF9800",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 10,
    },
    actionButtonSecondary: {
        backgroundColor: "#F5F5F5",
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    actionButtonSecondaryText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#1F1F1F",
    },
});
