import { useCheckSubmit } from '@/hooks/use-check-submit';
import { Redirect } from 'expo-router';


export default function Capture() {
  const submission = useCheckSubmit();

  return <Redirect href={
    submission.submission ? 
      "/(tabs)/capture/analyze" : 
      "/(tabs)/capture/prompt"
  } />;
}
