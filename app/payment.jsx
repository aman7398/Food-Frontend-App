import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Modal,
} from "react-native";

export default function Payment({ orderData, onClose, onPaymentSuccess }) {
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = () => {
        if (paymentMethod === "card") {
            setShowOtpModal(true);
        } else {
            processPayment();
        }
    };

    const processPayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setShowOtpModal(false);
            if (onPaymentSuccess) {
                onPaymentSuccess({
                    orderId: `ORD-${Date.now()}`,
                    paymentMethod,
                    amount: orderData.total,
                    timestamp: new Date(),
                });
            }
        }, 2000);
    };

    const handleOtpSubmit = () => {
        if (otp.length === 4) {
            processPayment();
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>💳 Payment</Text>
                <View style={{ width: 50 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
                {/* Order Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📋 Order Summary</Text>
                    <View style={styles.summaryCard}>
                        {orderData.cartItems?.map((item, index) => (
                            <View key={index} style={styles.summaryItem}>
                                <Text style={styles.summaryItemName}>{item.name}</Text>
                                <Text style={styles.summaryItemPrice}>₹{item.price * item.quantity}</Text>
                            </View>
                        ))}
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryTotal}>
                            <Text style={styles.summaryTotalLabel}>Total Amount</Text>
                            <Text style={styles.summaryTotalValue}>₹{orderData.total}</Text>
                        </View>
                    </View>
                </View>

                {/* Delivery Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📍 Delivery Details</Text>
                    <View style={styles.detailsCard}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>📦 Estimated Delivery</Text>
                            <Text style={styles.detailValue}>30-45 mins</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>📍 Delivery Location</Text>
                            <Text style={styles.detailValue}>Home</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>👨‍💼 Delivery Partner</Text>
                            <Text style={styles.detailValue}>Will assign soon</Text>
                        </View>
                    </View>
                </View>

                {/* Payment Method Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>💳 Payment Method</Text>

                    {/* Credit/Debit Card */}
                    <TouchableOpacity
                        style={[styles.paymentOption, paymentMethod === "card" && styles.paymentOptionActive]}
                        onPress={() => setPaymentMethod("card")}
                        activeOpacity={0.7}
                    >
                        <View style={styles.paymentOptionRadio}>
                            {paymentMethod === "card" && <View style={styles.radioInner} />}
                        </View>
                        <View style={styles.paymentOptionContent}>
                            <Text style={styles.paymentOptionTitle}>💳 Credit/Debit Card</Text>
                            <Text style={styles.paymentOptionSubtitle}>Visa, Mastercard, Rupay</Text>
                        </View>
                    </TouchableOpacity>

                    {/* UPI */}
                    <TouchableOpacity
                        style={[styles.paymentOption, paymentMethod === "upi" && styles.paymentOptionActive]}
                        onPress={() => setPaymentMethod("upi")}
                        activeOpacity={0.7}
                    >
                        <View style={styles.paymentOptionRadio}>
                            {paymentMethod === "upi" && <View style={styles.radioInner} />}
                        </View>
                        <View style={styles.paymentOptionContent}>
                            <Text style={styles.paymentOptionTitle}>📱 UPI</Text>
                            <Text style={styles.paymentOptionSubtitle}>Google Pay, PhonePe, PayTM</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Net Banking */}
                    <TouchableOpacity
                        style={[styles.paymentOption, paymentMethod === "netbanking" && styles.paymentOptionActive]}
                        onPress={() => setPaymentMethod("netbanking")}
                        activeOpacity={0.7}
                    >
                        <View style={styles.paymentOptionRadio}>
                            {paymentMethod === "netbanking" && <View style={styles.radioInner} />}
                        </View>
                        <View style={styles.paymentOptionContent}>
                            <Text style={styles.paymentOptionTitle}>🏦 Net Banking</Text>
                            <Text style={styles.paymentOptionSubtitle}>All major banks supported</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Wallet */}
                    <TouchableOpacity
                        style={[styles.paymentOption, paymentMethod === "wallet" && styles.paymentOptionActive]}
                        onPress={() => setPaymentMethod("wallet")}
                        activeOpacity={0.7}
                    >
                        <View style={styles.paymentOptionRadio}>
                            {paymentMethod === "wallet" && <View style={styles.radioInner} />}
                        </View>
                        <View style={styles.paymentOptionContent}>
                            <Text style={styles.paymentOptionTitle}>💰 Wallet</Text>
                            <Text style={styles.paymentOptionSubtitle}>Available balance: ₹2,500</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Cash on Delivery */}
                    <TouchableOpacity
                        style={[styles.paymentOption, paymentMethod === "cod" && styles.paymentOptionActive]}
                        onPress={() => setPaymentMethod("cod")}
                        activeOpacity={0.7}
                    >
                        <View style={styles.paymentOptionRadio}>
                            {paymentMethod === "cod" && <View style={styles.radioInner} />}
                        </View>
                        <View style={styles.paymentOptionContent}>
                            <Text style={styles.paymentOptionTitle}>💵 Cash on Delivery</Text>
                            <Text style={styles.paymentOptionSubtitle}>Pay when your order arrives</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Card Details (if card selected) */}
                {paymentMethod === "card" && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🔐 Card Details</Text>
                        <View style={styles.cardDetailsContainer}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Card Number</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="1234 5678 9012 3456"
                                    placeholderTextColor="#CCC"
                                    maxLength={19}
                                />
                            </View>
                            <View style={styles.rowInputs}>
                                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                                    <Text style={styles.label}>Expiry</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="MM/YY"
                                        placeholderTextColor="#CCC"
                                        maxLength={5}
                                    />
                                </View>
                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Text style={styles.label}>CVV</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="123"
                                        placeholderTextColor="#CCC"
                                        maxLength={3}
                                    />
                                </View>
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Cardholder Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="John Doe"
                                    placeholderTextColor="#CCC"
                                />
                            </View>
                        </View>
                    </View>
                )}

                {/* Security Info */}
                <View style={styles.section}>
                    <View style={styles.securityInfo}>
                        <Text style={styles.securityIcon}>🔒</Text>
                        <View style={styles.securityContent}>
                            <Text style={styles.securityTitle}>Your payment is secure</Text>
                            <Text style={styles.securityText}>All transactions are encrypted and verified</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Pay Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
                    onPress={handlePayment}
                    activeOpacity={0.8}
                    disabled={isProcessing}
                >
                    <Text style={styles.payButtonText}>
                        {isProcessing ? "Processing..." : `Pay ₹${orderData.total}`}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* OTP Modal */}
            <Modal visible={showOtpModal} transparent={true} animationType="slide">
                <View style={styles.otpModalContainer}>
                    <View style={styles.otpModalContent}>
                        <Text style={styles.otpTitle}>🔐 Enter OTP</Text>
                        <Text style={styles.otpSubtitle}>
                            We have sent a 4-digit OTP to your registered email
                        </Text>

                        <View style={styles.otpInputContainer}>
                            <TextInput
                                style={styles.otpInput}
                                placeholder="0000"
                                placeholderTextColor="#CCC"
                                maxLength={4}
                                keyboardType="numeric"
                                value={otp}
                                onChangeText={setOtp}
                                textAlign="center"
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.otpVerifyButton, otp.length !== 4 && styles.otpVerifyButtonDisabled]}
                            onPress={handleOtpSubmit}
                            disabled={otp.length !== 4}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.otpVerifyButtonText}>Verify OTP</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setShowOtpModal(false)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.otpCancelButton}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
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
    summaryCard: {
        backgroundColor: "#F9F9F9",
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: "#F0F0F0",
    },
    summaryItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    summaryItemName: {
        fontSize: 13,
        color: "#666",
        fontWeight: "500",
    },
    summaryItemPrice: {
        fontSize: 13,
        fontWeight: "700",
        color: "#1F1F1F",
    },
    summaryDivider: {
        height: 1,
        backgroundColor: "#E0E0E0",
        marginVertical: 10,
    },
    summaryTotal: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    summaryTotalLabel: {
        fontSize: 14,
        fontWeight: "700",
        color: "#1F1F1F",
    },
    summaryTotalValue: {
        fontSize: 16,
        fontWeight: "800",
        color: "#FF9800",
    },
    detailsCard: {
        backgroundColor: "#F9F9F9",
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: "#F0F0F0",
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    detailLabel: {
        fontSize: 13,
        color: "#666",
        fontWeight: "500",
    },
    detailValue: {
        fontSize: 13,
        fontWeight: "700",
        color: "#1F1F1F",
    },
    paymentOption: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F9F9F9",
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: "transparent",
    },
    paymentOptionActive: {
        borderColor: "#FF9800",
        backgroundColor: "#FFF8F3",
    },
    paymentOptionRadio: {
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
    paymentOptionContent: {
        flex: 1,
    },
    paymentOptionTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#1F1F1F",
    },
    paymentOptionSubtitle: {
        fontSize: 12,
        color: "#999",
        marginTop: 4,
    },
    cardDetailsContainer: {
        backgroundColor: "#F9F9F9",
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: "#F0F0F0",
    },
    inputGroup: {
        marginBottom: 12,
    },
    label: {
        fontSize: 12,
        fontWeight: "700",
        color: "#1F1F1F",
        marginBottom: 6,
    },
    input: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: "#1F1F1F",
    },
    rowInputs: {
        flexDirection: "row",
        marginBottom: 12,
    },
    securityInfo: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E8F5E9",
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: "#C8E6C9",
    },
    securityIcon: {
        fontSize: 32,
        marginRight: 12,
    },
    securityContent: {
        flex: 1,
    },
    securityTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#2E7D32",
    },
    securityText: {
        fontSize: 12,
        color: "#558B2F",
        marginTop: 4,
    },
    footer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: "#F0F0F0",
    },
    payButton: {
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
    payButtonDisabled: {
        opacity: 0.6,
    },
    payButtonText: {
        fontSize: 16,
        fontWeight: "800",
        color: "#FFFFFF",
    },
    otpModalContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    otpModalContent: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 24,
        paddingBottom: 40,
    },
    otpTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#1F1F1F",
        marginBottom: 8,
        textAlign: "center",
    },
    otpSubtitle: {
        fontSize: 13,
        color: "#666",
        marginBottom: 24,
        textAlign: "center",
    },
    otpInputContainer: {
        marginBottom: 20,
    },
    otpInput: {
        fontSize: 36,
        fontWeight: "700",
        borderWidth: 2,
        borderColor: "#FF9800",
        borderRadius: 12,
        paddingVertical: 12,
        textAlign: "center",
        color: "#1F1F1F",
        letterSpacing: 4,
    },
    otpVerifyButton: {
        backgroundColor: "#FF9800",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 12,
    },
    otpVerifyButtonDisabled: {
        opacity: 0.5,
    },
    otpVerifyButtonText: {
        fontSize: 16,
        fontWeight: "800",
        color: "#FFFFFF",
    },
    otpCancelButton: {
        fontSize: 14,
        fontWeight: "600",
        color: "#999",
        textAlign: "center",
        paddingVertical: 8,
    },
});
