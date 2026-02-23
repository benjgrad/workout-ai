import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import PlanScreen from "./src/screens/PlanScreen";
import { loadStoredToken } from "./src/api/auth";

type RootStackParamList = {
  Login: undefined;
  Plan: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    loadStoredToken().then((hasToken) => {
      setIsLoggedIn(hasToken);
      setChecking(false);
    });
  }, []);

  if (checking) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#1a1a2e",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#4ade80" />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="Plan">
            {() => <PlanScreen onLogout={() => setIsLoggedIn(false)} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Login">
            {() => <LoginScreen onLogin={() => setIsLoggedIn(true)} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
