import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

type User = {
  name: string;
  email: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  resetPassword: (email: string, newPassword: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = "@dailyflow_user";
const LOGIN_KEY = "@dailyflow_logged_in";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const savedUser = await AsyncStorage.getItem(USER_KEY);
      const loggedIn = await AsyncStorage.getItem(LOGIN_KEY);

      if (savedUser && loggedIn === "true") {
        const parsedUser: User = JSON.parse(savedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.log("Session restore error:", error);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const cleanName = name.trim();
      const cleanEmail = email.trim().toLowerCase();

      if (!cleanName || !cleanEmail || !password) {
        return false;
      }

      const savedUser = await AsyncStorage.getItem(USER_KEY);

      if (savedUser) {
        const existingUser: User = JSON.parse(savedUser);

        if (existingUser.email === cleanEmail) {
          return false;
        }
      }

      const newUser: User = {
        name: cleanName,
        email: cleanEmail,
        password,
      };

      await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser));

      await AsyncStorage.setItem(LOGIN_KEY, "true");

      setUser(newUser);

      return true;
    } catch (error) {
      console.log("Signup error:", error);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();

      const savedUser = await AsyncStorage.getItem(USER_KEY);

      if (!savedUser) {
        return false;
      }

      const storedUser: User = JSON.parse(savedUser);

      if (storedUser.email === cleanEmail && storedUser.password === password) {
        await AsyncStorage.setItem(LOGIN_KEY, "true");

        setUser(storedUser);

        return true;
      }

      return false;
    } catch (error) {
      console.log("Login error:", error);
      return false;
    }
  };

  const resetPassword = async (email: string, newPassword: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();

      if (newPassword.length < 6) {
        return false;
      }

      const savedUser = await AsyncStorage.getItem(USER_KEY);

      if (!savedUser) {
        return false;
      }

      const storedUser: User = JSON.parse(savedUser);

      if (storedUser.email !== cleanEmail) {
        return false;
      }

      const updatedUser: User = {
        ...storedUser,
        password: newPassword,
      };

      await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

      return true;
    } catch (error) {
      console.log("Reset password error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // IMPORTANT:
      // User account remains saved.
      // Only the login session is removed.
      await AsyncStorage.setItem(LOGIN_KEY, "false");

      setUser(null);
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
