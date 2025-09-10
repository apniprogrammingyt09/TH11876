import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { Text, View } from 'react-native'
import SignOutButton from '../components/SignOutButton'

export default function Home() {
  const { user } = useUser()

  return (
    <View className="flex-1 items-center justify-center p-6 bg-white">
      <SignedIn>
        <Text className="text-xl mb-4">Welcome {user?.emailAddresses[0].emailAddress}</Text>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <Link href="/(auth)/sign-in">
          <Text className="text-blue-500 mb-2">Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text className="text-blue-500">Sign up</Text>
        </Link>
      </SignedOut>
    </View>
  )
}
