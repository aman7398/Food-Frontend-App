import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import * as SplashScreenModule from 'expo-splash-screen';
import App from './index';
import Brand from '../assets/brand.png';

SplashScreenModule.preventAutoHideAsync();

export default function Splash() {
  const [showApp, setShowApp] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, { toValue: -20, duration: 800, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    ).start();
    const timer = setTimeout(async () => {
      console.log("Loading app")
      await SplashScreenModule.hideAsync();
      setShowApp(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // const handleLoginNavigateHome = () => {
  //   console.log("User logged in, navigating to home");
  //   setShowApp(true);
  // };

  // const handleLoginNavigateSignup = () => {
  //   console.log("User navigating to signup");
  // };

  // const handleSignupNavigateHome = () => {
  //   console.log("User signed up, navigating to home");
  //   setShowApp(true);
  // };

  // const handleSignupNavigateLogin = () => {
  //   console.log("User going back to login from signup");
  // };

  // const handleLogout = () => {
  //   console.log("User logged out, navigating to login");
  //   setShowApp(false);
  // };
  if (!showApp) {
    return (
      <View style={styles.container}>
        <Animated.Image source={Brand} style={[styles.logo, { transform: [{ translateY }] }]} />
        <Text style={styles.title}>Foodie</Text>
      </View>
    );
  }
  return <App />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  logo: { width: 150, height: 150, resizeMode: 'contain', marginBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#ff6347' },
});