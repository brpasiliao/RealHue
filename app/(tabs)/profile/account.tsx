import { ThemedText } from '@/components/themed-text';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');


export default function Account() {
  async function handleLogOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.log(error);
    else {
      router.dismissTo('./login')
    }
  }

  return (
    <View style={styles.body}>
      <ThemedText type='default'>
        logged in!
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
