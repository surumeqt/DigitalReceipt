import React from "react";
import { View, Button } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function LogoutScreen() {
  const router = useRouter();
  const { signOut } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        title="Logout Now"
        onPress={async () => {
          await signOut();
          console.log("✅ Signed Out!");
          router.replace("/login");
        }}
      />
    </View>
  );
}