import { useAuth } from '@/context/authContext';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { useEffect, useState } from 'react';

type Submission = Database['public']['Tables']['captures']['Row'];
type UseCheckSubmitResult = {
  submission: Submission | null,
  loading: boolean,
  refetch: () => void,
}

export function useCheckSubmit(): UseCheckSubmitResult {
  const { user, session } = useAuth();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  const check = async () => {
    if (!session || !user) {
      setLoading(false);
      return;
    }

    setLoading(true)

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data, error } = await supabase
      .from('captures')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString())
      .single();

    if (error) {
      setSubmission(null);
    } else {
      setSubmission(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    check()
  }, [session]);

  return { submission, loading, refetch: check }
}