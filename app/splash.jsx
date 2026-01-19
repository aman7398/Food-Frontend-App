import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import * as SplashScreenModule from 'expo-splash-screen';
import Home from './home';
import LoginScreen from './login';
import SignupScreen from './signup';
import Brand from '../assets/brand.png'; // Apna logo replace karo

SplashScreenModule.preventAutoHideAsync();

export default function Splash() {
  const [currentPage, setCurrentPage] = useState('splash'); // 'splash', 'login', 'signup', 'home'
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, { toValue: -20, duration: 800, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    // 3 seconds ke baad login page show karo
    const timer = setTimeout(async () => {
      console.log("Loading login page")
      await SplashScreenModule.hideAsync();
      setCurrentPage('login');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleLoginNavigateHome = () => {
    console.log("User logged in, navigating to home");
    setCurrentPage('home');
  };

  const handleLoginNavigateSignup = () => {
    console.log("User navigating to signup");
    setCurrentPage('signup');
  };

  const handleSignupNavigateHome = () => {
    console.log("User signed up, navigating to home");
    setCurrentPage('home');
  };

  const handleSignupNavigateLogin = () => {
    console.log("User going back to login from signup");
    setCurrentPage('login');
  };

  const handleLogout = () => {
    console.log("User logged out, navigating to login");
    setCurrentPage('login');
  };

  if (currentPage === 'home') {
    return <Home onLogout={handleLogout} />;
  }

  if (currentPage === 'signup') {
    return <SignupScreen onNavigateHome={handleSignupNavigateHome} onNavigateLogin={handleSignupNavigateLogin} />;
  }

  if (currentPage === 'login') {
    return <LoginScreen onNavigateHome={handleLoginNavigateHome} onNavigateSignup={handleLoginNavigateSignup} />;
  }

  return (
    <View style={styles.container}>
      <Animated.Image source={Brand} style={[styles.logo, { transform: [{ translateY }] }]} />
      <Text style={styles.title}>Foodie</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  logo: { width: 150, height: 150, resizeMode: 'contain', marginBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#ff6347' },
});