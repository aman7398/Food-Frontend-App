import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "app/screens/home";
import LoginScreen from "app/screens/login";
import SignupScreen from "app/screens/signup";
import VerifyOtpScreen from "app/screens/VerifyOtpScreen";
import Cart from "app/screens/cart";
import Payment from "app/screens/payment";
import AddressForm from "app/screens/AddressForm";
import AddressList from "app/screens/AddressList";
import Restaurant from "app/screens/Restaurant";
import AddFoodScreen from "app/screens/AddFood";
import Orders from "app/screens/orders";
import ApproveRestaurants from "app/screens/ApproveRestaurantsScreen";
import Splash from "app/splash";

const Stack = createNativeStackNavigator();

export default function StackNavigation() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("token").then(t => {
      setToken(t);
      setLoading(false);
    });
    console.log("Address screen mounted");
  }, []);

  function AuthStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="OtpVerify" component={VerifyOtpScreen} />
      </Stack.Navigator>
    );
  }

  function AppStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="MyOrders" component={Orders} />
        <Stack.Screen name="AddressList" component={AddressList} />
        <Stack.Screen name="AddressForm" component={AddressForm} />
        <Stack.Screen name="Restaurant" component={Restaurant} />
        <Stack.Screen name="AddFood" component={AddFoodScreen} />
        <Stack.Screen name="ApproveRestaurants" component={ApproveRestaurants} />
      </Stack.Navigator>
    );
  }


  if (loading) return null;

  return (
    <NavigationContainer>
      {!!token ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
