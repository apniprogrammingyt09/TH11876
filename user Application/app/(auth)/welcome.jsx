import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import LottieView from "lottie-react-native";
import { Linking, Pressable, Text, TouchableOpacity, View } from "react-native";
import RobotAnimation from "../../assets/Robot Futuristic Ai animated.json"; // ensure correct path

export default function WelcomeScreen() {
  // 🔹 Open external links
  const openLink = (url) => Linking.openURL(url);

  return (
    <LinearGradient
      colors={["#9B0E35", "#2E0A46"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1 justify-center items-center px-6"
    >
      {/* 🔹 Logo / Lottie Animation */}
      <LottieView
        source={RobotAnimation}
        autoPlay
        loop
        style={{
          width: 250,
          height: 250,
          marginBottom: 10,
        }}
      />

      {/* 🔹 App Name */}
      <Text className="text-3xl font-extrabold text-white tracking-wide mb-2">
        Dhruv AI
      </Text>

      {/* 🔹 Welcome Text (closer to Dhruv AI) */}
      <Text className="text-xl font-semibold text-white mb-8">
        Welcome Back
      </Text>

      {/* 🔹 SIGN IN Button (outlined pill) */}
      <TouchableOpacity className="w-4/5 mb-4">
        <View className="border-2 border-white rounded-full py-3 bg-white/10">
          <Link href="/(auth)/sign-in" asChild>
            <Text className="text-white text-center text-lg font-semibold">
              SIGN IN
            </Text>
          </Link>
        </View>
      </TouchableOpacity>

      {/* 🔹 SIGN UP Button (solid pill, same as SIGN IN rounded style) */}
      <TouchableOpacity className="w-4/5 rounded-full">
        <LinearGradient
          colors={["#ffffff", "#e5e5e5"]}
          className="rounded-full py-3 "

        >
          <Link href="/(auth)/sign-up" asChild>
            <Text className="text-center text-lg font-semibold  text-[#9B0E35]">
              SIGN UP
            </Text>
          </Link>
        </LinearGradient>
      </TouchableOpacity>

      {/* 🔹 Footer Social (give more gap from buttons) */}
      <View className="items-center mt-14">
        <Text className="text-white mb-4 tracking-wide uppercase text-sm">
          Login with Social Media
        </Text>

        {/* Social Icons */}
        <View className="flex-row space-x-10  gap-6 ">
          <Pressable onPress={() => openLink("https://linkedin.com")}>
            <FontAwesome name="linkedin-square" size={38} color="white" />
          </Pressable>

          <Pressable onPress={() => openLink("https://facebook.com")}>
            <FontAwesome name="facebook-square" size={38} color="white" />
          </Pressable>

          <Pressable onPress={() => openLink("https://instagram.com")}>
            <FontAwesome name="instagram" size={38} color="white" />
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}