// app/(drawer)/AlertScreen.jsx
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as Device from "expo-device";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import LottieView from "lottie-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = "https://krish09bha-dhruvai.hf.space";

// 🔹 configure how notifications behave when app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function AlertScreen({ navigation }) {
  const { user } = useUser();
  const userId = user?.id;

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [hasNotified, setHasNotified] = useState(false); // ✅ notify only once

  // pulsing animation for loading text
  const fadeAnim = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 900,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // 🔹 Request permission for notifications once
  useEffect(() => {
    const register = async () => {
      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          alert("Enable notifications in settings to receive alerts!");
        }
      } else {
        alert("Push notifications require a physical device");
      }
    };
    register();
  }, []);

  // 🔹 fetch alerts
  const fetchAlerts = useCallback(
    async (shouldNotify = false) => {
      if (!userId) return;
      try {
        setError(null);
        if (!refreshing) setLoading(true);

        const res = await fetch(`${API_URL}/alert/${userId}`, {
          headers: { Accept: "application/json" },
        });

        const text = await res.text();
        if (!res.ok) throw new Error(text);

        let data = JSON.parse(text);
        let alertsData = data?.alerts || [];

        // ✅ newest first
        alertsData.sort((a, b) => {
          const dateA = new Date(a.data?.status_updated_time || 0).getTime();
          const dateB = new Date(b.data?.status_updated_time || 0).getTime();
          return dateB - dateA;
        });

        setAlerts(alertsData);

        // ✅ Send ONE local push when user signs in
        if (shouldNotify && !hasNotified && alertsData.length > 0) {
          const latest = alertsData[0];
          await Notifications.scheduleNotificationAsync({
            content: {
              title: latest.data?.name
                ? `New Alert: ${latest.data.name}`
                : "New Alert Received",
              body:
                latest.type === "lost"
                  ? `Lost at ${latest.data?.where_lost || "unknown"}`
                  : `Found at ${latest.data?.location_found || "unknown"}`,
              sound: "default",
            },
            trigger: null, // 🔔 show immediately
          });
          setHasNotified(true);
        }
      } catch (err) {
        console.error("❌ Fetch error:", err.message);
        setError("Unable to fetch alerts. Please try again later.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [userId, hasNotified, refreshing]
  );

  // 🔹 Fetch ONCE after login → notify
  useEffect(() => {
    if (userId) {
      fetchAlerts(true);
    }
  }, [userId]);

  // 🔹 Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchAlerts(false);
  };

  // --- UI ---
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <LottieView
          source={require("../../../assets/info.json")}
          autoPlay
          loop
          style={{ width: 220, height: 220 }}
        />
        <Animated.Text
          style={{ opacity: fadeAnim }}
          className="text-blue-500 text-lg font-bold mt-4"
        >
          Loading alerts…
        </Animated.Text>
        <Text className="text-gray-500 text-sm mt-2">
          Fetching in secure mode 🔒
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-6">
        <Ionicons name="cloud-offline-outline" size={42} color="red" />
        <Text className="text-red-600 font-bold text-center mt-2">
          Failed to load alerts
        </Text>
        <Text className="text-gray-500 text-center mt-1">{error}</Text>
      </View>
    );
  }

  if (alerts.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Ionicons name="notifications-off-outline" size={40} color="#777" />
        <Text className="text-lg font-bold text-gray-700 mt-2">
          No active alerts
        </Text>
        <Text className="text-gray-500 text-sm mt-1">
          You'll see alerts here once new reports arrive.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <LinearGradient
        colors={["#5D5FEF", "#7879F1"]}
        className="py-6 rounded-b-3xl shadow-md"
      >
        <View className="flex-row items-center justify-center">
          <Ionicons name="alert-circle-outline" size={26} color="#fff" />
          <Text className="text-white font-bold text-lg ml-2">
            Active Alerts ({alerts.length})
          </Text>
        </View>
      </LinearGradient>

      {/* List */}
      <FlatList
        data={alerts}
        renderItem={({ item }) => renderAlert(item, navigation)}
        keyExtractor={(item, idx) => item.data?.face_id || idx.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 60, paddingTop: 10 }}
      />
    </SafeAreaView>
  );
}

// --- Render alert card ---
const renderAlert = (item, navigation) => {
  const isLost = item.type === "lost";
  const borderColor = isLost ? "#EF5DA8" : "#5D5FEF";
  const person = item.data || {};

  return (
    <View
      style={[styles.card, { borderLeftColor: borderColor }]}
      className="bg-white rounded-xl mx-4 mt-4 p-4 shadow-md"
    >
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons
            name="person-circle-outline"
            size={42}
            color={borderColor}
          />
          <View className="ml-3">
            <Text className="text-base font-bold text-[#202020]">
              {person.name || "Unknown"}
            </Text>
            <Text style={{ color: borderColor }} className="text-xs mt-0.5">
              {isLost
                ? `Lost at: ${person.where_lost || "-"}`
                : `Found at: ${person.location_found || "-"}`}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation?.navigate("AlertDetails", { alert: item })
          }
          style={{ backgroundColor: borderColor }}
          className="px-3 py-1 rounded-full"
        >
          <Text className="text-white text-xs font-bold">View</Text>
        </TouchableOpacity>
      </View>

      {/* Body */}
      <View className="mt-3">
        <Text className="text-gray-700 text-sm">
          {person.gender || "?"}, Age {person.age || "?"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 5,
  },
});