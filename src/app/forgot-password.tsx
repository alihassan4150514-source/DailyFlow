import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/AuthContext";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReset = async () => {
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const updated = await resetPassword(email, newPassword);

    if (!updated) {
      setError("No account was found with this email.");
      return;
    }

    setSuccess("Password updated successfully. You can login now.");

    setTimeout(() => {
      router.replace("/login");
    }, 1200);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Reset Password
        </ThemedText>

        <ThemedText
          type="default"
          themeColor="textSecondary"
          style={styles.subtitle}
        >
          Enter your registered email and create a new password.
        </ThemedText>

        <View style={styles.form}>
          <ThemedText type="smallBold">Email</ThemedText>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your registered email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            placeholderTextColor="#888888"
          />

          <ThemedText type="smallBold" style={styles.label}>
            New Password
          </ThemedText>

          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#888888"
          />

          <ThemedText type="smallBold" style={styles.label}>
            Confirm Password
          </ThemedText>

          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#888888"
          />

          {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

          {success ? (
            <ThemedText style={styles.success}>{success}</ThemedText>
          ) : null}

          <Pressable
            onPress={handleReset}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <ThemedText style={styles.buttonText}>Reset Password</ThemedText>
          </Pressable>
        </View>

        <Link href="/login" asChild>
          <Pressable style={styles.backButton}>
            <ThemedText type="smallBold" style={styles.backText}>
              ← Back to Login
            </ThemedText>
          </Pressable>
        </Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    maxWidth: 500,
    width: "100%",
    alignSelf: "center",
  },

  title: {
    fontSize: 34,
    lineHeight: 42,
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 28,
  },

  form: {
    width: "100%",
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#cfcfcf",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginTop: 7,
    fontSize: 16,
    color: "#222222",
    backgroundColor: "#ffffff",
  },

  label: {
    marginTop: 18,
  },

  error: {
    color: "#d9534f",
    textAlign: "center",
    marginTop: 12,
  },

  success: {
    color: "#2e8b57",
    textAlign: "center",
    marginTop: 12,
  },

  button: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#3c87f7",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.75,
  },

  backButton: {
    alignItems: "center",
    marginTop: 24,
  },

  backText: {
    color: "#3c87f7",
  },
});
