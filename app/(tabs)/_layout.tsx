import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { useT } from '@/hooks/useT';

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const t = useT('nav');

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#639922',
      tabBarInactiveTintColor: isDark ? '#6B7280' : '#888',
      tabBarStyle: {
        backgroundColor: isDark ? '#0F1A08' : '#FFFFFF',
        borderTopColor: isDark ? '#2D4A1E' : '#E5E7EB',
      },
      headerShown: false,
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('pocetna'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pretraga"
        options={{
          title: t('pretraga'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="prepoznavanje"
        options={{
          title: t('kamera'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'camera' : 'camera-outline'} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="omiljene"
        options={{
          title: t('omiljene'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'heart' : 'heart-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="podesavanja"
        options={{
          title: t('podesavanja'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
