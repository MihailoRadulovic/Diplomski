import { View, Text } from 'react-native';
import { Spinner } from '@/components/ui/Spinner/Spinner';

export function PrepoznavanjeLoader() {
  return (
    <View className="items-center gap-4 py-12">
      <Spinner size="large" />
      <Text className="text-sm text-zinc-500 dark:text-zinc-400">Analiziramo sliku...</Text>
    </View>
  );
}
