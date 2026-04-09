import { DailyColorProvider } from '@/context/dailyColorContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { AuthProvider } from '../context/authContext';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <DailyColorProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="camera" options={{ 
            headerShown: false,
            presentation: 'fullScreenModal', 
          }} />
        </Stack>
        <Toast />
        <StatusBar style="auto" />
      </DailyColorProvider>
    </AuthProvider>
  );
}