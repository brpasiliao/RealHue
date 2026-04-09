import { ThemedText } from '@/components/themed-text';
import { useDailyColor } from '@/context/dailyColorContext';
import { supabase } from '@/lib/supabase';
import { BlurView } from 'expo-blur';
import { useEffect, useState } from 'react';
import { Dimensions, Image, Platform, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const width = Platform.OS === 'web' ? Math.min(screenWidth, 430) : screenWidth;
const height = Platform.OS === 'web' ? Math.min(screenHeight, 800) : screenHeight;


export default function HomeScreen() {
  const { theme } = useDailyColor();
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
    <View style={[styles.body, {backgroundColor: theme.main}]}>
      <BlurView
        intensity={40}
        tint={theme.name}
        style={[StyleSheet.absoluteFill, styles.header]}
      >
        <ThemedText type='title'>{
          today.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}: {theme.main}
        </ThemedText>
      </BlurView>
      
      <ScrollView
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={theme.opaque}
            colors={[theme.opaque]}
            progressViewOffset={104}
          />
        }
      >  
        <View style={styles.gallery}>
        {
          loading ?
            (<ThemedText>Loading</ThemedText>) :
            <>
              {captures.map((capture, index) => {
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
        </View>
      </ScrollView>
    </View>
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
    zIndex: 1,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'center',
    gap: 4.5,
    marginTop: 104,
    minHeight: height - 104,
  },
  capture: {
    width: width * 0.33 - 2,
    height: width * 0.33 - 2,
  },
  filler: {
    height: 0,
  }
});
