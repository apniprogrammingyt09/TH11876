
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SignOutButton from '../components/SignOutButton';

function CustomDrawerContent() {
  const { user } = useUser();
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      {/* 🔹 Profile Header */}
      <View className="bg-indigo-500 items-center py-8 px-5 rounded-b-[40px]">
        <View className="w-[90px] h-[90px] rounded-full bg-white items-center justify-center shadow-md">
          <Ionicons name="person-circle-outline" size={80} color="#5D5FEF" />
        </View>
        <Text className="text-white text-lg font-bold mt-3">
          {user?.firstName || 'John'} {user?.lastName || 'Doe'}
        </Text>
        <Text className="text-gray-200 text-sm">
          {user?.primaryEmailAddress?.emailAddress || 'you@example.com'}
        </Text>
      </View>

      {/* 🔹 Quick Actions */}
      <View className="flex-row justify-around py-4 bg-white border-b border-gray-200">
        <TouchableOpacity
          className="items-center justify-center bg-indigo-400 p-3 rounded-2xl w-[90px]"
          onPress={() => router.push('/(drawer)/ReportLost')}
        >
          <Ionicons name="person-remove-outline" size={26} color="#fff" />
          <Text className="text-white text-xs font-semibold mt-1 text-center">
            Report Lost
          </Text>
        </TouchableOpacity>

      

      
      </View>

      {/* 🔹 Drawer Items */}
      <View className="flex-1 mt-2 px-2">
        {/* ✅ Fixed Home Navigation */}
        <TouchableOpacity
          className="flex-row items-center p-3 border-b border-gray-200"
          onPress={() => router.push('/(drawer)/(tabs)/')}
        >
          <Ionicons name="home-outline" size={22} color="#5D5FEF" />
          <Text className="ml-3 text-base font-semibold text-gray-800">
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center p-3 border-b border-gray-200"
          onPress={() => router.push('/(drawer)/(tabs)/Alert')}
        >
          <Ionicons name="alert-circle-outline" size={22} color="#EF5DA8" />
          <Text className="ml-3 text-base font-semibold text-gray-800">
            Active Alerts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center p-3 border-b border-gray-200"
          onPress={() => router.push('/(drawer)/Map')}
        >
          <Ionicons name="map-outline" size={22} color="#5D5FEF" />
          <Text className="ml-3 text-base font-semibold text-gray-800">
            Interactive Map
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center p-3 border-b border-gray-200"
          onPress={() => router.push('/(drawer)/reports')}
        >
          <Ionicons name="document-text-outline" size={22} color="#A5A6F6" />
          <Text className="ml-3 text-base font-semibold text-gray-800">
            My Reports
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center p-3 border-b border-gray-200"
          onPress={() => router.push('/(drawer)/(tabs)/Alert')}
        >
          <Ionicons name="notifications-outline" size={22} color="#F178B6" />
          <Text className="ml-3 text-base font-semibold text-gray-800">
            Notifications
          </Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 Footer */}
      <View className="p-5 border-t border-gray-200">
        <TouchableOpacity
          className="flex-row items-center bg-indigo-400 p-3 rounded-xl mb-3"
          onPress={() => router.push('/(drawer)/Profile')}
        >
          <Ionicons name="person-outline" size={20} color="#fff" />
          <Text className="ml-2 text-white font-semibold">Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center bg-indigo-400 p-3 rounded-xl mb-3"
          onPress={() => router.push('/(drawer)/Setting')}
        >
          <Ionicons name="settings-outline" size={20} color="#fff" />
          <Text className="ml-2 text-white font-semibold">Settings</Text>
        </TouchableOpacity>

        <SignOutButton />
        <Text className="mt-3 text-xs text-gray-500 self-center">
          App Version 1.4.1
        </Text>
      </View>
    </View>
  );
}

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
        {/* Main App Screens */}
        <Drawer.Screen name="(tabs)" options={{ title: 'Dhruv AI' }} />
        <Drawer.Screen name="Profile" options={{ title: 'Profile' }} />
        <Drawer.Screen name="settings" options={{ title: 'Settings' }} />

        {/* New Routes */}
        <Drawer.Screen name="reportLost" options={{ title: 'Report Lost' }} />
        <Drawer.Screen name="reportFound" options={{ title: 'Report Found' }} />
        <Drawer.Screen name="camera" options={{ title: 'Camera' }} />
        <Drawer.Screen name="alerts" options={{ title: 'Active Alerts' }} />
        <Drawer.Screen name="map" options={{ title: 'Interactive Map' }} />
        <Drawer.Screen name="reports" options={{ title: 'My Reports' }} />
        <Drawer.Screen
          name="notifications"
          options={{ title: 'Notifications' }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}