import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, PlayfairDisplay_700Bold, PlayfairDisplay_400Regular, PlayfairDisplay_400Regular_Italic } from '@expo-google-fonts/playfair-display';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/hooks/useTheme';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import '@/i18n';
import '@/global.css';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { aktivnaTema } = useTheme();

  return (
    <>
      <StatusBar style={aktivnaTema === 'dark' ? 'light' : 'dark'} />
      {children}
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'PlayfairDisplay-Bold': PlayfairDisplay_700Bold,
    'PlayfairDisplay-Regular': PlayfairDisplay_400Regular,
    'PlayfairDisplay-Italic': PlayfairDisplay_400Regular_Italic,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      useAuthStore.getState()._setKorisnik(session?.user ?? null);
      useAuthStore.getState()._setUcitava(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      useAuthStore.getState()._setKorisnik(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false, headerBackTitle: '' }} />
              <Stack.Screen name="biljka/[slug]" options={{ headerShown: true, title: '', headerBackButtonDisplayMode: 'minimal' }} />
              <Stack.Screen name="(auth)" options={{ presentation: 'modal', headerShown: false }} />
            </Stack>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
