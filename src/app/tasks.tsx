import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Task = {
  id: number;
  title: string;
  time: string;
  done: boolean;
  category: string;
};

const STORAGE_KEY = "@dailyflow_tasks";

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Morning prayer",
    time: "06:00 AM",
    done: false,
    category: "Personal",
  },
  {
    id: 2,
    title: "Exercise & workout",
    time: "07:00 AM",
    done: false,
    category: "Fitness",
  },
  {
    id: 3,
    title: "Study programming",
    time: "10:00 AM",
    done: false,
    category: "Study",
  },
  {
    id: 4,
    title: "University classes",
    time: "08:00 AM",
    done: false,
    category: "Study",
  },
  {
    id: 5,
    title: "Read 10 pages",
    time: "08:00 PM",
    done: false,
    category: "Personal",
  },
  {
    id: 6,
    title: "Review daily progress",
    time: "10:00 PM",
    done: false,
    category: "Personal",
  },
];

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Pending" | "Completed">("All");
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("Personal");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    async function loadTasks() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
          setTasks(JSON.parse(saved));
        } else {
          setTasks(initialTasks);
        }
      } catch {
        Alert.alert("Error", "Could not load saved tasks.");
        setTasks(initialTasks);
      } finally {
        setLoaded(true);
      }
    }
    loadTasks();
  }, []);

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch(() =>
        Alert.alert("Storage Error", "Tasks could not be saved."),
      );
    }
  }, [tasks, loaded]);

  const completed = tasks.filter((task) => task.done).length;

  const visibleTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.category.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === "All" ||
        (filter === "Completed" && task.done) ||
        (filter === "Pending" && !task.done);
      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, filter]);

  function saveTask() {
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      Alert.alert("Missing title", "Please enter a task name.");
      return;
    }

    if (editingId !== null) {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === editingId
            ? {
                ...task,
                title: cleanTitle,
                time: time.trim() || "Anytime",
                category: category.trim() || "Personal",
              }
            : task,
        ),
      );
      setEditingId(null);
    } else {
      const newTask: Task = {
        id: Date.now(),
        title: cleanTitle,
        time: time.trim() || "Anytime",
        done: false,
        category: category.trim() || "Personal",
      };
      setTasks((previous) => [newTask, ...previous]);
    }

    setTitle("");
    setTime("");
    setCategory("Personal");
  }

  function editTask(task: Task) {
    setEditingId(task.id);
    setTitle(task.title);
    setTime(task.time);
    setCategory(task.category);
  }

  function deleteTask(id: number) {
    Alert.alert("Delete task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setTasks((previous) => previous.filter((task) => task.id !== id));
          if (editingId === id) {
            setEditingId(null);
            setTitle("");
            setTime("");
            setCategory("Personal");
          }
        },
      },
    ]);
  }

  function toggleTask(id: number) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  }

  function cancelEdit() {
    setEditingId(null);
    setTitle("");
    setTime("");
    setCategory("Personal");
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F8F4" />

      <FlatList
        data={visibleTasks}
        keyExtractor={(item) => String(item.id)}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
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
                    {
                      width: `${tasks.length ? (completed / tasks.length) * 100 : 0}%`,
                    },
                  ]}
                />
              </View>
            </View>

            <Text style={styles.sectionTitle}>
              {editingId !== null ? "Edit Task" : "Add New Task"}
            </Text>

            <View style={styles.formCard}>
              <TextInput
                style={styles.input}
                placeholder="Task name"
                placeholderTextColor="#89958D"
                value={title}
                onChangeText={setTitle}
              />
              <TextInput
                style={styles.input}
                placeholder="Time (e.g. 06:00 AM)"
                placeholderTextColor="#89958D"
                value={time}
                onChangeText={setTime}
              />
              <TextInput
                style={styles.input}
                placeholder="Category (e.g. Study)"
                placeholderTextColor="#89958D"
                value={category}
                onChangeText={setCategory}
              />
              <TouchableOpacity style={styles.primaryButton} onPress={saveTask}>
                <Text style={styles.primaryButtonText}>
                  {editingId !== null ? "Save Changes" : "+ Add Task"}
                </Text>
              </TouchableOpacity>
              {editingId !== null && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={cancelEdit}
                >
                  <Text style={styles.cancelText}>Cancel Editing</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.sectionTitle}>Find Tasks</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by task or category..."
              placeholderTextColor="#89958D"
              value={search}
              onChangeText={setSearch}
            />

            <View style={styles.filterRow}>
              {(["All", "Pending", "Completed"] as const).map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.filterButton,
                    filter === item && styles.filterActive,
                  ]}
                  onPress={() => setFilter(item)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      filter === item && styles.filterTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>
              All Tasks ({visibleTasks.length})
            </Text>
          </View>
        }
        renderItem={({ item: task }) => (
          <View style={styles.taskCard}>
            <TouchableOpacity
              style={[styles.checkbox, task.done && styles.checkboxDone]}
              onPress={() => toggleTask(task.id)}
            >
              {task.done && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.taskInfo}
              onPress={() => toggleTask(task.id)}
            >
              <Text
                style={[styles.taskTitle, task.done && styles.completedText]}
              >
                {task.title}
              </Text>
              <Text style={styles.taskTime}>
                {task.time} • {task.category}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => editTask(task)}
            >
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => deleteTask(task.id)}
            >
              <Text style={styles.deleteText}>Del</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No tasks found. Add a task or change your search.
          </Text>
        }
        ListFooterComponent={<View style={{ height: 35 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8F4" },
  listContent: { paddingBottom: 10 },
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
  backText: { fontSize: 35, color: "#24543B", marginTop: -5 },
  headerInfo: { marginLeft: 14 },
  heading: { fontSize: 24, fontWeight: "bold", color: "#172B26" },
  subtitle: { fontSize: 12, color: "#82908A", marginTop: 5 },
  summaryCard: {
    backgroundColor: "#173D32",
    marginHorizontal: 20,
    padding: 22,
    borderRadius: 20,
  },
  summaryTitle: { color: "#C4D6CB", fontSize: 13 },
  summaryNumber: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 12,
  },
  summarySubtitle: { color: "#C4D6CB", fontSize: 12, marginTop: 3 },
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
    marginTop: 25,
    marginBottom: 12,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8EDE8",
  },
  input: {
    backgroundColor: "#F7F8F4",
    borderWidth: 1,
    borderColor: "#E0E8E0",
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 12,
    marginBottom: 10,
    color: "#172B26",
  },
  primaryButton: {
    backgroundColor: "#24543B",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  primaryButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 14 },
  cancelButton: { padding: 10, alignItems: "center" },
  cancelText: { color: "#52685B", fontWeight: "600" },
  searchInput: {
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E8E0",
    padding: 13,
    color: "#172B26",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 20,
    marginTop: 12,
  },
  filterButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
    backgroundColor: "#E5EEE6",
  },
  filterActive: { backgroundColor: "#24543B" },
  filterText: { color: "#24543B", fontWeight: "600", fontSize: 12 },
  filterTextActive: { color: "#FFFFFF" },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 13,
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
  checkboxDone: { backgroundColor: "#39835E", borderColor: "#39835E" },
  checkmark: { color: "#FFFFFF", fontWeight: "bold", fontSize: 15 },
  taskInfo: { flex: 1, marginLeft: 10 },
  taskTitle: { fontSize: 13, fontWeight: "600", color: "#263C33" },
  completedText: { textDecorationLine: "line-through", color: "#9BA69E" },
  taskTime: { fontSize: 10, color: "#8B9890", marginTop: 5 },
  actionButton: { paddingHorizontal: 6, paddingVertical: 8 },
  editText: { color: "#24543B", fontWeight: "bold", fontSize: 12 },
  deleteText: { color: "#C0392B", fontWeight: "bold", fontSize: 12 },
  emptyText: {
    textAlign: "center",
    color: "#82908A",
    marginHorizontal: 25,
    marginTop: 15,
    lineHeight: 20,
  },
});
