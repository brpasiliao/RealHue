import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/context/authContext';
import { supabase } from '@/lib/supabase';
import { getThemeFromColor } from '@/utils/color-helper';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const width = Platform.OS === 'web' ? Math.min(screenWidth, 430) : screenWidth;
const height = Platform.OS === 'web' ? Math.min(screenHeight, 800) : screenHeight;

type Profile = {
  username: string;
  color: string;
};


export default function Account() {
  const { user, session } = useAuth();
  const [profile, setProfile] = useState<Profile>({username: '', color:''});
  const [captures, setCaptures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const profileTheme = getThemeFromColor(profile?.color);

  useEffect(() => {
    if (!session || !user) {
      router.replace('/(tabs)/profile')
    }
  }, [session, user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getUserCaptures();
    setRefreshing(false);
  }

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) {
      console.log(error);
    } else {
      setProfile(data);
    }
  };

  const fetchCaptures = async () => {
    const { data, error } = await supabase
      .from('captures')
      .select('*')
      .eq('user_id', user.id);
    if (error) {
      console.log(error);
    } else {
      setCaptures(data);
    }
  }

  const getUserCaptures = async () => {
    try {
      await fetchProfile();
      await fetchCaptures();
      setLoading(false);
    } catch (error) {
      console.error('Cannot fetch profile', error);
    }
  }
  
  useEffect(() => {
    if (user) getUserCaptures();
  }, [user]);
  

  async function handleLogOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.log(error);
    else {
      router.replace('/(tabs)/profile')
    }
  }

  if (!profile) {
    return (
      <View style={styles.body}>
        <ThemedText>No profile</ThemedText>
        <Pressable 
        style={styles.logOut}
        onPress={handleLogOut}
      >
        <ThemedText type='default'>Log out</ThemedText>
      </Pressable>
      </View>
    );
  }

    
  return (
    <View style={[styles.body, {backgroundColor: profileTheme.main}]}>
      <BlurView
        intensity={40}
        tint="light"
        style={[StyleSheet.absoluteFill, styles.header]}
      >
        <View style={[styles.profileIconContainer, {borderColor: profileTheme.neutral}]}>
          <IconSymbol size={50} name="face.smiling" color={profileTheme.neutral} />
        </View>
        <View style={styles.profileInfo}>
          <ThemedText type='profile'>
            {profile.username}
          </ThemedText>

          <Pressable 
            style={styles.logOut}
            onPress={handleLogOut}
          >
            <ThemedText type='link'>Log out</ThemedText>
          </Pressable>
        </View> 
      </BlurView>
      
      <ScrollView
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={profileTheme.neutral}
            colors={[profileTheme.neutral]}
            progressViewOffset={150}
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
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    height: 150,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: 20,
    flexDirection: 'row',
    gap: 20,
    zIndex: 1,
  },
  profileIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 10,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: 70,
    gap: 5,
  },
  logOut: {
    // padding: 10,
    // backgroundColor: '#ffffff33',
    // justifyContent: 'center',
    // borderColor: 'white',
    // borderWidth: 2,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'center',
    gap: 4.5,
    marginTop: 154,
    minHeight: height - 154,
  },
  capture: {
    width: width * 0.33 - 2,
    height: width * 0.33 - 2,
  },
  filler: {
    height: 0,
  }
});
