import axios from "axios";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const API_URL = "https://jsonplaceholder.typicode.com/posts";

export default function ExploreScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function fetchPosts(isRefresh = false) {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await axios.get<Post[]>(API_URL);
      setPosts(response.data);
    } catch {
      setError("Unable to load posts. Check your internet and try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  function renderPost({ item }: { item: Post }) {
    return (
      <View style={styles.card}>
        <Text style={styles.postNumber}>POST #{item.id}</Text>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postBody}>{item.body}</Text>
        <Text style={styles.author}>User ID: {item.userId}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F8F4" />

      <View style={styles.header}>
        <Text style={styles.eyebrow}>DISCOVER & LEARN</Text>
        <Text style={styles.heading}>Explore</Text>
        <Text style={styles.subtitle}>
          Fresh posts fetched directly from a public API.
        </Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#24543B" />
          <Text style={styles.message}>Loading posts...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchPosts()}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderPost}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchPosts(true)}
              tintColor="#24543B"
            />
          }
          ListHeaderComponent={
            <Text style={styles.results}>
              {posts.length} POSTS FROM PUBLIC API
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8F4",
  },
  header: {
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 22,
  },
  eyebrow: {
    color: "#39835E",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#172B26",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 13,
    color: "#82908A",
    marginTop: 6,
    lineHeight: 20,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 35,
  },
  results: {
    color: "#82908A",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 17,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E8EDE8",
  },
  postNumber: {
    color: "#39835E",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  postTitle: {
    color: "#172B26",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 9,
    textTransform: "capitalize",
    lineHeight: 22,
  },
  postBody: {
    color: "#68786E",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  author: {
    color: "#39835E",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 12,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },
  message: {
    color: "#68786E",
    marginTop: 12,
  },
  errorText: {
    color: "#B42318",
    textAlign: "center",
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: "#24543B",
    borderRadius: 10,
    paddingHorizontal: 22,
    paddingVertical: 12,
    marginTop: 15,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
