import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function ScreenWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#0F1A08]">
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
