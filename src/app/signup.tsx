import { router } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/AuthContext";

export default function SignupScreen() {
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const success = await signup(name, email, password);

    if (success) {
      router.replace("/");
    } else {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoCircle}>
            <ThemedText style={styles.logoText}>A</ThemedText>
          </View>

          <ThemedText style={styles.title}>Create Account 🚀</ThemedText>

          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.subtitle}
          >
            Create your DailyFlow account to get started.
          </ThemedText>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="smallBold" style={styles.label}>
              Your Name
            </ThemedText>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#8A8A8A"
              style={styles.input}
            />

            <ThemedText type="smallBold" style={styles.label}>
              Email
            </ThemedText>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#8A8A8A"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />

            <ThemedText type="smallBold" style={styles.label}>
              Password
            </ThemedText>

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              placeholderTextColor="#8A8A8A"
              secureTextEntry
              style={styles.input}
            />

            {error ? (
              <ThemedText style={styles.error}>{error}</ThemedText>
            ) : null}

            <Pressable
              onPress={handleSignup}
              style={({ pressed }) => [
                styles.signupButton,
                pressed && styles.pressed,
              ]}
            >
              <ThemedText style={styles.buttonText}>Create Account</ThemedText>
            </Pressable>

            <View style={styles.loginRow}>
              <ThemedText type="small" themeColor="textSecondary">
                Already have an account?{" "}
              </ThemedText>

              <Pressable onPress={() => router.replace("/login")}>
                <ThemedText type="smallBold" style={styles.loginText}>
                  Login
                </ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  keyboard: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  logoCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#DCE9DF",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 22,
  },

  logoText: {
    fontSize: 38,
    lineHeight: 45,
    fontWeight: "700",
    color: "#276447",
  },

  title: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "700",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    marginTop: 8,
    marginBottom: 28,
  },

  card: {
    width: "100%",
    maxWidth: 460,
    alignSelf: "center",
    padding: 22,
    borderRadius: 20,
  },

  label: {
    marginBottom: 8,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#D6DDD7",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#222",
    backgroundColor: "#FFFFFF",
    marginBottom: 18,
  },

  error: {
    color: "#C0392B",
    marginBottom: 14,
  },

  signupButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: "#39835E",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  loginText: {
    color: "#39835E",
  },

  pressed: {
    opacity: 0.7,
  },
});
