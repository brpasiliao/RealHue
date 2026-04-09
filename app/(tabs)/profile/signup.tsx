import { ThemedText } from '@/components/themed-text';
import { useDailyColor } from '@/context/dailyColorContext';
import { supabase } from '@/lib/supabase';
import { getRandomColor } from '@/utils/color-helper';
import { router } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Keyboard, Pressable, StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';

const { width, height } = Dimensions.get('window');


export default function Signup() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [username, setUsername] = useState('');
  const [signUpError, setSignUpError] = useState('');
  const { theme } = useDailyColor();

  async function handleSignUp() {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: 
        { data: {
            username,
            color: getRandomColor(),
          }
        }
      });

      if (error) {
        setSignUpError(error.message);
        console.log(error);
      } else if (password !== rePassword) {
        setSignUpError('Passwords must match');
      } else if (data.user) {
        router.replace('/(tabs)/profile')
      } else {
        setSignUpError('User is null');
      }

    } catch (error) {
      console.error('Error signing up', error);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.body, {backgroundColor: theme.main}]}>

        <ThemedText type='title'>Sign Up</ThemedText>

        <View> 
          <ThemedText type='default'>Email: </ThemedText>
          <TextInput 
            style={[styles.inputField, {backgroundColor: theme.active}]}
            value={email}
            onChangeText={setEmail}
            onBlur={() => {
              if (/\S+@\S+\.\S+/.test(email)) {
                setEmailError('');
              } else {
                setEmailError('Invalid email');
              }
            }}
            placeholder="example@email.com"
          />
          <ThemedText type='default'>
            {emailError ? emailError : ''}
          </ThemedText>
        </View>

        <View> 
          <ThemedText type='default'>Username: </ThemedText>
          <TextInput 
            style={[styles.inputField, {backgroundColor: theme.active}]}
            value={username}
            onChangeText={setUsername}
            placeholder="user_name"
          />
        </View>

        <View> 
          <ThemedText type='default'>Password: </ThemedText>
          <TextInput 
            style={[styles.inputField, {backgroundColor: theme.active}]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true} 
            placeholder="••••••••"/>
        </View>

        <View> 
          <ThemedText type='default'>Repeat password: </ThemedText>
          <TextInput 
            style={[styles.inputField, {backgroundColor: theme.active}]}
            value={rePassword}
            onChangeText={setRePassword}
            secureTextEntry={true} 
            placeholder="••••••••"
          />
          <ThemedText type='default'>
            {password !== rePassword ? 'Passwords must match' : ''}
          </ThemedText>
        </View>

        <Pressable 
          style={[styles.actionButton, {backgroundColor: theme.active, borderColor: theme.neutral}]}
          onPress={handleSignUp}
        >
          <ThemedText type='default'>Sign Up</ThemedText>
        </Pressable>
        <ThemedText type='default'>
          {signUpError}
        </ThemedText>
        
        <View style={styles.span}>
          <ThemedText type='default'>Already have an account?</ThemedText>
          <Pressable onPress={() => router.dismissTo('./login')}>
            <ThemedText type='default'> Log in</ThemedText>
          </Pressable>
        </View>
        
      </View> 
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    gap: 10,
  },
  inputField: {
    padding: 10,
    color: 'white',
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
