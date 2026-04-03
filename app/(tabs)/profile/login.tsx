import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Keyboard, Pressable, StyleSheet, TextInput, TouchableWithoutFeedback } from 'react-native';

const { width, height } = Dimensions.get('window');


export default function Login() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [logInError, setLogInError] = useState('');

  async function handleLogIn() {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setLogInError(error.message);
      } else {
        router.replace('/(tabs)/profile/account')
      }

    } catch (err) {
      console.error('Error logging in', err);
    }
  }

  async function handleForgotPassword() {
    await supabase.auth.resetPasswordForEmail(email);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.body}>
        <ThemedText type="title">Log In</ThemedText>

        <ThemedView> 
          <ThemedText type="default">Email: </ThemedText>
          <TextInput 
            style={styles.inputField}
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
          <ThemedText type="default">
            {emailError ? emailError : ''}
          </ThemedText>
        </ThemedView>

        <ThemedView> 
          <ThemedText type="default">Password: </ThemedText>
          <TextInput 
            style={styles.inputField}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true} 
            placeholder="••••••••"/>
        </ThemedView>

        <Pressable 
          onPress={handleLogIn}
          style={styles.actionButton}
        >
          <ThemedText type="default">Log in</ThemedText>
        </Pressable>
        <ThemedText type='default'>
          {logInError ? logInError : ''}
        </ThemedText>
        
        <ThemedView style={styles.span}>
          <ThemedText type="default">Don't have an account?</ThemedText>
          <Pressable onPress={() => router.push('./signup')}>
            <ThemedText type="default">Sign Up</ThemedText>
          </Pressable>
        </ThemedView>
        
        <Pressable onPress={handleForgotPassword}>
          <ThemedText>Forgot Password?</ThemedText>
        </Pressable>
      </ThemedView> 
    </TouchableWithoutFeedback>
    
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
