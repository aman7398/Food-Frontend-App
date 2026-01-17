import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import * as SplashScreenModule from 'expo-splash-screen';
import Home from './home';
import Brand from '../assets/brand.png'; // Apna logo replace karo

SplashScreenModule.preventAutoHideAsync();

export default function Splash() {
  const [showHome, setShowHome] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, { toValue: -20, duration: 800, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    // 3 seconds ke baad home page show karo
    const timer = setTimeout(async () => {
      console.log("Loading home page")
      await SplashScreenModule.hideAsync();
      setShowHome(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showHome) {
    return <Home />;
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