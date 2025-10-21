import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Link, router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { LinearGradient } from "expo-linear-gradient";
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const CARD_WIDTH = (width - 60) / 2; // perfect spacing for 2 cards
const CARD_HEIGHT = 170;

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth/login");
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <LinearGradient colors={["#E9D5FF", "#C084FC"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* 🎵 Header Section */}
          <View style={styles.header}>
            <MaterialCommunityIcons
              name="music-circle"
              size={90}
              color="#8B5CF6"
              style={{ marginBottom: 10 }}
            />
            <Text style={styles.title}>SoundSphere</Text>
            <Text style={styles.subtitle}>
              Feel the rhythm. Shape your world with sound.
            </Text>
          </View>

          {/* 🎶 Action Cards — Aligned Side by Side */}
          <View style={styles.cardRow}>
            <Link href="/goals" asChild>
              <TouchableOpacity activeOpacity={0.85} style={styles.card}>
                <LinearGradient
                  colors={["#C084FC", "#A855F7"]}
                  style={styles.cardGradient}
                >
                  <Ionicons name="musical-notes" size={36} color="white" />
                </LinearGradient>
                <Text style={styles.cardTitle}>My Music</Text>
                <Text style={styles.cardDesc}>View your saved tracks</Text>
              </TouchableOpacity>
            </Link>

            <Link href="/goals/create" asChild>
              <TouchableOpacity activeOpacity={0.85} style={styles.card}>
                <LinearGradient
                  colors={["#8B5CF6", "#C084FC"]}
                  style={styles.cardGradient}
                >
                  <FontAwesome5 name="plus" size={30} color="white" />
                </LinearGradient>
                <Text style={styles.cardTitle}>Add Music</Text>
                <Text style={styles.cardDesc}>Upload new tracks easily</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* 🌀 Info / Tagline */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Why SoundSphere?</Text>
            <Text style={styles.infoText}>
              SoundSphere helps you collect, organize, and feel your favorite
              tracks — one beat at a time.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E9D5FF",
  },
  scroll: {
    padding: 20,
    paddingBottom: 80,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#4C1D95",
    textAlign: "center",
    letterSpacing: 0.6,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B21A8",
    textAlign: "center",
    marginTop: 6,
    opacity: 0.9,
  },

  // 🟣 Fixed card layout
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 12,
    shadowColor: "#8B5CF6",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  cardGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4C1D95",
    textAlign: "center",
  },
  cardDesc: {
    fontSize: 13,
    color: "#6B21A8",
    textAlign: "center",
    marginTop: 4,
    opacity: 0.8,
  },

  // 🌀 Info section
  infoCard: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#8B5CF6",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4C1D95",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#6B21A8",
    lineHeight: 20,
  },
});
