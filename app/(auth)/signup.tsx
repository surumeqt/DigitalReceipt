import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { useSSO } from "@clerk/clerk-expo";

export default function SignUpScreen() {
  const router = useRouter();
  const { startSSOFlow } = useSSO();

  const handleGoogleSignIn = async () => {
    try {
      console.log("Google Sign-In started...");
      const { createdSessionId, setActive } = await startSSOFlow({ strategy: "oauth_google"});

      console.log("OAuth result:", { createdSessionId });
      if (setActive && createdSessionId) {
        console.log("Session created, redirecting...");
        setActive({session:createdSessionId});
        router.replace("/(tabs)");
      } else {
        console.error("No session created!");
      }

    } catch (error) {
      console.error("❌ Google Sign-In Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <View style={styles.oauthContainer}>
        <Button mode="outlined" icon="google" style={styles.oauthButton} onPress={() => handleGoogleSignIn()}>
          Sign in with Google
        </Button>
      </View>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  oauthContainer: {
    marginTop: 20,
    width: "100%",
  },
  oauthButton: {
    marginTop: 10,
    borderRadius: 5,
  },
  linkText: {
    marginTop: 15,
    color: "#007BFF",
    fontSize: 16,
  },
});
