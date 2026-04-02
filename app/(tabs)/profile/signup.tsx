import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { supabase } from '@/lib/supabase';
import { getRandomColor } from '@/utils/color-helper';
import { router } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Keyboard, Pressable, StyleSheet, TextInput, TouchableWithoutFeedback } from 'react-native';

const { width, height } = Dimensions.get('window');


export default function Signup() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [username, setUsername] = useState('');
  const [signUpError, setSignUpError] = useState('');

  async function handleSignUp() {
    try {
      const { data, error } = await supabase.auth.signUp(
        {
          email: email,
          password: password,
          options: {
            data: {
              username: username,
              color: getRandomColor(),
            }
          }
        }
      );

      if (error) {
        setSignUpError(error.message);
      } else if (password !== rePassword) {
        setSignUpError('Passwords must match');
      } else {
        router.dismissTo('./login');
      }

    } catch (err) {
      console.error('Error logging in', err);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.body}>

        <ThemedText type='title'>Sign Up</ThemedText>

        <ThemedView> 
          <ThemedText type='default'>Email: </ThemedText>
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
          <ThemedText type='default'>
            {emailError ? emailError : ''}
          </ThemedText>
        </ThemedView>

        <ThemedView> 
          <ThemedText type='default'>Username: </ThemedText>
          <TextInput 
            style={styles.inputField}
            value={username}
            onChangeText={setUsername}
            placeholder="user_name"
          />
        </ThemedView>

        <ThemedView> 
          <ThemedText type='default'>Password: </ThemedText>
          <TextInput 
            style={styles.inputField}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true} 
            placeholder="••••••••"/>
        </ThemedView>

        <ThemedView> 
          <ThemedText type='default'>Repeat password: </ThemedText>
          <TextInput 
            style={styles.inputField}
            value={rePassword}
            onChangeText={setRePassword}
            secureTextEntry={true} 
            placeholder="••••••••"
          />
          <ThemedText type='default'>
            {password !== rePassword ? 'Passwords must match' : ''}
          </ThemedText>
        </ThemedView>

        <Pressable 
          style={styles.actionButton}
          onPress={handleSignUp}
        >
          <ThemedText type='default'>Sign Up</ThemedText>
        </Pressable>
        <ThemedText type='default'>
          {signUpError}
        </ThemedText>
        
        <ThemedView style={styles.span}>
          <ThemedText type='default'>Already have an account?</ThemedText>
          <Pressable onPress={() => router.push('./login')}>
            <ThemedText type='default'>Log in</ThemedText>
          </Pressable>
        </ThemedView>
        
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
