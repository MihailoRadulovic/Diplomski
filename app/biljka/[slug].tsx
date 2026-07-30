import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function BiljkaDetaljiEkran() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  return (
    <View className="flex-1 items-center justify-center bg-pozadina dark:bg-[#0F1A08]">
      <Text className="text-tekst-primarni dark:text-[#E8F5E2]">{slug}</Text>
    </View>
  );
}
