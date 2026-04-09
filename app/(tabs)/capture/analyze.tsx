import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/context/authContext';
import { useDailyColor } from '@/context/dailyColorContext';
import { useCheckSubmit } from '@/hooks/use-check-submit';
import { useSubmitCapture } from '@/hooks/use-submit-capture';
import { isColorMatch } from '@/utils/color-match';
import { getPalette } from '@/utils/color-palette-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, Platform, Pressable, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const width = Platform.OS === 'web' ? Math.min(screenWidth, 430) : screenWidth;
const height = Platform.OS === 'web' ? Math.min(screenHeight, 800) : screenHeight;


export default function Analyze() {
  const { uri } = useLocalSearchParams<{ uri: string }>()
  useEffect(() => {
    if (!uri) {
      console.log('Error getting image uri');
      router.replace('./prompt')
    }
  }, [uri]);

  const [colors, setColors] = useState<string[]>([]);
  const [passingColors, setPassingColors] = useState<string[]>([]);
  const [loadingAnalysis, setLoadingAnalysis] = useState(true);
  const { user, session } = useAuth();
  const { theme } = useDailyColor();
  const { submitCapture, submitted } = useSubmitCapture(user?.id, uri, colors, passingColors);
  const { submission, loading } = useCheckSubmit(); 

  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return;
    }

    if (!session || !user) {
      router.dismissTo('/(tabs)/capture/prompt')
    }
  }, [session, user]);

  useEffect(() => {
    if (loading) return;

    if (submission) {
      setColors(submission.colors);
      setPassingColors(submission.passingColors);
      setLoadingAnalysis(false);
      return;
    }

    const tryGetPalette = async () => {
      try {
        const palette = await getPalette(uri, 5);
        setColors(palette);
        setPassingColors(palette.filter(color => isColorMatch(color, theme.main)));
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingAnalysis(false);
      }
    }
    tryGetPalette();
  }, [uri, loading]);

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
    <View style={[styles.body, {backgroundColor: theme.main}]}>

      <Image
        source={{ uri: uri }}
        style={styles.photoTaken}
      />

      <View style={styles.colorPalette}> 
      {
        loadingAnalysis ?
          (<View style={[styles.paletteItem, { backgroundColor: theme.main }]} />) :
          colors.map((color, index) => (
            <View key={index} style={[styles.paletteItem, { 
              backgroundColor: color,
            }]}>
              {passingColors.includes(color) ?
                <IconSymbol size={30} name="checkmark" color={theme.neutral}  /> : null}
            </View>
          ))
      } 
      </View>

      <View style={styles.infoContainer}>
        { 
        submitted || submission ? (
          <ThemedText type='default' style={styles.submittedMessage}>Submitted capture for today!</ThemedText>
        ) : (
          <View style={styles.buttons}>
            <Pressable 
              style={[styles.button, {backgroundColor: theme.leastOpaque}]}
              onPress={() => router.push('/camera')}
            >
              <ThemedText type="overline">
                Recapture
              </ThemedText>
            </Pressable>

            {passingColors.length > 0 ?
              <Pressable 
                style={[styles.button, {backgroundColor: theme.leastOpaque}]}
                onPress={handleSubmit}
              > 
                <ThemedText type="overline">Submit</ThemedText>
              </Pressable> :
              <></>
            }
              
          </View>
        )
      }
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
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
    left: 10,
  },
  paletteItem: {
    flex: 1,
    height: 90,
    boxSizing: 'border-box',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    position: 'absolute',
    top: height / 2 + width / 2 + 10,
    left: 10,
    width: width - 20,
    // backgroundColor: 'white',
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  submittedMessage: {
    textAlign: 'center',
    paddingVertical: 10,
  }

});
