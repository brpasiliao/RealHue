import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/authContext';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');
type Profile = {
  username?: string;
  color?: string;
};

export default function Account() {
  const { user, session } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [captures, setCaptures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session || !user) {
      router.replace('/(tabs)/profile')
    }
  }, [session, user]);

  useEffect(() => {
    if (!user) return;
  
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

    try {
      fetchProfile();
      fetchCaptures();
      setLoading(false);
    } catch (error) {
      console.error('Cannot fetch profile', error);
    }
    
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
    <ThemedView style={styles.body}>
      <ThemedView style={styles.header}>  
        <View style={[styles.profileColor, {backgroundColor: profile.color}]} />
        <View style={styles.profileInfo}>
          <ThemedText type='profile'>
            {profile.username}
          </ThemedText>

          <Pressable 
            style={styles.logOut}
            onPress={handleLogOut}
          >
            <ThemedText type='profile'>Log out</ThemedText>
          </Pressable>
        </View> 
      </ThemedView>
      <ThemedView style={styles.gallery}>
        {
          loading ?
            (<ThemedText>Loading</ThemedText>) :
            captures.map((capture, index) => {
              return (
              <Image
                key={index}
                source={{ uri: capture.capture_url }}
                style={styles.capture}
              />
            )})
        }
      </ThemedView>
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
    height: 150,
    width: '100%',
    backgroundColor: '#C1876B',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: 20,
    flexDirection: 'row',
    gap: 20,
  },
  profileColor: {
    width: 70,
    height: 70,
    borderRadius: 10,
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
    // justifyContent: 'space-between',
    alignSelf: 'center',
    gap: 4.5,
    marginTop: 154,
  },
  capture: {
    width: width * 0.33 - 2,
    height: width * 0.33 - 2,
  }
});
