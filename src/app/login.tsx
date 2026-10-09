import { Link, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Easing,
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Screen entrance animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(35)).current;

  // Plane animations
  const planeOne = useRef(new Animated.Value(-120)).current;
  const planeTwo = useRef(new Animated.Value(-180)).current;

  // Explosion flash
  const explosionAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Plane 1
    Animated.loop(
      Animated.sequence([
        Animated.timing(planeOne, {
          toValue: 1.15,
          duration: 7000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(planeOne, {
          toValue: -0.2,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Plane 2
    Animated.loop(
      Animated.sequence([
        Animated.delay(2500),
        Animated.timing(planeTwo, {
          toValue: 1.2,
          duration: 8500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(planeTwo, {
          toValue: -0.2,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Distant battlefield flash
    Animated.loop(
      Animated.sequence([
        Animated.delay(3200),
        Animated.timing(explosionAnim, {
          toValue: 0.5,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(explosionAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(5000),
      ]),
    ).start();
  }, []);

  const handleLogin = async () => {
    setError("");

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    const success = await login(cleanEmail, password);

    if (success) {
      router.replace("/");
      return;
    }

    setError("Email or password is incorrect.");
  };

  const planeOneTranslateX = planeOne.interpolate({
    inputRange: [-0.2, 1.15],
    outputRange: ["-20%", "120%"],
  });

  const planeTwoTranslateX = planeTwo.interpolate({
    inputRange: [-0.2, 1.2],
    outputRange: ["-30%", "130%"],
  });

  return (
    <View style={styles.container}>
      {/* DARK BATTLEFIELD BACKGROUND */}
      <View style={styles.background} />

      {/* HORIZON GLOW */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.explosionGlow,
          {
            opacity: explosionAnim,
          },
        ]}
      />

      {/* AIRCRAFT 1 */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.plane,
          {
            transform: [
              {
                translateX: planeOneTranslateX,
              },
              {
                translateY: -40,
              },
            ],
          },
        ]}
      >
        <ThemedText style={styles.planeText}>✈</ThemedText>
        <View style={styles.planeTrail} />
      </Animated.View>

      {/* AIRCRAFT 2 */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.planeTwo,
          {
            transform: [
              {
                translateX: planeTwoTranslateX,
              },
              {
                translateY: 30,
              },
            ],
          },
        ]}
      >
        <ThemedText style={styles.planeTwoText}>✈</ThemedText>
      </Animated.View>

      {/* DISTANT SMOKE */}
      <View pointerEvents="none" style={styles.smokeOne} />
      <View pointerEvents="none" style={styles.smokeTwo} />
      <View pointerEvents="none" style={styles.smokeThree} />

      {/* LOGIN CONTENT */}
      <Animated.View
        style={[
          styles.content,
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
        <View style={styles.logoCircle}>
          <ThemedText style={styles.logoText}>D</ThemedText>
        </View>

        <ThemedText type="title" style={styles.title}>
          Welcome Back
        </ThemedText>

        <ThemedText type="default" style={styles.subtitle}>
          Your mission continues.
        </ThemedText>

        {/* COMMAND PANEL */}
        <ThemedView style={styles.formCard}>
          <ThemedText style={styles.commandLabel}>MISSION CONTROL</ThemedText>

          <ThemedText type="smallBold" style={styles.label}>
            Email
          </ThemedText>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            placeholderTextColor="#89958F"
          />

          <ThemedText type="smallBold" style={styles.label}>
            Password
          </ThemedText>

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            placeholderTextColor="#89958F"
          />

          <View style={styles.forgotContainer}>
            <Link href="/forgot-password" asChild>
              <Pressable>
                <ThemedText type="small" style={styles.forgotText}>
                  Forgot Password?
                </ThemedText>
              </Pressable>
            </Link>
          </View>

          {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

          <Pressable
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.pressed,
            ]}
          >
            <ThemedText style={styles.loginButtonText}>
              ENTER MISSION
            </ThemedText>
          </Pressable>
        </ThemedView>

        <View style={styles.signupRow}>
          <ThemedText type="small" style={styles.bottomText}>
            Don't have an account?{" "}
          </ThemedText>

          <Link href="/signup" asChild>
            <Pressable>
              <ThemedText type="smallBold" style={styles.signupText}>
                Sign Up
              </ThemedText>
            </Pressable>
          </Link>
        </View>

        <ThemedText style={styles.footer}>
          DAILYFLOW • DISCIPLINE • FOCUS • CONSISTENCY
        </ThemedText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },

  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#081512",
  },

  explosionGlow: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#C98745",
    left: "55%",
    top: "16%",
  },

  plane: {
    position: "absolute",
    top: "18%",
    left: 0,
    flexDirection: "row",
    alignItems: "center",
  },

  planeText: {
    color: "#AEBDB5",
    fontSize: 25,
    transform: [
      {
        rotate: "-10deg",
      },
    ],
  },

  planeTrail: {
    width: 70,
    height: 1,
    backgroundColor: "#87958E",
    opacity: 0.4,
  },

  planeTwo: {
    position: "absolute",
    top: "31%",
    left: 0,
  },

  planeTwoText: {
    color: "#77877F",
    fontSize: 18,
    opacity: 0.7,
  },

  smokeOne: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#26352F",
    opacity: 0.45,
    left: -55,
    bottom: 80,
  },

  smokeTwo: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "#1B2924",
    opacity: 0.5,
    right: -75,
    bottom: 30,
  },

  smokeThree: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#35443D",
    opacity: 0.25,
    right: 30,
    top: 70,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
  },

  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#173D32",
    borderWidth: 2,
    borderColor: "#789B86",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 16,
  },

  logoText: {
    color: "#D6E5D9",
    fontSize: 32,
    fontWeight: "900",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 36,
    lineHeight: 42,
    textAlign: "center",
  },

  subtitle: {
    color: "#B5C4BD",
    textAlign: "center",
    marginTop: 7,
    marginBottom: 20,
  },

  formCard: {
    backgroundColor: "#102A23",
    borderWidth: 1,
    borderColor: "#315147",
    borderRadius: 20,
    padding: 20,
  },

  commandLabel: {
    color: "#8FB29D",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 14,
  },

  label: {
    color: "#D1DED6",
    marginTop: 12,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#405950",
    borderRadius: 10,
    paddingHorizontal: 14,
    marginTop: 7,
    fontSize: 16,
    color: "#FFFFFF",
    backgroundColor: "#0B1E19",
  },

  forgotContainer: {
    alignItems: "flex-end",
    marginTop: 9,
  },

  forgotText: {
    color: "#9BC5A9",
    fontWeight: "700",
  },

  error: {
    color: "#E9857C",
    marginTop: 12,
    textAlign: "center",
  },

  loginButton: {
    height: 52,
    borderRadius: 11,
    backgroundColor: "#3F7659",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1,
  },

  pressed: {
    opacity: 0.7,
  },

  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },

  bottomText: {
    color: "#9AA9A2",
  },

  signupText: {
    color: "#A8D0B4",
  },

  footer: {
    color: "#61746B",
    fontSize: 8,
    letterSpacing: 1.2,
    textAlign: "center",
    marginTop: 18,
  },
});
