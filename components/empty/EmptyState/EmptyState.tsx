import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SERIF_BOLD } from '@/lib/constants/fontovi';

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center py-16 px-4">
      <Ionicons name="leaf-outline" size={64} color="#639922" style={{ opacity: 0.5, marginBottom: 16 }} />
      <Text
        className="text-xl text-tekst-primarni dark:text-[#E8F5E2] mb-2 text-center"
        style={{ fontFamily: SERIF_BOLD }}
      >
        {title}
      </Text>
      {description && (
        <Text className="text-sm text-tekst-blagi dark:text-zinc-400 max-w-xs text-center">
          {description}
        </Text>
      )}
      {action && <View className="mt-6">{action}</View>}
    </View>
  );
}
