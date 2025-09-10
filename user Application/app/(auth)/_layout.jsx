// import { useAuth } from '@clerk/clerk-expo'
// import { Redirect, Stack } from 'expo-router'

// export default function AuthRoutesLayout() {
//   const { isSignedIn } = useAuth()

//   if (isSignedIn) {
//     return <Redirect href="/" />
//   }

//   return <Stack screenOptions={{ headerShown: false }} />
// }
// app/(auth)/_layout.js
import { useAuth } from '@clerk/clerk-expo'
import { Redirect, Stack } from 'expo-router'
export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth()

  // If user is signed in, redirect to home page
  if (isSignedIn) {
    return <Redirect href="/" />
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  )
}
