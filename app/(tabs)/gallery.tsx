import { useEffect } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const date = new Date();

  useEffect(() => {
    const getDaySubmission = async () => {
      // const { data, error } = await supabase
      // .from('profiles')
      // .select('*')
      // .eq('created_at', user.id)
      // .single();
    }
    
  })

  return (
    <ThemedView>
      <ThemedText>{date.toDateString()}</ThemedText>
      <ThemedView style={styles.gallery}>

      </ThemedView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  gallery: {
    
  }
});
