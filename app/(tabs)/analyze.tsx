import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { isColorMatch } from '@/utils/color-match';
import { getPalette } from '@/utils/color-palette-picker';

// import ImageColors from 'react-native-image-colors';


export default function Analyze() {

  const { uri } = useLocalSearchParams<{ uri: string }>()
  if (!uri) {
    console.log(uri);
    return;
  };

  const [colors, setColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

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

      <ThemedText>{loading ? "Analyzing..." : ""}</ThemedText>

      <View style={styles.colorPalette}> 
        {
          loading ?
            (<View style={[styles.paletteItem, { backgroundColor: "#C1876B" }]} />) :
            colors.map((color, index) => (
              <View key={index} style={[styles.paletteItem, { 
                backgroundColor: color,
                borderColor: isColorMatch(color, '#C1876B') ? '#fff' : 'transparent',
              }]} />
            ))
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
    width: 300,
    height: 300,
  },
  colorPalette: {
    flexDirection: 'row',
    gap: 10,
  },
  paletteItem: {
    width: 50, 
    height: 50,
    borderWidth: 5,
    // borderColor: '#fff',
    // borderStyle: 'solid',
  }

});
