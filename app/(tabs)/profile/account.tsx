import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/authContext';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');
type Profile = {
  username?: string;
  color?: string;
};

export default function Account() {
  const { user, session } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

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

    fetchProfile();
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
        style={styles.actionButton}
        onPress={handleLogOut}
      >
        <ThemedText type='default'>Log out</ThemedText>
      </Pressable>
      </View>
    );
  }
    

  return (
    <View style={styles.body}>
      <ThemedText type='default'>
        Hello {profile.username}
      </ThemedText>

      <Pressable 
        style={styles.actionButton}
        onPress={handleLogOut}
      >
        <ThemedText type='default'>Log out</ThemedText>
      </Pressable>
    </View> 
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    width: width - 60,
    margin: 'auto',
    gap: 10,
  },
  inputField: {
    padding: 10,
    color: 'white',
    backgroundColor: '#ffffff33',
  },
  span: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 10,
    backgroundColor: '#ffffff33',
    justifyContent: 'center',
    borderColor: 'white',
    borderWidth: 2,
  }
});
