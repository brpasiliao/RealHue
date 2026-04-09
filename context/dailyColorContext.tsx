import { getThemeFromColor } from '@/utils/color-helper';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type DailyColorContextType = {
  theme: any | null;
  loading: boolean | null;
};

const DailyColorContext = createContext<DailyColorContextType>({theme: null, loading: null})


export function DailyColorProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<object | null>(null)
  const [loading, setLoading] = useState<boolean | null>(true);

  const fetchTheme = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('daily_colors')
      .select('*')
      .eq('date', today)
      .single();
    console.log(today);

    if (error) {
      console.error('daily color context error', error);
    } else {
      setTheme(getThemeFromColor(data?.color));
      console.log('theme set: ' + data?.color);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTheme();
  }, []);

  return (
    <DailyColorContext.Provider value={{ theme, loading }}>
      {children}
    </DailyColorContext.Provider>
  )
}

export const useDailyColor = () => useContext(DailyColorContext);