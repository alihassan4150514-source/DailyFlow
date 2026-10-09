import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/AuthContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const userName = user?.name || "User";
  const userEmail = user?.email || "No email available";

  const firstLetter = userName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <ThemedText type="subtitle" style={styles.avatarText}>
              {firstLetter}
            </ThemedText>
          </View>

          <View style={styles.userInfo}>
            <ThemedText type="title" style={styles.name}>
              {userName}
            </ThemedText>

            <ThemedText type="small" themeColor="textSecondary">
              {userEmail}
            </ThemedText>

            <ThemedText
              type="small"
              themeColor="textSecondary"
              style={styles.memberText}
            >
              DailyFlow Member
            </ThemedText>
          </View>
        </View>

        {/* Daily Goal */}
        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            🎯 Daily Goal
          </ThemedText>

          <ThemedText type="default" themeColor="textSecondary">
            Stay consistent, complete your important tasks, and make steady
            progress every day.
          </ThemedText>

          <View style={styles.progressBackground}>
            <View style={styles.progressFill} />
          </View>

          <View style={styles.progressRow}>
            <ThemedText type="smallBold">Today's progress</ThemedText>

            <ThemedText type="smallBold" themeColor="textSecondary">
              70%
            </ThemedText>
          </View>
        </ThemedView>

        {/* Productivity */}
        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            📊 Productivity
          </ThemedText>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <ThemedText type="subtitle">7</ThemedText>

              <ThemedText type="small" themeColor="textSecondary">
                Tasks done
              </ThemedText>
            </View>

            <View style={styles.statBox}>
              <ThemedText type="subtitle">85%</ThemedText>

              <ThemedText type="small" themeColor="textSecondary">
                Focus
              </ThemedText>
            </View>

            <View style={styles.statBox}>
              <ThemedText type="subtitle">4</ThemedText>

              <ThemedText type="small" themeColor="textSecondary">
                Day streak
              </ThemedText>
            </View>
          </View>
        </ThemedView>

        {/* Motivation */}
        <ThemedView type="backgroundElement" style={styles.motivationCard}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            💡 Daily Motivation
          </ThemedText>

          <ThemedText type="default">
            “Small progress every day leads to big results.”
          </ThemedText>

          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.motivationText}
          >
            Keep showing up. Your consistency matters more than perfection.
          </ThemedText>
        </ThemedView>

        {/* Account */}
        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            ⚙️ Account
          </ThemedText>

          <Pressable
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.pressed,
            ]}
            onPress={handleLogout}
          >
            <ThemedText type="default" style={styles.logoutText}>
              Logout
            </ThemedText>
          </Pressable>
        </ThemedView>

        <ThemedText
          type="small"
          themeColor="textSecondary"
          style={styles.footer}
        >
          DailyFlow • Build better days
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 110,
    gap: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#3c87f7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  avatarText: {
    color: "#ffffff",
    fontWeight: "700",
  },

  userInfo: {
    flex: 1,
  },

  name: {
    fontSize: 28,
    lineHeight: 34,
  },

  memberText: {
    marginTop: 3,
  },

  card: {
    padding: 18,
    borderRadius: 18,
  },

  cardTitle: {
    fontSize: 22,
    lineHeight: 28,
    marginBottom: 10,
  },

  progressBackground: {
    height: 9,
    borderRadius: 10,
    backgroundColor: "#d9d9d9",
    overflow: "hidden",
    marginTop: 18,
  },

  progressFill: {
    width: "70%",
    height: "100%",
    backgroundColor: "#3c87f7",
    borderRadius: 10,
  },

  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  statBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },

  motivationCard: {
    padding: 18,
    borderRadius: 18,
  },

  motivationText: {
    marginTop: 8,
  },

  logoutButton: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d9534f",
    justifyContent: "center",
    alignItems: "center",
  },

  logoutText: {
    color: "#d9534f",
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.7,
  },

  footer: {
    textAlign: "center",
    marginTop: 4,
  },
});
