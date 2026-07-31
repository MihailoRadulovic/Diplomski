import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import '@/i18n'; // inicijalizacija i18n
import '@/global.css';
import { useTheme } from '@/hooks/useTheme';

// Poziva se sinhrono — drzi splash dok auth init ne zavrsi
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const { aktivnaTema } = useTheme();

  useEffect(() => {
    // Splash se sakriva tek kada je sve spremno.
    // Auth init i font load se dodaju ovde u Fazi 17 kada se ucitavaju fontovi.
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style={aktivnaTema === 'dark' ? 'light' : 'dark'} />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="biljka/[slug]" options={{ headerShown: true, title: '' }} />
            <Stack.Screen name="(auth)/prijava" options={{ presentation: 'modal', title: 'Prijava' }} />
            <Stack.Screen name="(auth)/registracija" options={{ presentation: 'modal', title: 'Registracija' }} />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
