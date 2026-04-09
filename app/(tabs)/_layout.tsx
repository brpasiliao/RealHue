import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useDailyColor } from '@/context/dailyColorContext';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
  const { theme, loading } = useDailyColor();

  if (loading || !theme) return null;

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: theme?.neutral,
      tabBarInactiveTintColor: theme?.neutral,
      tabBarActiveBackgroundColor: theme?.active,
      headerShown: false,
      tabBarButton: HapticTab,
      tabBarStyle: {
        position: 'absolute',
        borderTopWidth: 0,
        elevation: 0,
        // backgroundColor: theme?.background,
      },
      tabBarBackground: () => (
        <BlurView
          intensity={40}
          tint="light"
          style={StyleSheet.absoluteFill}
        />
      ),
    }}>
      <Tabs.Screen
        name="gallery"
        options={{
          title: 'Gallery',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="square.grid.2x2" color={color} />,
        }}
      />
      <Tabs.Screen
        name="capture"
        options={{
          title: 'Capture',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="camera.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person" color={color} />,
        }}
      />
      <Tabs.Screen name="index" options={{ href: null }} />
      
    </Tabs>
  );
}
