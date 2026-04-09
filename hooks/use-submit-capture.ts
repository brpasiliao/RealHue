import { supabase } from '@/lib/supabase';
import { useState } from 'react';

type UseSubmitCaptureResult = {
  submitCapture: Function,
  submitted: boolean,
  loading: boolean,
}


export function useSubmitCapture(userId: string, uri: string, colors: string[], passingColors: string[]): UseSubmitCaptureResult {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  
  async function uploadImage(): Promise<string | null> {
    const response = await fetch(uri)
    const arrayBuffer = await response.arrayBuffer();

    const filePath = `${userId}/${Date.now()}.jpg`;

    const { data, error } = await supabase.storage
      .from('captures')
      .upload(filePath, arrayBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (error) {
      console.log(error);
      return null;
    }
    return filePath;
  }

  async function postImage(filePath: string) {
    const { data: { publicUrl } } = supabase.storage
      .from('captures')
      .getPublicUrl(filePath)
    
    const { error } = await supabase
      .from('captures')
      .insert({
        user_id: userId,
        capture_url: publicUrl,
        colors: colors,
        passingColors: passingColors,
      });

    if (error) {
      console.log(error);
      return null;
    }
  }

  const submitCapture = () => {
    const submit = async () => {
      const filePath = await uploadImage();
      if (filePath) await postImage(filePath);
    }

    try {
      submit();
      setSubmitted(true);
      setLoading(false);
    } catch (error) {
      console.error('Cannot submit capture', error);
    }
  };

  return { submitCapture, submitted, loading };
}
