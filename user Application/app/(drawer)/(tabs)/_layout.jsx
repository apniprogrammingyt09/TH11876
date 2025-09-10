import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import LottieView from "lottie-react-native";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function TabsLayout() {
  const [showLottie, setShowLottie] = useState(false);

  // Function to trigger the animation overlay
  const triggerLottie = () => {
    setShowLottie(true);
    setTimeout(() => {
      setShowLottie(false);
    }, 2000); // show animation for 2 seconds
  };

  return (
    <>
      {/* ⬆️ Lottie Overlay */}
      {showLottie && (
        <View style={styles.lottieOverlay}>
          <LottieView
            source={require("../../../assets/AiReportcard.json")}
            autoPlay
            loop={false}
            style={{ width: 230, height: 230 }}
          />
        </View>
      )}

      {/* ⬇️ Tabs */}
      <Tabs
        screenListeners={{
          tabPress: () => {
            triggerLottie();
          },
        }}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 80,
            borderTopWidth: 0,
            elevation: 0,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            borderRadius: 0, // flush rectangle tab bar
            marginHorizontal: 0,
            marginBottom: 0,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowOffset: { width: 0, height: -2 },
            shadowRadius: 4,
            paddingBottom: 5,
            paddingTop: 5,
          },
        }}
      >
        {/* HOME */}
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon name="home" label="Home" focused={focused} />
            ),
          }}
        />

        {/* MAP */}
        <Tabs.Screen
          name="Map"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon name="map" label="Map" focused={focused} />
            ),
          }}
        />

        {/* ALERT */}
        <Tabs.Screen
          name="Alert"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                name="notifications"
                label="Alert"
                focused={focused}
              />
            ),
          }}
        />

        {/* ABOUT */}
        <Tabs.Screen
          name="notification"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                name="information-circle"
                label="About"
                focused={focused}
              />
            ),
          }}
        />

        {/* REPORTS */}
        <Tabs.Screen
          name="MyReport"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon 
                name={focused ? "document-text" : "document-text-outline"}
                label="Repo.."
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

// Reusable Tab Icon (icon + label)
function TabIcon({ name, label, focused }) {
  return (
    <View className="items-center justify-center">
      <View
        className={`items-center justify-center rounded-full w-14 h-14 mb-1 ${
          focused ? "bg-orange-100 -mt-6 shadow-md" : ""
        }`}
      >
        <Ionicons
          name={name}
          size={26}
          color={focused ? "#f97316" : "#9ca3af"}
        />
      </View>
      <Text
        className={`text-xs ${
          focused ? "text-orange-600 font-bold" : "text-gray-400"
        }`}
      >
        {label}
      </Text>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  lottieOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.95)", // semi-transparent overlay
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99,
  },
});