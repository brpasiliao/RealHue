import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { Dimensions, Image, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const { width, height } = Dimensions.get('window');


export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [captures, setCaptures] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await getDaySubmission();
    setRefreshing(false);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const getDaySubmission = async () => {
    const { data, error } = await supabase
      .from('captures')
      .select('*')
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString());

    if (data) setCaptures(data);
    else console.log('Captures is null');
    setLoading(false);
  }

  useEffect(() => {
    getDaySubmission();
  }, []);

  return (
    <ThemedView style={styles.body}>
      <ThemedView style={styles.header}>  
        <ThemedText type='title'>{
          today.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}: #C1876B
        </ThemedText>
      </ThemedView>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >  
        <ThemedView style={styles.gallery}>
        {
          loading ?
            (<ThemedText>Loading</ThemedText>) :
            <>
              {captures.map((capture, index) => {
                console.log(capture.capture_url);
                return (
                  <Image
                    key={index}
                    source={{ uri: capture.capture_url }}
                    style={styles.capture}
                  />
              )})}
              <View style={[styles.capture, styles.filler]} />
              <View style={[styles.capture, styles.filler]} />
            </>
        }
        </ThemedView>
      </ScrollView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  body: {
    height: height - 50,
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    height: 100,
    width: '100%',
    backgroundColor: '#C1876B',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'space-between',
    alignSelf: 'center',
    gap: 4.5,
    marginTop: 104,
  },
  capture: {
    width: width * 0.33 - 2,
    height: width * 0.33 - 2,
  },
  filler: {
    height: 0,
  }
});
