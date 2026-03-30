import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useRef } from 'react';
import { Button, Dimensions, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');


export default function Camera() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

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
        router.push({
          pathname: '/(tabs)/analyze',
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
    <View style={{ 
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#C1876B',
    }}>
      <View style = {{
        width: '100%',
        height: width,
      }}>
        <CameraView 
          ref={cameraRef} 
          style={{ flex: 1 }} 
          zoom={0.1}
        />
      </View>
      
      <Button title="Take Picture" onPress={takePicture} />
    </View>
  );

}