import { IconSymbol } from '@/components/ui/icon-symbol';
import { useDailyColor } from '@/context/dailyColorContext';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useRef } from 'react';
import { Button, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');


export default function Camera() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const { theme } = useDailyColor();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View>
        <Text>We need camera permission</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        router.replace({
          pathname: '/(tabs)/capture/analyze',
          params: { uri: photo.uri },
        });
      } catch (err) {
        console.error('Error taking picture:', err);
      }
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.body}>
      <CameraView 
          ref={cameraRef} 
          style={styles.camera} 
          zoom={0.1}
        />

      <View style={styles.topShadow}/>
      <View style={styles.bottomShadow}/>
      <View style={[styles.border, {borderColor: theme.main}]}/>

      <Pressable 
        style={styles.exitButton}
        onPress={() => router.dismissTo(('/(tabs)/capture'))}
      >
        <IconSymbol size={28} name="xmark" color="white" />
      </Pressable>
      
      <Pressable 
        style={styles.shutterButton}
        onPress={takePicture}
      />
    </View>
  );

}

const styles = StyleSheet.create({
  border: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    // borderColor: '#C1876B',
    borderWidth: 10,
    borderRadius: 35,
  },
  cameraContainer: {
    width: '100%',
    height: '100%',
  },
  camera: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  shutterButton: {
    position: 'absolute',
    bottom: 90,
    left: width /2 - 40,
    width: 80,
    height: 80,
    borderRadius: '100%',
    backgroundColor: '#ffffff',
  },
  exitButton: {
    position: 'absolute',
    bottom: 115,
    left: 40,
  },
  topShadow: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: (height - width) / 2,
    backgroundColor: '#00000088',
  },
  bottomShadow: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: (height - width) / 2,
    backgroundColor: '#00000088',
  },
});



// TODO: PICTURE NOT ALIGNED WITH CAMERA VIEW
