import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";
import { BlurView } from "expo-blur";

const MusicDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [music, setMusic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // animation
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(20);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "goals", id), (docSnap) => {
      if (docSnap.exists()) setMusic({ id: docSnap.id, ...docSnap.data() });
      else setMusic(null);
      setLoading(false);
    });
    return () => unsub();
  }, [id]);

  const handlePlayPause = async () => {
    try {
      if (!music?.fileUri) return;

      if (isPlaying && sound) {
        await sound.pauseAsync();
        setIsPlaying(false);
        return;
      }

      if (sound) {
        await sound.playAsync();
        setIsPlaying(true);
        return;
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: music.fileUri },
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          newSound.unloadAsync();
          setSound(null);
        }
      });
    } catch (err) {
      console.error("Playback error:", err);
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#9D50BB" />
      </View>
    );

  if (!music)
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Music not found</Text>
      </View>
    );

  return (
    <LinearGradient colors={["#E5CCFF", "#F4E1FF"]} style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80, paddingTop: 40 }}>
        {/* Hero */}
        <Animated.View
          style={[
            styles.hero,
            { transform: [{ translateY: slideAnim }], opacity: fadeAnim },
          ]}
        >
          <Ionicons name="musical-notes" size={70} color="#9D50BB" />
          <Text style={styles.trackTitle}>{music.trackTitle || "Untitled"}</Text>
          <Text style={styles.artistText}>
            {music.artist ? music.artist : "Unknown Artist"}
          </Text>
        </Animated.View>

        {/* Info Cards */}
        {[{ label: "Album", value: music.album || "N/A" },
          { label: "Description", value: music.description || "N/A" },
          {
            label: "Date Added",
            value: music.createdAt?.toDate
              ? music.createdAt.toDate().toLocaleDateString()
              : "N/A",
          },
        ].map((item, i) => (
          <BlurView intensity={30} tint="light" style={styles.card} key={i}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </BlurView>
        ))}

        {/* Player Section */}
      <BlurView intensity={40} tint="light" style={styles.playerCard}>
        {/* Track Title */}
        <Text style={styles.playerTrackTitle}>
            {music?.trackTitle || "Unknown Track"}
        </Text>

        {/* Artist */}
        <Text style={styles.playerArtist}>
            {music?.artist || "Unknown Artist"}
        </Text>

        {/* Play / Pause Button */}
        <Pressable
            style={({ pressed }) => [
            styles.playButton,
            pressed && { transform: [{ scale: 0.95 }] },
            ]}
            onPress={handlePlayPause}
        >
            <LinearGradient
            colors={["#9D50BB", "#6E48AA"]}
            style={styles.playGradient}
            >
            <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={36}
                color="white"
            />
            </LinearGradient>
        </Pressable>

        {/* Status Text */}
        <Text style={styles.playStatus}>
            {isPlaying ? "Playing..." : "Paused"}
        </Text>
        </BlurView>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <LinearGradient colors={["#9D50BB", "#6E48AA"]} style={styles.button}>
            <Pressable
              style={styles.buttonContent}
              onPress={() => router.push(`/goals/edit/${music.id}`)}
            >
              <Ionicons name="create-outline" size={18} color="white" />
              <Text style={styles.buttonText}>Edit</Text>
            </Pressable>
          </LinearGradient>

          <Pressable
            style={[styles.button, styles.cancelBtn]}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelText}>Back</Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default MusicDetail;

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, color: "red" },
  hero: {
    alignItems: "center",
    paddingVertical: 30,
  },
  trackTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#4B0082",
    textAlign: "center",
    marginTop: 12,
  },
  artistText: {
    fontSize: 16,
    color: "#7A57D1",
    marginTop: 4,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderLeftWidth: 5,
    borderLeftColor: "#9D50BB",
  },
  label: { fontSize: 14, fontWeight: "600", color: "#6B7280", marginBottom: 4 },
  value: { fontSize: 16, color: "#111827", fontWeight: "500" },
  playerCard: {
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 24,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
  },
  playerLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#5B21B6",
    marginBottom: 10,
  },
  playButton: {
    marginVertical: 8,
    borderRadius: 60,
    overflow: "hidden",
  },
  playGradient: {
    width: 80,
    height: 80,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  playStatus: {
    marginTop: 10,
    color: "#7A57D1",
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20,
    gap: 12,
  },
  button: { flex: 1, borderRadius: 14, overflow: "hidden" },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 6,
  },
  buttonText: { color: "white", fontWeight: "700", fontSize: 16 },
  cancelBtn: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#9D50BB",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
  },
  cancelText: { color: "#9D50BB", fontWeight: "700", fontSize: 16 },
  playerTrackTitle: {
  fontSize: 20,
  fontWeight: "800",
  color: "#4B0082",
  textAlign: "center",
  marginBottom: 4,
},

playerArtist: {
  fontSize: 14,
  color: "#7A57D1",
  marginBottom: 16,
},

});
