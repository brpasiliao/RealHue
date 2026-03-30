import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';

export default function Capture() {
  return (
    <ThemedView style={styles.body}>
      <ThemedText type="overline">Today's color is</ThemedText>
      <ThemedText type="headline">#C1876B</ThemedText>
      <Pressable 
        style={styles.captureButton} 
        onPress={() => router.push('/camera')}
      >
        <ThemedText type="overline">Capture</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C1876B',
    gap: 50,
  },
  captureButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#ffffff33',
    borderRadius: 8,
  },
});
