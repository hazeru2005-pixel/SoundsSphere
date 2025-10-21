import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GoalsProvider } from "../../contexts/GoalsContext";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useRouter } from "expo-router";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function SoundSphereLayout() {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace("/auth/login");
      setChecking(false);
    });
    return unsub;
  }, []);

  if (checking) {
    return (
      <LinearGradient colors={["#E9D5FF", "#C084FC"]} style={styles.center}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </LinearGradient>
    );
  }

  return (
    <GoalsProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: "#8B5CF6",
          tabBarInactiveTintColor: "#BFAAFD",
          tabBarStyle: {
            backgroundColor: "#F8F5FF",
            borderTopWidth: 0,
            elevation: 6,
            height: 78,
            paddingBottom: 10,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            position: "absolute",
            shadowColor: "#8B5CF6",
            shadowOpacity: 0.15,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: -4 },
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "700",
            marginBottom: 2,
          },
        }}
      >
        {/* Home / Library */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Library",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "musical-notes" : "musical-notes-outline"}
                size={26}
                color={focused ? "#8B5CF6" : "#BFAAFD"}
              />
            ),
          }}
        />

        {/* Add Music */}
        <Tabs.Screen
          name="create"
          options={{
            title: "Add Track",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "add-circle" : "add-circle-outline"}
                size={30}
                color={focused ? "#8B5CF6" : "#BFAAFD"}
              />
            ),
          }}
        />

        {/* Hidden routes */}
        <Tabs.Screen name="edit/[id]" options={{ href: null }} />
        <Tabs.Screen name="[id]" options={{ href: null }} />
      </Tabs>
    </GoalsProvider>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
