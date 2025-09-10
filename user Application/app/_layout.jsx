
// // app/_layout.jsx
// import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
// import { Slot, Stack } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import { ActivityIndicator, StyleSheet, View } from "react-native";
// import Toast from "react-native-toast-message";
// import "../global.css";

// // Secure token storage
// const tokenCache = {
//   getToken: (key) => SecureStore.getItemAsync(key),
//   saveToken: (key, value) => SecureStore.setItemAsync(key, value),
// };

// const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
// if (!CLERK_PUBLISHABLE_KEY) {
//   throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY");
// }

// // Decides which navigator segment to show
// function InitialLayout() {
//   const { isSignedIn, isLoaded } = useAuth();

//   if (!isLoaded) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" color="tomato" />
//       </View>
//     );
//   }

//   // 👇 expo-router will choose between (auth) or (drawer) folder
//   return <Slot initialRouteName={isSignedIn ? "(drawer)" : "(auth)"} />;
// }

// export default function RootLayout() {
//   return (
//     <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
//       <Stack screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="(auth)" options={{ headerShown: false }} />
//         <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
//       </Stack>
//              <Toast /> 

//     </ClerkProvider>
//   );
// }

// const styles = StyleSheet.create({
//   loader: { flex: 1, justifyContent: "center", alignItems: "center" },
// });




import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Slot, Stack, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import "../global.css";

// Secure token storage
const tokenCache = {
  getToken: (key) => SecureStore.getItemAsync(key),
  saveToken: (key, value) => SecureStore.setItemAsync(key, value),
};

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY");
}

function InitialLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="tomato" />
      </View>
    );
  }
  return <Slot initialRouteName={isSignedIn ? "(drawer)" : "(auth)"} />;
}

export default function RootLayout() {
  const router = useRouter();

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <Stack
        screenOptions={{
          headerShown: false, // enable header
          headerRight: () => (
            <Pressable
              onPress={() => router.push("/Alert")}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="notifications-outline" size={26} color="tomato" />
            </Pressable>
          ),
        }}
      >
        {/* Auth stack */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        {/* Drawer stack */}
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      </Stack>

      <Toast />
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
});