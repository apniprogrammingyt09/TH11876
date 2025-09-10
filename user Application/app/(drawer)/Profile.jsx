import { useUser } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import SignOutButton from '../components/SignOutButton'

export default function ProfileScreen() {
  const { user } = useUser()

  return (
    <ScrollView style={styles.container}>
      {/* 🔹 Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person-circle-outline" size={100} color="#5D5FEF" />
        </View>
        <Text style={styles.name}>
          {user?.firstName || 'John'} {user?.lastName || 'Doe'}
        </Text>
        <Text style={styles.email}>
          {user?.primaryEmailAddress?.emailAddress || 'you@example.com'}
        </Text>
      </View>

      {/* 🔹 Quick Info Section */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={20} color="#7879F1" />
          <Text style={styles.infoText}>{user?.primaryEmailAddress?.emailAddress}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="id-card-outline" size={20} color="#7879F1" />
          <Text style={styles.infoText}>{user?.id || 'User ID'}</Text>
        </View>
      </View>

      {/* 🔹 Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="settings-outline" size={20} color="#fff" />
          <Text style={styles.actionText}>Edit Profile</Text>
        </TouchableOpacity>

        <SignOutButton />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9'
  },

  // 🔹 Header with Avatar + Basic Info
  header: {
    alignItems: 'center',
    backgroundColor: '#5D5FEF',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  email: {
    fontSize: 14,
    color: '#FCDDEC', // matches your palette pinkish tint
  },

  // 🔹 Info Section
  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#202020',
  },

  // 🔹 Buttons
  actions: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7879F1', // soft purple from palette
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  actionText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
})