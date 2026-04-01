import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { isColorMatch } from '@/utils/color-match';
import { getPalette } from '@/utils/color-palette-picker';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';


const { width, height } = Dimensions.get('window');

// import ImageColors from 'react-native-image-colors';


export default function Analyze() {

  const { uri } = useLocalSearchParams<{ uri: string }>()
  if (!uri) return;

  const [colors, setColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const tabBarHeight = useBottomTabBarHeight();

  useEffect(() => {
    const tryGetAverageColor = async () => {
      try {

        const palette = await getPalette(uri, 5);
        setColors(palette);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    tryGetAverageColor();
  }, [])

  // useEffect(() => {
  //   const getPalette = async (uri: string) => {
  //     try {
  //       const colorInfo = await ImageColors.getColors(uri, {
  //         fallback: '#000000',
  //         cache: true,
  //         key: uri,
  //       });
  //       const colors = Object.values(colorInfo).filter(value => value.startsWith('#'));
  //       setPalette(colors);

  //     } catch (err) {
  //       console.error(err);

  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   getPalette(uri);
  // }, [uri]);

  return (
    <ThemedView style={styles.body}>

      <Image
        source={{ uri: uri }}
        style={styles.photoTaken}
      />

      <View style={[styles.colorPalette, { top: height / 2 - width / 2 - tabBarHeight / 2 -80,
 }]}> 
      {
        loading ?
          (<View style={[styles.paletteItem, { backgroundColor: "#C1876B" }]} />) :
          colors.map((color, index) => (
            <View key={index} style={[styles.paletteItem, { 
              backgroundColor: color,
              borderColor: isColorMatch(color, '#C1876B') ? '#ffffff' : 'transparent',
              // height: isColorMatch(color, '#C1876B') ? 80 : 70,
            }]} />
          ))
      } 
      </View>

      <Pressable 
        style={[styles.actionButton, { top: height / 2 - width / 2 - tabBarHeight / 2 + 50, }]}
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
  photoTaken: {
    width: width - 20,
    height: width - 20,
    position: 'absolute',
    left: 10,
  },
  colorPalette: {
    display: 'flex',
    flexDirection: 'row',
    width: width - 20,
    justifyContent: 'center',
    position: 'absolute',
  },
  paletteItem: {
    flex: 1,
    height: 70,
    borderWidth: 5,
    boxSizing: 'border-box',
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#ffffff33',
    borderRadius: 8,
  },

});
