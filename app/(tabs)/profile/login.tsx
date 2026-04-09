import { ThemedText } from '@/components/themed-text';
import { useDailyColor } from '@/context/dailyColorContext';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useState } from 'react';
import { Keyboard, Pressable, StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';


export default function Login() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [logInError, setLogInError] = useState('');
  const { theme } = useDailyColor();

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
      <View style={[styles.body, {backgroundColor: theme.main}]}>
        <ThemedText type="title">Log In</ThemedText>

        <View> 
          <ThemedText type="default">Email: </ThemedText>
          <TextInput 
            style={[styles.inputField, {backgroundColor: theme.leastOpaque, color: theme.lessOpaque}]}
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
        </View>

        <View> 
          <ThemedText type="default">Password: </ThemedText>
          <TextInput 
            style={[styles.inputField, {backgroundColor: theme.leastOpaque, color: theme.lessOpaque}]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true} 
            placeholder="••••••••"/>
        </View>

        <Pressable 
          onPress={handleLogIn}
          style={[styles.actionButton, {backgroundColor: theme.leastOpaque, borderColor: theme.opaque}]}
        >
          <ThemedText type="default">Log in</ThemedText>
        </Pressable>
        <ThemedText type='default'>
          {logInError ? logInError : ''}
        </ThemedText>
        
        <View style={styles.span}>
          <ThemedText type="default">Don't have an account? </ThemedText>
          <Pressable onPress={() => router.push('./signup')}>
            <ThemedText type="link">Sign Up</ThemedText>
          </Pressable>
        </View>
        
        <Pressable onPress={handleForgotPassword}>
          <ThemedText>Forgot Password?</ThemedText>
        </Pressable>
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
  },
  span: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 10,
    justifyContent: 'center',
    borderWidth: 2,
  }
});
