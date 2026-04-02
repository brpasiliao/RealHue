import { useAuth } from '@/context/authContext';
import { Redirect } from 'expo-router';

export default function Profile() {
  const { user, session } = useAuth();

  return <Redirect href={
    session ? 
      "/(tabs)/profile/account" : 
      "/(tabs)/profile/login"
  } />;
}