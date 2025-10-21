import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const ViewMusic = () => {
  const [musicList, setMusicList] = useState([]);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "goals"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMusicList(list);
      },
      (error) => console.error("Firestore error:", error)
    );

    return unsubscribe;
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "goals", id));
      setSelectedMusic(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace("/auth/login");
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/goals/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons
          name="music-circle"
          size={26}
          color="#A36CFF"
          style={{ marginRight: 10 }}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.trackTitle}>{item.trackTitle || "Untitled"}</Text>
          <Text style={styles.artistText}>
            {item.artist ? item.artist : "Unknown Artist"}
          </Text>
          <Text style={styles.dateText}>
            Added:{" "}
            {item.createdAt?.toDate
              ? item.createdAt.toDate().toLocaleDateString()
              : "N/A"}
          </Text>
        </View>

        <Pressable onPress={() => setSelectedMusic(item)}>
          <Ionicons name="ellipsis-vertical" size={20} color="#6B21A8" />
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <LinearGradient colors={["#E5CCFF", "#F4E1FF"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Tracks</Text>
          <Text style={styles.subtitle}>Listen to your uploaded songs</Text>
        </View>

        <FlatList
          data={musicList}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 120 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No music added yet 🎧</Text>
          }
        />

        {/* Modal for Delete */}
        <Modal visible={!!selectedMusic} transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            onPressOut={() => setSelectedMusic(null)}
            activeOpacity={1}
          >
            <View style={styles.modalContent}>
              <Pressable
                style={styles.modalItem}
                onPress={() => handleDelete(selectedMusic.id)}
              >
                <Text style={[styles.modalText, { color: "#DC2626" }]}>
                  Delete
                </Text>
              </Pressable>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Floating Buttons */}
        <View style={styles.fabContainer}>
          {/* Add Music */}
          <Pressable
            style={styles.fab}
            onPress={() => router.push("/goals/create")}
          >
            <LinearGradient
              colors={["#9D50BB", "#6E48AA"]}
              style={styles.fabGradient}
            >
              <Ionicons name="add" size={26} color="white" />
            </LinearGradient>
          </Pressable>

          {/* Logout */}
          <Pressable
            style={[styles.fab, styles.logoutFab]}
            onPress={handleLogout}
          >
            <View style={styles.logoutWrapper}>
              <Ionicons name="log-out-outline" size={26} color="#9D50BB" />
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ViewMusic;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 10 },
  header: { alignItems: "center", marginBottom: 14 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#4B0082",
  },
  subtitle: {
    fontSize: 15,
    color: "#7A57D1",
    marginTop: 4,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.95)",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 18,
    borderRadius: 18,
    shadowColor: "#9D50BB",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  trackTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E1B4B",
  },
  artistText: {
    fontSize: 14,
    color: "#5B21B6",
    marginTop: 2,
  },
  dateText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
  },
  emptyText: {
    textAlign: "center",
    color: "#9CA3AF",
    marginTop: 40,
    fontStyle: "italic",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalItem: { paddingVertical: 12 },
  modalText: { fontSize: 16, fontWeight: "600" },
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
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: "#9D50BB",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  fabGradient: {
    flex: 1,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutFab: {
    borderWidth: 2,
    borderColor: "#9D50BB",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
});
