import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

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
          title: 'Početna',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pretraga"
        options={{
          title: 'Pretraga',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="prepoznavanje"
        options={{
          title: 'Kamera',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'camera' : 'camera-outline'} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="omiljene"
        options={{
          title: 'Omiljene',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'heart' : 'heart-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="podesavanja"
        options={{
          title: 'Podešavanja',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
