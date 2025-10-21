import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/");
    } catch (err) {
      setError("Signup failed. Try again.");
    }
  };

  return (
    <LinearGradient colors={["#E9D5FF", "#C084FC"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.inner}
      >
        <View style={styles.card}>
          <MaterialCommunityIcons
            name="account-music"
            size={70}
            color="#8B5CF6"
            style={{ marginBottom: 10 }}
          />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join SoundSphere today</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#9C8DB5"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9C8DB5"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#9C8DB5"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity onPress={handleSignup} activeOpacity={0.9}>
            <LinearGradient
              colors={["#C084FC", "#A855F7"]}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text style={styles.linkText}>
              Already have an account?{" "}
              <Text style={styles.linkHighlight}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 25,
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#4C1D95",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B21A8",
    marginBottom: 25,
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#4C1D95",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
    padding: 100,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  linkText: {
    color: "#6B21A8",
    fontSize: 14,
  },
  linkHighlight: {
    color: "#4C1D95",
    fontWeight: "700",
  },
  error: {
    color: "#EF4444",
    fontSize: 13,
    marginBottom: 10,
  },
});
