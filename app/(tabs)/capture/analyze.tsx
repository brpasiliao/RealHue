import { useAuth } from '@/context/authContext';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';


import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { IconSymbol } from '@/components/ui/icon-symbol.ios';
import { useSubmitCapture } from '@/hooks/use-submit-capture';
import { isColorMatch } from '@/utils/color-match';
import { getPalette } from '@/utils/color-palette-picker';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');


export default function Analyze() {
  const { uri } = useLocalSearchParams<{ uri: string }>()
  useEffect(() => {
    if (!uri) {
      console.log('Error getting image uri');
      router.replace('./prompt')
    }
  }, [uri]);

  const { user, session } = useAuth();
  // useEffect(() => {
  //   if (!session || !user) {
  //     router.replace('./prompt')
  //   }
  // }, [session, user]);

  const [colors, setColors] = useState<string[]>([]);
  const [passingColors, setPassingColors] = useState<string[]>([]);
  const [loadingAnalysis, setLoadingAnalysis] = useState(true);
  const { submitCapture, submitted } = useSubmitCapture(user?.id, uri, colors, passingColors);

  useEffect(() => {
    const tryGetAverageColor = async () => {
      try {
        const palette = await getPalette(uri, 5);
        setColors(palette);
        setPassingColors(colors.filter(color => isColorMatch(color, '#C1876B')));
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAnalysis(false);
      }
    }
    tryGetAverageColor();
  }, [loadingAnalysis])

  async function handleSubmit() {
    if (!session || !user) {
      Toast.show({
        type: 'error',
        text1: 'Log in to submit your capture',
      });

    } else {
      submitCapture();
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
        loadingAnalysis ?
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

      { 
        submitted ? (
          <ThemedText type='default' style={styles.submittedMessage}>Submitted capture for today!</ThemedText>
        ) : (
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
        )
      }
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
  submittedMessage: {
    top: height / 2 - width / 2 + 50,
  }

});
