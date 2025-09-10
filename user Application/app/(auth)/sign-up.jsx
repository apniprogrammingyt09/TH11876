
import { useSignUp } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Link, useRouter } from 'expo-router'
import LottieView from 'lottie-react-native'
import { useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import RobotBrainAnimation from '../../assets/Technology isometric ai robot brain.json'

export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp()
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [otp, setOtp] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [loading, setLoading] = useState(false)

  // Step 1: Sign Up (no min length / breach checks)
  const onSignUpPress = async () => {
    if (!isLoaded) return

    const trimmedUsername = username.trim()
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()
    const trimmedConfirm = confirmPassword.trim()

    if (!trimmedUsername || !trimmedEmail || !trimmedPassword || !trimmedConfirm) {
      Alert.alert('Error', 'All fields are required')
      return
    }
    if (trimmedPassword !== trimmedConfirm) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await signUp.create({
        username: trimmedUsername,
        emailAddress: trimmedEmail,
        password: trimmedPassword,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)
    } catch (err) {
      Alert.alert(
        'Sign Up Failed',
        err.errors?.map(e => e.message).join('\n') || 'Something went wrong.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify Email OTP
  const onVerifyPress = async () => {
    if (!isLoaded) return
    setLoading(true)
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code: otp })
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        Alert.alert('Verification Failed', 'Please try again.')
      }
    } catch {
      Alert.alert('Invalid Code', 'The verification code is incorrect or expired.')
    } finally {
      setLoading(false)
    }
  }

  // OTP Verification UI
  if (pendingVerification) {
    return (
      <LinearGradient colors={['#9B0E35', '#2E0A46']} style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 40, padding: 24 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#9B0E35' }}>
            Verify Your Email
          </Text>
          <TextInput
            value={otp}
            onChangeText={setOtp}
            placeholder="Enter Verification Code"
            placeholderTextColor="#888"
            style={{ borderBottomWidth: 1, borderColor: '#aaa', fontSize: 16, paddingVertical: 8, marginBottom: 24 }}
          />
          <TouchableOpacity onPress={onVerifyPress} disabled={loading}>
            <LinearGradient colors={['#B71C3A', '#320A5B']} style={{ padding: 14, borderRadius: 30 }}>
              <Text style={{ color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>
                {loading ? 'Verifying...' : 'VERIFY EMAIL'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    )
  }

  // Sign Up Form UI
  return (
    <LinearGradient colors={['#9B0E35', '#2E0A46']} style={{ flex: 1 }}>
      {/* Top Animation */}
      <LottieView
        source={RobotBrainAnimation}
        autoPlay
        loop
        style={{
          width: 180,
          height: 180,
          position: 'absolute',
          top: 40,
          right: 0,
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>
          {/* Header */}
          <View style={{ marginTop: 80, paddingHorizontal: 24 }}>
            <Text style={{ color: '#fff', fontSize: 32, fontWeight: 'bold' }}>Create Your</Text>
            <Text style={{ color: '#fff', fontSize: 32, fontWeight: 'bold' }}>Account</Text>
          </View>

          {/* Form Card */}
          <View
            style={{
              flex: 1,
              backgroundColor: '#fff',
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              padding: 24,
              marginTop: 30,
            }}
          >
            {/* Username */}
            <Text style={{ color: '#9B0E35', fontWeight: '600', marginBottom: 6 }}>Full Name</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 20 }}>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="John Smith"
                placeholderTextColor="#888"
                style={{ flex: 1, fontSize: 16, paddingVertical: 8, color: '#000' }}
              />
              {username.trim() !== '' && <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />}
            </View>

            {/* Email */}
            <Text style={{ color: '#9B0E35', fontWeight: '600', marginBottom: 6 }}>Phone or Gmail</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 20 }}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#888"
                style={{ flex: 1, fontSize: 16, paddingVertical: 8, color: '#000' }}
              />
              {email.trim() !== '' && <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />}
            </View>

            {/* Password */}
            <Text style={{ color: '#9B0E35', fontWeight: '600', marginBottom: 6 }}>Password</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 20 }}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry={!showPass}
                style={{ flex: 1, fontSize: 16, paddingVertical: 8, color: '#000' }}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Ionicons name={showPass ? 'eye-off' : 'eye'} size={20} color="#888" />
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <Text style={{ color: '#9B0E35', fontWeight: '600', marginBottom: 6 }}>Confirm Password</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 30 }}>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm Password"
                placeholderTextColor="#888"
                secureTextEntry={!showConfirm}
                style={{ flex: 1, fontSize: 16, paddingVertical: 8, color: '#000' }}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={20} color="#888" />
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity onPress={onSignUpPress} disabled={loading}>
              <LinearGradient colors={['#B71C3A', '#320A5B']} style={{ padding: 16, borderRadius: 30, alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                  {loading ? 'SIGNING UP...' : 'SIGN UP'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Bottom Link */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
              <Text style={{ color: '#555' }}>Already have an account? </Text>
              <Link href="/sign-in">
                <Text style={{ color: '#9B0E35', fontWeight: 'bold' }}>Sign In</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}