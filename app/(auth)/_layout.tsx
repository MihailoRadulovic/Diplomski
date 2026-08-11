import { Stack } from 'expo-router';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';

export default function AuthLayout() {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#C8E6A0' : '#27500A';

  return (
    <Stack>
      <Stack.Screen
        name="prijava"
        options={{
          title: '',
          headerTransparent: true,
          headerRight: () => (
            <Pressable onPress={() => router.back()} accessibilityLabel="Zatvori">
              <Ionicons name="close" size={24} color={iconColor} />
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
              <Ionicons name="close" size={24} color={iconColor} />
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
