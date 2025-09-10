// import { Entypo, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import LottieView from "lottie-react-native";
// import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

// export default function HomeTab() {
//   return (
//     <LinearGradient colors={["#5D5FEF", "#7879F1"]} className="flex-1">
//       {/* Top Animation */}
//       <LottieView
//         source={require("../../../assets/AIrobotassistant.json")}
//         autoPlay
//         loop
//         style={{ width: 220, height: 220, position: "absolute", top: -10, right: -10 }}
//       />

//       {/* Content Scroll */}
//       <ScrollView
//         contentContainerStyle={{ flexGrow: 1, paddingBottom: 110 }}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Header */}
//         <View className="mt-24 px-6">
//           <Text className="text-white text-4xl font-extrabold tracking-tight drop-shadow-md">
//             Dhruv AI
//           </Text>
//           <Text className="text-white text-xl font-semibold mt-6 leading-snug opacity-90">
//             A Guiding Star{"\n"}
//             <Text className="text-white text-xl font-medium opacity-80">
//               to Bring the Lost Back Home
//             </Text>
//           </Text>
//         </View>

//         {/* White Section */}
//         <View className="flex-1 bg-white mt-10 rounded-t-[40px] p-6 shadow-md">

//           {/* Quick Actions */}
//           <Text className="text-xl font-bold mb-4">Quick Actions</Text>
//           <View className="flex-row justify-between">
//             <TouchableOpacity className="items-center w-1/3">
//               <View className="bg-indigo-100 p-5 rounded-full">
//                 <MaterialIcons name="person-off" size={30} color="#3F51B5" />
//               </View>
//               <Text className="text-sm text-center mt-2 font-medium text-gray-700">
//                 Report Lost
//               </Text>
//             </TouchableOpacity>

         

//             <TouchableOpacity className="items-center w-1/3">
//               <View className="bg-green-100 p-5 rounded-full">
//                 <Entypo name="map" size={28} color="#2E7D32" />
//               </View>
//               <Text className="text-sm text-center mt-2 font-medium text-gray-700">
//                 Map
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* Active Alert */}
//           <Text className="text-xl font-bold mt-8 mb-3">Active Alert</Text>
//           <TouchableOpacity className="bg-red-500 p-5 rounded-2xl mb-5 shadow-md">
//             <View className="flex-row items-center">
//               <Ionicons name="alert-circle" size={32} color="white" />
//               <View className="ml-3">
//                 <Text className="text-white font-bold text-lg">Jochi Doe</Text>
//                 <Text className="text-white text-sm opacity-90">
//                   Age 34 • Possible Match Found
//                 </Text>
//               </View>
//             </View>
//           </TouchableOpacity>

//           {/* Map Preview */}
//           <View className="bg-gray-100 rounded-2xl h-44 overflow-hidden mb-8 shadow-sm">
//             <Image
//               source={require("../../../assets/map.webp")}
//               className="w-full h-full"
//               resizeMode="cover"
//             />
//           </View>

//           {/* Features & Services */}
//           <Text className="text-xl font-bold mb-4">Features & Services</Text>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            
//             {/* Card 1 */}
//             <TouchableOpacity className="w-44 bg-indigo-50 rounded-xl p-5 mr-4 items-center shadow-sm">
//               <View className="bg-indigo-200 p-4 rounded-full">
//                 <Ionicons name="information-circle-sharp" size={28} color="#3F51B5" />
//               </View>
//               <Text className="mt-3 font-semibold text-center text-indigo-900">Overview</Text>
//             </TouchableOpacity>

//             {/* Card 2 */}
//             <TouchableOpacity className="w-44 bg-pink-50 rounded-xl p-5 mr-4 items-center shadow-sm">
//               <View className="bg-pink-200 p-4 rounded-full">
//                 <MaterialIcons name="psychology" size={28} color="#AD1457" />
//               </View>
//               <Text className="mt-3 font-semibold text-center text-pink-900">Methodology</Text>
//             </TouchableOpacity>

//             {/* Card 3 */}
//             <TouchableOpacity className="w-44 bg-green-50 rounded-xl p-5 mr-4 items-center shadow-sm">
//               <View className="bg-green-200 p-4 rounded-full">
//                 <FontAwesome5 name="project-diagram" size={24} color="#1B5E20" />
//               </View>
//               <Text className="mt-3 font-semibold text-center text-green-900">Architecture</Text>
//             </TouchableOpacity>

//             {/* Card 4 */}
//             <TouchableOpacity className="w-44 bg-yellow-50 rounded-xl p-5 mr-4 items-center shadow-sm">
//               <View className="bg-yellow-200 p-4 rounded-full">
//                 <Ionicons name="construct" size={28} color="#F57F17" />
//               </View>
//               <Text className="mt-3 font-semibold text-center text-yellow-900">Implementation</Text>
//             </TouchableOpacity>

//             {/* Card 5 */}
//             <TouchableOpacity className="w-44 bg-purple-50 rounded-xl p-5 items-center shadow-sm">
//               <View className="bg-purple-200 p-4 rounded-full">
//                 <MaterialIcons name="update" size={28} color="#6A1B9A" />
//               </View>
//               <Text className="mt-3 font-semibold text-center text-purple-900">Future Work</Text>
//             </TouchableOpacity>
//           </ScrollView>

//           {/* Unique Feature */}
//           <View className="mt-8 p-5 bg-blue-50 rounded-xl border border-blue-200 shadow-sm">
//             <Text className="text-lg font-bold text-blue-700">✨ Unique Feature</Text>
//             <Text className="text-sm text-gray-700 mt-2 leading-5">
//               "Hope Tracker" – A real-time dashboard that alerts families instantly when a match 
//               is detected anywhere in the network, ensuring fast action.
//             </Text>
//           </View>
//         </View>
//       </ScrollView>
//     </LinearGradient>
//   );
// }


import { Entypo, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useUser } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useState } from "react";
import Toast from "react-native-toast-message";

const API_URL = "https://krish09bha-dhruvai.hf.space";

// Notifications config for foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function HomeTab() {
  const { user } = useUser();
  const userId = user?.id;

  const [alerts, setAlerts] = useState([]);
  const [lastSeenAlertId, setLastSeenAlertId] = useState(null);

  // Load saved state
  useEffect(() => {
    AsyncStorage.getItem("lastSeenAlertId").then(id => id && setLastSeenAlertId(id));
  }, []);

  // Request permission once
  useEffect(() => {
    const register = async () => {
      if (Device.isDevice) {
        const { status: existing } = await Notifications.getPermissionsAsync();
        let final = existing;
        if (existing !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          final = status;
        }
        if (final !== "granted") {
          alert("Enable notifications in settings to receive alerts!");
        }
      } else {
        alert("Push notifications require a physical device");
      }
    };
    register();
  }, []);

  // Fetch alerts
  const fetchAlerts = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_URL}/alert/${userId}`, {
        headers: { Accept: "application/json" },
      });
      const text = await res.text();
      let data = JSON.parse(text);
      let alertsData = data?.alerts || [];

      alertsData.sort((a, b) => {
        const dateA = new Date(a.data?.status_updated_time || 0).getTime();
        const dateB = new Date(b.data?.status_updated_time || 0).getTime();
        return dateB - dateA;
      });

      setAlerts(alertsData);

      if (alertsData.length > 0) {
        const latest = alertsData[0];
        const alertId = latest.data?.face_id || "unknown";

        if (alertId !== lastSeenAlertId) {
          // Push notification
          await Notifications.scheduleNotificationAsync({
            content: {
              title: latest.data?.name ? `New Alert: ${latest.data.name}` : "New Alert",
              body:
                latest.type === "lost"
                  ? `Lost at ${latest.data?.where_lost || "unknown"}`
                  : `Found at ${latest.data?.location_found || "unknown"}`,
              sound: "default",
            },
            trigger: null,
          });

          // Toastify style
          Toast.show({
            type: "info",
            text1: "🚨 New Alert",
            text2: `${latest.data?.name || "Unknown"} — tap to acknowledge`,
            position: "top",
            autoHide: false,
            onPress: async () => {
              await AsyncStorage.setItem("lastSeenAlertId", alertId);
              setLastSeenAlertId(alertId);
              Toast.hide();
            },
          });
        }
      }
    } catch (err) {
      console.error("❌ Alert fetch error:", err.message);
    }
  }, [userId, lastSeenAlertId]);

  useEffect(() => {
    if (userId) fetchAlerts();
  }, [userId]);

  // ----------------------------------
  // 🔹 UI below is 100% unchanged
  // ----------------------------------
  return (
    <LinearGradient colors={["#5D5FEF", "#7879F1"]} className="flex-1">
      {/* Top Animation */}
      <LottieView
        source={require("../../../assets/AIrobotassistant.json")}
        autoPlay
        loop
        style={{ width: 220, height: 220, position: "absolute", top: -10, right: -10 }}
      />

      {/* Content Scroll */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mt-24 px-6">
          <Text className="text-white text-4xl font-extrabold tracking-tight drop-shadow-md">
            Dhruv AI
          </Text>
          <Text className="text-white text-xl font-semibold mt-6 leading-snug opacity-90">
            A Guiding Star{"\n"}
            <Text className="text-white text-xl font-medium opacity-80">
              to Bring the Lost Back Home
            </Text>
          </Text>
        </View>

        {/* White Section */}
        <View className="flex-1 bg-white mt-10 rounded-t-[40px] p-6 shadow-md">

          {/* Quick Actions */}
          <Text className="text-xl font-bold mb-4">Quick Actions</Text>
          <View className="flex-row justify-between">
            <TouchableOpacity className="items-center w-1/3">
              <View className="bg-indigo-100 p-5 rounded-full">
                <MaterialIcons name="person-off" size={30} color="#3F51B5" />
              </View>
              <Text className="text-sm text-center mt-2 font-medium text-gray-700">
                Report Lost
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center w-1/3">
              <View className="bg-green-100 p-5 rounded-full">
                <Entypo name="map" size={28} color="#2E7D32" />
              </View>
              <Text className="text-sm text-center mt-2 font-medium text-gray-700">
                Map
              </Text>
            </TouchableOpacity>
          </View>

          {/* Active Alert */}
          <Text className="text-xl font-bold mt-8 mb-3">Active Alert</Text>
          <TouchableOpacity className="bg-red-500 p-5 rounded-2xl mb-5 shadow-md">
            <View className="flex-row items-center">
              <Ionicons name="alert-circle" size={32} color="white" />
              <View className="ml-3">
                <Text className="text-white font-bold text-lg">Jochi Doe</Text>
                <Text className="text-white text-sm opacity-90">
                  Age 34 • Possible Match Found
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Map Preview */}
          <View className="bg-gray-100 rounded-2xl h-44 overflow-hidden mb-8 shadow-sm">
            <Image
              source={require("../../../assets/map.webp")}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          {/* Features & Services */}
          <Text className="text-xl font-bold mb-4">Features & Services</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity className="w-44 bg-indigo-50 rounded-xl p-5 mr-4 items-center shadow-sm">
              <View className="bg-indigo-200 p-4 rounded-full">
                <Ionicons name="information-circle-sharp" size={28} color="#3F51B5" />
              </View>
              <Text className="mt-3 font-semibold text-center text-indigo-900">Overview</Text>
            </TouchableOpacity>

            <TouchableOpacity className="w-44 bg-pink-50 rounded-xl p-5 mr-4 items-center shadow-sm">
              <View className="bg-pink-200 p-4 rounded-full">
                <MaterialIcons name="psychology" size={28} color="#AD1457" />
              </View>
              <Text className="mt-3 font-semibold text-center text-pink-900">Methodology</Text>
            </TouchableOpacity>

            <TouchableOpacity className="w-44 bg-green-50 rounded-xl p-5 mr-4 items-center shadow-sm">
              <View className="bg-green-200 p-4 rounded-full">
                <FontAwesome5 name="project-diagram" size={24} color="#1B5E20" />
              </View>
              <Text className="mt-3 font-semibold text-center text-green-900">Architecture</Text>
            </TouchableOpacity>

            <TouchableOpacity className="w-44 bg-yellow-50 rounded-xl p-5 mr-4 items-center shadow-sm">
              <View className="bg-yellow-200 p-4 rounded-full">
                <Ionicons name="construct" size={28} color="#F57F17" />
              </View>
              <Text className="mt-3 font-semibold text-center text-yellow-900">Implementation</Text>
            </TouchableOpacity>

            <TouchableOpacity className="w-44 bg-purple-50 rounded-xl p-5 items-center shadow-sm">
              <View className="bg-purple-200 p-4 rounded-full">
                <MaterialIcons name="update" size={28} color="#6A1B9A" />
              </View>
              <Text className="mt-3 font-semibold text-center text-purple-900">Future Work</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Unique Feature */}
          <View className="mt-8 p-5 bg-blue-50 rounded-xl border border-blue-200 shadow-sm">
            <Text className="text-lg font-bold text-blue-700">✨ Unique Feature</Text>
            <Text className="text-sm text-gray-700 mt-2 leading-5">
              "Hope Tracker" – A real-time dashboard that alerts families instantly when a match 
              is detected anywhere in the network, ensuring fast action.
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}