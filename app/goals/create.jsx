import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  View,
  ScrollView,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { auth } from "../../firebaseConfig";
import { useGoals } from "../../hooks/useGoals";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const AddMusic = () => {
  const [trackTitle, setTrackTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMusic, setSelectedMusic] = useState(null);

  const { createGoal } = useGoals();
  const router = useRouter();

  // 🎵 Pick a music file from user's device
  const pickMusicFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      setSelectedMusic(file);
      Alert.alert("Music Selected", `🎶 ${file.name}`);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to pick music file.");
    }
  };

  const handleSubmit = async () => {
    if (!selectedMusic) {
      Alert.alert("Missing File", "Please choose a music file first.");
      return;
    }

    if (!trackTitle.trim() || !artist.trim()) return;

    await createGoal({
      fileName: selectedMusic.name,
      fileUri: selectedMusic.uri,
      trackTitle,
      artist,
      album,
      description,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
    });

    setTrackTitle("");
    setArtist("");
    setAlbum("");
    setDescription("");
    setSelectedMusic(null);

    Keyboard.dismiss();
    router.push("/goals");
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
            <Text style={styles.title}>Add New Track</Text>
            <Text style={styles.subtitle}>
              Choose a song and fill in its details
            </Text>
          </View>

          {/* Choose Music File */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Music File</Text>
            <TouchableOpacity style={styles.filePicker} onPress={pickMusicFile}>
              <MaterialCommunityIcons
                name="file-music"
                size={22}
                color="#8B5CF6"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.filePickerText}>
                {selectedMusic ? selectedMusic.name : "Choose a music file"}
              </Text>
            </TouchableOpacity>
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

          <TouchableOpacity onPress={handleSubmit} style={styles.fab}>
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

export default AddMusic;

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
  filePicker: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3E8FF",
    borderWidth: 1,
    borderColor: "#E9D5FF",
    borderRadius: 14,
    padding: 14,
  },
  filePickerText: {
    color: "#6B21A8",
    fontSize: 15,
    fontWeight: "500",
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
});
