import { ThemedText } from '@/components/themed-text';
import { useDailyColor } from '@/context/dailyColorContext';
import { useCheckSubmit } from '@/hooks/use-check-submit';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

export default function Prompt() {
  const { theme } = useDailyColor();
  const { submission, loading } = useCheckSubmit();

  useEffect(() => {
    if (submission) {
      router.replace({
        pathname: '/(tabs)/capture/analyze',
        params: { uri: submission.capture_url },
      });
    }
  }, [loading]);
  

  return (
    <View style={[styles.body, {backgroundColor: theme.main}]}>
      <ThemedText type="overline">Today's color is</ThemedText>
      <ThemedText type="headline">{theme.main}</ThemedText>
      <Pressable 
        style={styles.captureButton} 
        onPress={() => {
          router.push('/camera');
        }}
      >
        <ThemedText type="overline">Capture</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#C1876B',
    gap: 50,
  },
  captureButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#ffffff33',
    borderRadius: 8,
  },
});
