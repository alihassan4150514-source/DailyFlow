import { Link } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const initialTasks = [
  { id: 1, title: "Morning prayer", time: "06:00 AM", done: false },
  { id: 2, title: "Exercise & workout", time: "07:00 AM", done: false },
  { id: 3, title: "Study programming", time: "10:00 AM", done: false },
  { id: 4, title: "University classes", time: "08:00 AM", done: false },
  { id: 5, title: "Read 10 pages", time: "08:00 PM", done: false },
  { id: 6, title: "Review daily progress", time: "10:00 PM", done: false },
];

export default function TasksScreen() {
  const [tasks, setTasks] = useState(initialTasks);

  const completed = tasks.filter((task) => task.done).length;

  const toggleTask = (id: number) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F8F4" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Link href="/" asChild>
            <TouchableOpacity style={styles.backButton}>
              <Text style={styles.backText}>‹</Text>
            </TouchableOpacity>
          </Link>

          <View style={styles.headerInfo}>
            <Text style={styles.heading}>My Tasks</Text>
            <Text style={styles.subtitle}>
              Stay focused and get things done.
            </Text>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Your daily tasks</Text>
          <Text style={styles.summaryNumber}>
            {completed} / {tasks.length}
          </Text>
          <Text style={styles.summarySubtitle}>Tasks completed today</Text>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(completed / tasks.length) * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* Task List */}
        <Text style={styles.sectionTitle}>All Tasks</Text>

        {tasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={styles.taskCard}
            activeOpacity={0.7}
            onPress={() => toggleTask(task.id)}
          >
            <View style={[styles.checkbox, task.done && styles.checkboxDone]}>
              {task.done && <Text style={styles.checkmark}>✓</Text>}
            </View>

            <View style={styles.taskInfo}>
              <Text
                style={[styles.taskTitle, task.done && styles.completedText]}
              >
                {task.title}
              </Text>

              <Text style={styles.taskTime}>{task.time}</Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}

        <View style={{ height: 35 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8F4",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 25,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#E5EEE6",
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    fontSize: 35,
    color: "#24543B",
    marginTop: -5,
  },

  headerInfo: {
    marginLeft: 14,
  },

  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#172B26",
  },

  subtitle: {
    fontSize: 12,
    color: "#82908A",
    marginTop: 5,
  },

  summaryCard: {
    backgroundColor: "#173D32",
    marginHorizontal: 20,
    padding: 22,
    borderRadius: 20,
  },

  summaryTitle: {
    color: "#C4D6CB",
    fontSize: 13,
  },

  summaryNumber: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 12,
  },

  summarySubtitle: {
    color: "#C4D6CB",
    fontSize: 12,
    marginTop: 3,
  },

  progressBar: {
    height: 7,
    backgroundColor: "#49675A",
    borderRadius: 10,
    marginTop: 20,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#B4D9B9",
    borderRadius: 10,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#172B26",
    marginHorizontal: 22,
    marginTop: 28,
    marginBottom: 15,
  },

  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8EDE8",
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
    fontWeight: "bold",
    fontSize: 15,
  },

  taskInfo: {
    flex: 1,
    marginLeft: 13,
  },

  taskTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#263C33",
  },

  completedText: {
    textDecorationLine: "line-through",
    color: "#9BA69E",
  },

  taskTime: {
    fontSize: 11,
    color: "#8B9890",
    marginTop: 5,
  },

  arrow: {
    fontSize: 24,
    color: "#A2B0A5",
  },
});
