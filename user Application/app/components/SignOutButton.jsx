import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text } from 'react-native';

export default function SignOutButton() {
  const { isSignedIn, signOut, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/(auth)/welcome');
    }
  }, [isSignedIn, isLoaded]);

  const handleSignOut = async () => {
    if (!isSignedIn) return;

    try {
      setLoading(true);
      await signOut(); // Clears Clerk session
      Alert.alert('Signed Out', 'You have successfully logged out.');
      router.replace('/(auth)/welcome'); // ✅ fixed extra slash
    } catch (err) {
      console.error('Sign out failed:', err);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading until Clerk state is ready
  if (!isLoaded) {
    return <ActivityIndicator color="tomato" size="large" />;
  }

  return (
    <Pressable
      onPress={handleSignOut}
      disabled={loading || !isSignedIn}
      style={{
        width: "90%",
        backgroundColor: loading || !isSignedIn ? '#f08080' : 'tomato',
        paddingVertical: 16,           // bigger button
        borderRadius: 30,              // rounded pill look
        alignItems: 'center',
        shadowColor: '#000',           // add elevation/shadow
        shadowOpacity: 0.25,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 5,
        alignSelf: 'center',
        marginVertical: 12,
      }}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text
          style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: 18,         // larger text
            letterSpacing: 1,     // more spacing, premium feel
          }}
        >
          {isSignedIn ? ` Log Out ${user?.firstName || ''}` : 'Signed Out'}
        </Text>
      )}
    </Pressable>
  );
}