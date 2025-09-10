
import { useSignIn } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Link, useRouter } from 'expo-router'
import LottieView from 'lottie-react-native'
import { useState } from 'react'
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native'
import ChatbotAnimation from '../../assets/chatbot.json'; // adjust path if needed

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  const onSignInPress = async () => {
    if (!isLoaded) return
    try {
      const result = await signIn.create({ identifier: emailAddress, password })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.replace('/')
      } else {
        Alert.alert('Sign In Failed', 'Please try again.')
      }
    } catch (err) {
      Alert.alert('Error', err.errors?.[0]?.message || 'Invalid credentials')
    }
  }

  return (
    <LinearGradient
      colors={['#9B0E35', '#2E0A46']}
      style={{ flex: 1 }}
    >
      {/* Lottie Animation at top-right */}
      <LottieView
        source={ChatbotAnimation}
        autoPlay
        loop
        style={{
          width: 250,
          height: 250,
          position: 'absolute',
          top: 35,
          right: 10,
        }}
      />

      {/* Header Text */}
      <View style={{ marginTop: 80, paddingHorizontal: 24 }}>
        <Text style={{ color: '#fff', fontSize: 34, fontWeight: 'bold' }}>Hello</Text>
        <Text style={{ color: '#fff', fontSize: 24, marginTop: 4 }}>Sign in!</Text>
      </View>

      {/* White Card Container */}
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          padding: 24,
          marginTop: 40
        }}
      >
        {/* Email */}
        <Text style={{ color: '#9B0E35', fontWeight: '600', marginBottom: 6 }}>Gmail</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 20 }}>
          <TextInput
            value={emailAddress}
            onChangeText={setEmailAddress}
            placeholder="you@example.com"
            placeholderTextColor="#888"
            style={{ flex: 1, fontSize: 16, paddingVertical: 8, color: '#000' }}
          />
          {emailAddress !== '' && (
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          )}
        </View>

        {/* Password */}
        <Text style={{ color: '#9B0E35', fontWeight: '600', marginBottom: 6 }}>Password</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 10 }}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry={!showPass}
            style={{ flex: 1, fontSize: 16, paddingVertical: 8, color: '#000' }}
          />
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <Ionicons name={showPass ? "eye-off" : "eye"} size={20} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Forgot password */}
        <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 30 }}>
          <Text style={{ color: '#777' }}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity onPress={onSignInPress}>
          <LinearGradient
            colors={['#B71C3A', '#320A5B']}
            style={{ paddingVertical: 16, borderRadius: 30, alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>SIGN IN</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Bottom Link */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
          <Text style={{ color: '#555' }}>Don’t have account? </Text>
          <Link href="/sign-up">
            <Text style={{ color: '#9B0E35', fontWeight: 'bold' }}>Sign up</Text>
          </Link>
        </View>
      </View>
    </LinearGradient>
  )
}
