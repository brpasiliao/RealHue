import { Stack } from 'expo-router'

export default function CaptureLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="account" />
    </Stack>
  )
  
}