import { Link } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";

const initialTasks = [
  {
    id: 1,
    title: "Morning prayer",
    time: "06:00 AM",
    done: true,
  },
  {
    id: 2,
    title: "Exercise & workout",
    time: "07:00 AM",
    done: false,
  },
  {
    id: 3,
    title: "Study programming",
    time: "10:00 AM",
    done: false,
  },
  {
    id: 4,
    title: "Read 10 pages",
    time: "08:00 PM",
    done: false,
  },
];

export default function HomeScreen() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState(initialTasks);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const slideAnim = useRef(new Animated.Value(25)).current;

  const pulseAnim = useRef(new Animated.Value(1)).current;

  const progressWidthAnim = useRef(new Animated.Value(0)).current;

  const userName = user?.name || "User";
  const firstName = userName.trim().split(" ")[0] || "User";

  const firstLetter = userName.charAt(0).toUpperCase() || "U";

  const completedTasks = tasks.filter((task) => task.done).length;

  const progress = Math.round((completedTasks / tasks.length) * 100);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.timing(progressWidthAnim, {
      toValue: progress,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const toggleTask = (id: number) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              done: !task.done,
            }
          : task,
      ),
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#102A23" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          style={[
            styles.animatedContent,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim,
                },
              ],
            },
          ]}
        >
          {/* HERO HEADER */}
          <View style={styles.hero}>
            <View style={styles.heroTop}>
              <View style={styles.heroText}>
                <Text style={styles.overline}>DAILYFLOW • MISSION CONTROL</Text>

                <Text style={styles.greeting}>
                  Good morning, {firstName} 👋
                </Text>

                <Text style={styles.heroSubtitle}>
                  Stay focused. Stay disciplined. Win the day.
                </Text>
              </View>

              <View style={styles.profile}>
                <Text style={styles.profileText}>{firstLetter}</Text>
              </View>
            </View>

            <View style={styles.missionBadge}>
              <View style={styles.statusDot} />

              <Text style={styles.missionText}>TODAY'S MISSION IS ACTIVE</Text>
            </View>
          </View>

          {/* PROGRESS */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <View>
                <Text style={styles.cardLabel}>DAILY PROGRESS</Text>

                <Text style={styles.progressNumber}>{progress}%</Text>

                <Text style={styles.progressDescription}>
                  {completedTasks === tasks.length
                    ? "Mission complete. Excellent work."
                    : "Keep moving. The day is still yours."}
                </Text>
              </View>

              <Animated.View
                style={[
                  styles.progressCircle,
                  {
                    transform: [
                      {
                        scale: pulseAnim,
                      },
                    ],
                  },
                ]}
              >
                <Text style={styles.progressEmoji}>⚔️</Text>
              </Animated.View>
            </View>

            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressWidthAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>

            <Text style={styles.progressFooter}>
              {completedTasks} of {tasks.length} objectives completed
            </Text>
          </View>

          {/* ROUTINE */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daily Battle Plan</Text>

            <Text style={styles.sectionLink}>Today</Text>
          </View>

          <View style={styles.routineContainer}>
            <View style={styles.routineItem}>
              <Text style={styles.routineEmoji}>🌅</Text>

              <Text style={styles.routineTitle}>Morning</Text>

              <Text style={styles.routineTime}>5 AM – 9 AM</Text>
            </View>

            <View style={styles.routineItem}>
              <Text style={styles.routineEmoji}>☀️</Text>

              <Text style={styles.routineTitle}>Work</Text>

              <Text style={styles.routineTime}>9 AM – 5 PM</Text>
            </View>

            <View style={styles.routineItem}>
              <Text style={styles.routineEmoji}>🌙</Text>

              <Text style={styles.routineTitle}>Night</Text>

              <Text style={styles.routineTime}>7 PM – 11 PM</Text>
            </View>
          </View>

          {/* TASKS */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Objectives</Text>

            <Link href="/tasks" asChild>
              <TouchableOpacity>
                <Text style={styles.sectionLink}>View all →</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {tasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={[styles.taskCard, task.done && styles.taskCardDone]}
              onPress={() => toggleTask(task.id)}
              activeOpacity={0.75}
            >
              <View style={[styles.checkbox, task.done && styles.checkboxDone]}>
                {task.done && <Text style={styles.checkmark}>✓</Text>}
              </View>

              <View style={styles.taskInfo}>
                <Text
                  style={[styles.taskTitle, task.done && styles.taskCompleted]}
                >
                  {task.title}
                </Text>

                <Text style={styles.taskTime}>{task.time}</Text>
              </View>

              <Text style={styles.taskArrow}>{task.done ? "✓" : "›"}</Text>
            </TouchableOpacity>
          ))}

          {/* MOTIVATION */}
          <View style={styles.quoteCard}>
            <Text style={styles.quoteIcon}>🛡️</Text>

            <View style={styles.quoteContent}>
              <Text style={styles.quoteTitle}>DISCIPLINE OVER MOOD</Text>

              <Text style={styles.quoteText}>
                You don't need to feel ready. You just need to take the next
                step.
              </Text>

              <Text style={styles.quoteAuthor}>— DailyFlow</Text>
            </View>
          </View>

          <View style={styles.bottomSpace} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F6F2",
  },

  scrollContent: {
    paddingBottom: 40,
  },

  animatedContent: {
    flex: 1,
  },

  hero: {
    backgroundColor: "#102A23",
    paddingHorizontal: 22,
    paddingTop: 55,
    paddingBottom: 25,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  heroText: {
    flex: 1,
    paddingRight: 15,
  },

  overline: {
    color: "#8DB39C",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.6,
    marginBottom: 8,
  },

  greeting: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  heroSubtitle: {
    fontSize: 13,
    color: "#BBD0C3",
    marginTop: 6,
    lineHeight: 19,
  },

  profile: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#D4E6D8",
    justifyContent: "center",
    alignItems: "center",
  },

  profileText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#173D32",
  },

  missionBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#193B31",
    borderWidth: 1,
    borderColor: "#31584A",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 20,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#B4D9B9",
    marginRight: 7,
  },

  missionText: {
    color: "#C8DED0",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },

  progressCard: {
    backgroundColor: "#173D32",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 22,
    padding: 22,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 4,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardLabel: {
    color: "#B7D0C1",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  progressNumber: {
    color: "#FFFFFF",
    fontSize: 44,
    fontWeight: "900",
    marginTop: 5,
  },

  progressDescription: {
    color: "#C4D6CB",
    fontSize: 12,
    marginTop: 2,
  },

  progressCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#31594B",
    justifyContent: "center",
    alignItems: "center",
  },

  progressEmoji: {
    fontSize: 31,
  },

  progressBar: {
    height: 8,
    backgroundColor: "#49675A",
    borderRadius: 10,
    marginTop: 22,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#B4D9B9",
    borderRadius: 10,
  },

  progressFooter: {
    color: "#D2E2D7",
    fontSize: 11,
    marginTop: 10,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 22,
    marginTop: 28,
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#172B26",
  },

  sectionLink: {
    color: "#39835E",
    fontSize: 13,
    fontWeight: "700",
  },

  routineContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    gap: 9,
  },

  routineItem: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 7,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E8E1",
  },

  routineEmoji: {
    fontSize: 24,
    marginBottom: 9,
  },

  routineTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#263C33",
  },

  routineTime: {
    fontSize: 9,
    color: "#8B9890",
    marginTop: 5,
  },

  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 14,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E1E8E2",
  },

  taskCardDone: {
    backgroundColor: "#F1F7F2",
    borderColor: "#CDE0D1",
  },

  checkbox: {
    width: 23,
    height: 23,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: "#A9B9AD",
    justifyContent: "center",
    alignItems: "center",
  },

  checkboxDone: {
    backgroundColor: "#39835E",
    borderColor: "#39835E",
  },

  checkmark: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 15,
  },

  taskInfo: {
    flex: 1,
    marginLeft: 13,
  },

  taskTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#263C33",
  },

  taskCompleted: {
    textDecorationLine: "line-through",
    color: "#8F9E95",
  },

  taskTime: {
    fontSize: 11,
    color: "#8B9890",
    marginTop: 5,
  },

  taskArrow: {
    fontSize: 20,
    color: "#39835E",
    fontWeight: "800",
  },

  quoteCard: {
    flexDirection: "row",
    backgroundColor: "#E3ECE5",
    marginHorizontal: 20,
    marginTop: 18,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D2E0D4",
  },

  quoteIcon: {
    fontSize: 27,
    marginRight: 13,
  },

  quoteContent: {
    flex: 1,
  },

  quoteTitle: {
    color: "#315541",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.3,
    marginBottom: 6,
  },

  quoteText: {
    fontSize: 13,
    color: "#315541",
    lineHeight: 21,
  },

  quoteAuthor: {
    fontSize: 11,
    color: "#63836C",
    marginTop: 8,
    textAlign: "right",
  },

  bottomSpace: {
    height: 25,
  },
});
