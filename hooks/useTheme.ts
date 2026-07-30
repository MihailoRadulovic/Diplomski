import { useEffect } from 'react';
import { useColorScheme } from 'nativewind';
import { useTemaStore, type Tema } from '@/stores/temaStore';

export function useTheme() {
  const { tema, setTema } = useTemaStore();
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    if (tema === 'tamna') {
      setColorScheme('dark');
    } else if (tema === 'svetla') {
      setColorScheme('light');
    } else {
      // 'sistem' — prati OS podesavanja
      setColorScheme('system');
    }
  }, [tema, setColorScheme]);

  // aktivnaTema za komponente koje trebaju eksplicitno znati light/dark
  const aktivnaTema: 'light' | 'dark' = colorScheme === 'dark' ? 'dark' : 'light';

  return { tema, setTema, aktivnaTema };
}
