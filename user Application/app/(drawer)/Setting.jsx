import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const { user } = useUser();
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* 🔹 Header/Profile Card */}
      <View className="bg-indigo-500 py-8 px-6 rounded-b-[40px] items-center shadow-md">
        <Ionicons name="person-circle-outline" size={90} color="#fff" />
        <Text className="text-white text-lg font-bold mt-2">
          {user?.firstName || 'John'} {user?.lastName || 'Doe'}
        </Text>
        <Text className="text-gray-200 text-sm">
          {user?.primaryEmailAddress?.emailAddress || 'you@example.com'}
        </Text>
      </View>

      {/* 🔹 Settings Options */}
      <View className="mt-6 mx-4 bg-white rounded-2xl shadow-md">
        {/* Account */}
        <TouchableOpacity
          className="flex-row items-center p-4 border-b border-gray-200"
          onPress={() => router.push('/(drawer)/Profile')}
        >
          <Ionicons name="person-outline" size={22} color="#5D5FEF" />
          <Text className="ml-3 text-base font-semibold text-gray-800 flex-1">
            Account
          </Text>
          <Ionicons name="chevron-forward-outline" size={18} color="#888" />
        </TouchableOpacity>

        {/* Privacy */}
        <TouchableOpacity
          className="flex-row items-center p-4 border-b border-gray-200"
          onPress={() => alert('Navigate to Privacy Settings')}
        >
          <Ionicons name="lock-closed-outline" size={22} color="#EF5DA8" />
          <Text className="ml-3 text-base font-semibold text-gray-800 flex-1">
            Privacy
          </Text>
          <Ionicons name="chevron-forward-outline" size={18} color="#888" />
        </TouchableOpacity>

        {/* Notifications */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <View className="flex-row items-center">
            <Ionicons name="notifications-outline" size={22} color="#F178B6" />
            <Text className="ml-3 text-base font-semibold text-gray-800">
              Push Notifications
            </Text>
          </View>
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
            thumbColor={pushNotifications ? '#5D5FEF' : '#ccc'}
          />
        </View>

        {/* Dark Mode */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <View className="flex-row items-center">
            <Ionicons name="moon-outline" size={22} color="#5D5FEF" />
            <Text className="ml-3 text-base font-semibold text-gray-800">
              Dark Mode
            </Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            thumbColor={darkMode ? '#5D5FEF' : '#ccc'}
          />
        </View>

        {/* About App */}
        <TouchableOpacity
          className="flex-row items-center p-4"
          onPress={() => alert('Dhruv AI v1.4.1\nFace Recognition Lost & Found App')}
        >
          <Ionicons name="information-circle-outline" size={22} color="#5D5FEF" />
          <Text className="ml-3 text-base font-semibold text-gray-800 flex-1">
            About
          </Text>
          <Ionicons name="chevron-forward-outline" size={18} color="#888" />
        </TouchableOpacity>
      </View>

      {/* 🔹 Footer */}
      <Text className="mt-6 mb-4 text-xs text-gray-500 text-center">
        Dhruv AI App • Version 1.4.1
      </Text>
    </ScrollView>
  );
}