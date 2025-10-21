import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { auth, db } from "../../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const EditMusic = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [trackTitle, setTrackTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const docRef = doc(db, "goals", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTrackTitle(data.trackTitle || "");
          setArtist(data.artist || "");
          setAlbum(data.album || "");
          setDescription(data.description || "");
        }
      } catch (err) {
        console.log("Error fetching music:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMusic();
  }, [id]);

  const handleUpdate = async () => {
    if (!trackTitle.trim() || !artist.trim()) {
      Alert.alert("Missing Fields", "Track title and artist are required.");
      return;
    }

    try {
      const docRef = doc(db, "goals", id);
      await updateDoc(docRef, {
        trackTitle,
        artist,
        album,
        description,
        updatedAt: new Date(),
        userId: auth.currentUser.uid,
      });

      Keyboard.dismiss();
      router.push("/goals");
    } catch (err) {
      console.log("Error updating music:", err);
      Alert.alert("Error", "Failed to update track.");
    }
  };

  const renderInput = (label, value, setValue, placeholder, icon) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <FontAwesome5
          name={icon}
          size={16}
          color="#A86BFF"
          style={{ marginRight: 10 }}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#B8A8E6"
          value={value}
          onChangeText={setValue}
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <LinearGradient colors={["#E9D5FF", "#C084FC"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <MaterialCommunityIcons
              name="music-circle"
              size={80}
              color="#8B5CF6"
              style={{ marginBottom: 12 }}
            />
            <Text style={styles.title}>Edit Track</Text>
            <Text style={styles.subtitle}>
              Update your music details below
            </Text>
          </View>

          {/* Music Info */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Track Info</Text>
            {renderInput("Track Title", trackTitle, setTrackTitle, "Enter song title", "music")}
            {renderInput("Artist", artist, setArtist, "Artist name", "user")}
            {renderInput("Album", album, setAlbum, "Album name (optional)", "compact-disc")}
          </View>

          {/* Description */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Description</Text>
            <View style={styles.textAreaWrapper}>
              <TextInput
                style={styles.textArea}
                placeholder="Add notes or mood for this track..."
                placeholderTextColor="#B8A8E6"
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </View>
          </View>
        </ScrollView>

        {/* Floating Action Buttons */}
        <View style={styles.fabContainer}>
          <TouchableOpacity
            style={[styles.fab, styles.cancelFab]}
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={22} color="#8B5CF6" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleUpdate} style={styles.fab}>
            <LinearGradient
              colors={["#8B5CF6", "#C084FC"]}
              style={styles.fabGradient}
            >
              <FontAwesome5 name="save" size={18} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default EditMusic;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 140 },
  header: { alignItems: "center", marginBottom: 20 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#4C1D95",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#6B21A8",
    textAlign: "center",
    marginTop: 6,
  },
  card: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.95)",
    shadowColor: "#8B5CF6",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4C1D95",
    marginBottom: 10,
  },
  inputContainer: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: "600", color: "#6B21A8", marginBottom: 6 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E9D5FF",
    paddingHorizontal: 12,
    shadowColor: "#8B5CF6",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1E1B4B",
  },
  textAreaWrapper: {
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderWidth: 1,
    borderColor: "#E9D5FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textArea: {
    minHeight: 100,
    fontSize: 15,
    color: "#1E1B4B",
    textAlignVertical: "top",
  },
  fabContainer: {
    position: "absolute",
    bottom: 30,
    left: 250,
    right: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 70,
  },
  fab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cancelFab: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#8B5CF6",
  },
  fabGradient: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
