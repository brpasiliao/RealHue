import { useAuth } from '@/context/authContext';
import { supabase } from '@/lib/supabase';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';


import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { IconSymbol } from '@/components/ui/icon-symbol.ios';
import { isColorMatch } from '@/utils/color-match';
import { getPalette } from '@/utils/color-palette-picker';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

const { width, height } = Dimensions.get('window');


export default function Analyze() {
  const { uri } = useLocalSearchParams<{ uri: string }>()
  if (!uri) return;

  const { user, session } = useAuth();

  const [colors, setColors] = useState<string[]>([]);
  const [passingColors, setPassingColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const tabBarHeight = useBottomTabBarHeight();

  useEffect(() => {
    const tryGetAverageColor = async () => {
      try {
        const palette = await getPalette(uri, 5);
        setColors(palette);
        setPassingColors(colors.filter(color => isColorMatch(color, '#C1876B')));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    tryGetAverageColor();
  }, [loading])

  async function uploadImage(uri: string, userId: string): Promise<string | null> {
    // const file = new File(uri)
    // const base64 = await file.text() // reads file contents

    const response = await fetch(uri)
    const arrayBuffer = await response.arrayBuffer();

    const filePath = `${userId}/${Date.now()}.jpg`;

    const { data, error } = await supabase.storage
      .from('captures')
      .upload(filePath, arrayBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (error) {
      console.log(error);
      return null;
    }
    return filePath;
  }

  async function postImage(filePath: string, userId: string) {
    const { data: { publicUrl } } = supabase.storage
      .from('captures')
      .getPublicUrl(filePath)
    
    const { error } = await supabase
      .from('captures')
      .insert({
          user_id: userId,
          capture_url: publicUrl,
          palette: 
          {
            colors: colors,
            passoingColors: passingColors,
          }
      });

    if (error) {
      console.log(error);
      return null;
    }
  }

  async function handleSubmit() {
    try {
      const filePath = await uploadImage(uri, user.id);
      if (filePath) await postImage(filePath, user.id);
    } catch (error) {
      console.error('Could not submit capture', error);
    }
  }

  return (
    <ThemedView style={styles.body}>

      <Image
        source={{ uri: uri }}
        style={styles.photoTaken}
      />

      <View style={styles.colorPalette}> 
      {
        loading ?
          (<View style={[styles.paletteItem, { backgroundColor: "#C1876B" }]} />) :
          colors.map((color, index) => (
            <View key={index} style={[styles.paletteItem, { 
              backgroundColor: color,
            }]}>
              {passingColors.includes(color) ?
                <IconSymbol size={30} name="checkmark" color="white"  /> : null}
            </View>
          ))
      } 
      </View>

      <View style={styles.buttons}>
        <Pressable 
          style={styles.button}
          onPress={() => router.push('/camera')}
        >
          <ThemedText type="overline">
            Recapture
          </ThemedText>
        </Pressable>

        {passingColors.length > 0 ?
          <Pressable 
            style={styles.button}
            onPress={handleSubmit}
          > 
            <ThemedText type="overline">Submit</ThemedText>
          </Pressable> :
          <></>
        }
          
      </View>
      
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
  photoTaken: {
    width: width - 20,
    height: width - 20,
    position: 'absolute',
    top: height / 2 - width / 2 + 10,
    left: 10,
  },
  colorPalette: {
    display: 'flex',
    flexDirection: 'row',
    width: width - 20,
    justifyContent: 'center',
    position: 'absolute',
    top: height / 2 - width / 2 -100,
  },
  paletteItem: {
    flex: 1,
    height: 90,
    boxSizing: 'border-box',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    top: height / 2 - width / 2 + 50,
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#ffffff33',
    borderRadius: 8,
  },

});
