import { Stack } from 'expo-router';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="prijava"
        options={{
          title: '',
          headerTransparent: true,
          headerRight: () => (
            <Pressable onPress={() => router.back()} accessibilityLabel="Zatvori">
              <Ionicons name="close" size={24} color="#27500A" />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="registracija"
        options={{
          title: '',
          headerTransparent: true,
          headerRight: () => (
            <Pressable onPress={() => router.back()} accessibilityLabel="Zatvori">
              <Ionicons name="close" size={24} color="#27500A" />
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
