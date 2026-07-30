import { View, Text } from 'react-native';

export default function OmiljeneTab() {
  // Napomena: guest korisnici MOGU videti omiljene (cuvaju se u AsyncStorage)
  // Auth guard ovde nije potreban — web takodje dozvoljava gostima
  return (
    <View className="flex-1 items-center justify-center bg-pozadina dark:bg-[#0F1A08]">
      <Text className="text-tekst-primarni dark:text-[#E8F5E2]">Omiljene</Text>
    </View>
  );
}
