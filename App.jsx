import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "app/screens/login";
import Home from "app/screens/home";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import VerifyOtpScreen from "app/screens/VerifyOtpScreen";
import SignupScreen from "app/screens/signup";
import { AppRegistry } from "react-native";
import StackNavigation from "app/navigation/StackNavigation";

// AppRegistry.registerComponent("FoodApp", ()=> StackNavigation)

export default function App() {
  // const navigation = useNavigation();
  // const Stack = createNativeStackNavigator();
  // const [userToken, setUserToken] = useState(null);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const loadToken = async () => {
  //     const token = await AsyncStorage.getItem("token");
  //     setUserToken(token);
  //     setLoading(false);
  //   };
  //   loadToken();
  // }, []);

  // useEffect(() => {
  //   console.log("USER TOKEN CHANGED:", userToken);
  // }, [userToken]);

  // if (loading) return null;

  // // 🔀 AUTH SWITCH
  // if (!userToken) {
  //   return (
  //     <LoginScreen
  //       onNavigateHome={(token) => setUserToken(token)}
  //       onNavigateSignup={() => console.log("Go to signup")}
  //     />
  //   );
  // }

  return <StackNavigation />;

}
