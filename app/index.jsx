import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import * as SplashScreenModule from 'expo-splash-screen';
import Home from './home.jsx';
import Login from './login';
import Cart from './cart.jsx';
import FoodDetails from './fooddetails.jsx';
import Payment from './payment.jsx';
import Orders from './orders.jsx';
import Brand from '../assets/brand.png';

SplashScreenModule.preventAutoHideAsync();

export default function App() {
    const [currentScreen, setCurrentScreen] = useState('splash'); // splash, home, login, cart, fooddetails, payment, orders
    const [cartItems, setCartItems] = useState({});
    const [paymentData, setPaymentData] = useState(null);
    const [selectedFoodId, setSelectedFoodId] = useState(null);
    const translateY = useRef(new Animated.Value(0)).current;

    const RESTAURANTS = [
        {
            id: 1,
            name: "Spice Garden",
            cuisine: "North Indian • Biryani",
            rating: 4.5,
            deliveryTime: "25-30 min",
            deliveryFee: "₹20",
            discount: "30% OFF",
            emoji: "🍱",
        },
        {
            id: 2,
            name: "Burger Palace",
            cuisine: "Burgers • Fast Food",
            rating: 4.3,
            deliveryTime: "20-25 min",
            deliveryFee: "₹15",
            discount: "25% OFF",
            emoji: "🍔",
        },
        {
            id: 3,
            name: "Pizza Hub",
            cuisine: "Pizza • Italian",
            rating: 4.6,
            deliveryTime: "30-35 min",
            deliveryFee: "₹30",
            discount: "40% OFF",
            emoji: "🍕",
        },
        {
            id: 4,
            name: "Noodle Express",
            cuisine: "Chinese • Noodles",
            rating: 4.2,
            deliveryTime: "15-20 min",
            deliveryFee: "₹10",
            discount: "20% OFF",
            emoji: "🍜",
        },
        {
            id: 5,
            name: "Dessert Delight",
            cuisine: "Desserts • Sweets",
            rating: 4.7,
            deliveryTime: "10-15 min",
            deliveryFee: "₹5",
            discount: "35% OFF",
            emoji: "🍰",
        },
        {
            id: 6,
            name: "Green Bowl",
            cuisine: "Veg • Healthy",
            rating: 4.4,
            deliveryTime: "25-30 min",
            deliveryFee: "₹20",
            discount: "15% OFF",
            emoji: "🥗",
        },
    ];

    useEffect(() => {
        if (currentScreen === 'splash') {
            // Logo bounce animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(translateY, { toValue: -20, duration: 800, useNativeDriver: true }),
                    Animated.timing(translateY, { toValue: 0, duration: 800, useNativeDriver: true }),
                ])
            ).start();
            // 3 seconds ke baad home page show karo
            const timer = setTimeout(async () => {
                console.log("Loading home page");
                await SplashScreenModule.hideAsync();
                setCurrentScreen('home');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [currentScreen, translateY]);

    const navigateToLogin = useCallback(() => {
        console.log("navigateToLogin called");
        setCurrentScreen('login');
    }, []);

    const navigateToHome = useCallback(() => {
        console.log("navigateToHome called");
        setCurrentScreen('home');
    }, []);

    const navigateToCart = useCallback(() => {
        console.log("navigateToCart called - Setting currentScreen to: cart");
        setCurrentScreen('cart');
    }, []);

    const navigateToFoodDetails = useCallback((foodId) => {
        console.log("navigateToFoodDetails called with foodId:", foodId, "- Setting currentScreen to: fooddetails");
        setSelectedFoodId(foodId);
        setCurrentScreen('fooddetails');
    }, []);

    const navigateToPayment = useCallback((orderData) => {
        console.log("navigateToPayment called");
        setPaymentData(orderData);
        setCurrentScreen('payment');
    }, []);

    const navigateToOrders = useCallback(() => {
        console.log("navigateToOrders called - Setting currentScreen to: orders");
        setCurrentScreen('orders');
    }, []);

    const handleAddToCart = useCallback((restaurantId, quantity = 1) => {
        setCartItems((prev) => ({
            ...prev,
            [restaurantId]: (prev[restaurantId] || 0) + quantity,
        }));
    }, []);

    const handlePaymentSuccess = useCallback((orderDetails) => {
        console.log("Payment Success:", orderDetails);
        // Clear cart
        setCartItems({});
        setPaymentData(null);
        // Navigate to home with success message
        setCurrentScreen('home');
    }, []);

    if (currentScreen === 'splash') {
        return (
            <View style={styles.container}>
                <Animated.Image source={Brand} style={[styles.logo, { transform: [{ translateY }] }]} />
                <Text style={styles.title}>Foodie</Text>
            </View>
        );
    }

    if (currentScreen === 'home') {
        return (
            <Home
                onLogout={navigateToLogin}
                onViewCart={navigateToCart}
                onViewFoodDetails={navigateToFoodDetails}
                onViewOrders={navigateToOrders}
                cartItems={cartItems}
                onAddToCart={handleAddToCart}
            />
        );
    }

    if (currentScreen === 'login') {
        return <Login navigateTo={navigateToHome} />;
    }

    if (currentScreen === 'cart') {
        return (
            <Cart
                cartItems={cartItems}
                restaurants={RESTAURANTS}
                onClose={navigateToHome}
                onProceedToPayment={navigateToPayment}
            />
        );
    }

    if (currentScreen === 'fooddetails') {
        return (
            <FoodDetails
                selectedFoodId={selectedFoodId}
                onClose={navigateToHome}
                onAddToCart={handleAddToCart}
            />
        );
    }

    if (currentScreen === 'payment') {
        return (
            <Payment
                orderData={paymentData}
                onClose={navigateToCart}
                onPaymentSuccess={handlePaymentSuccess}
            />
        );
    }

    if (currentScreen === 'orders') {
        return (
            <Orders
                onClose={navigateToHome}
                onReorder={(order) => {
                    // Handle reorder logic if needed
                    navigateToHome();
                }}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
    logo: { width: 150, height: 150, resizeMode: 'contain', marginBottom: 20 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#ff6347' },
});

