import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import * as SplashScreenModule from 'expo-splash-screen';
import Home from './home';
import Login from './login';
import Brand from '../assets/brand.png';

SplashScreenModule.preventAutoHideAsync();

export default function App() {
    const [currentScreen, setCurrentScreen] = useState('splash'); // splash, home, login
    const translateY = useRef(new Animated.Value(0)).current;

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

    if (currentScreen === 'splash') {
        return (
            <View style={styles.container}>
                <Animated.Image source={Brand} style={[styles.logo, { transform: [{ translateY }] }]} />
                <Text style={styles.title}>Foodie</Text>
            </View>
        );
    }

    if (currentScreen === 'home') {
        return <Home navigateTo={navigateToLogin} />;
    }

    if (currentScreen === 'login') {
        return <Login navigateTo={navigateToHome} />;
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
    logo: { width: 150, height: 150, resizeMode: 'contain', marginBottom: 20 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#ff6347' },
});

