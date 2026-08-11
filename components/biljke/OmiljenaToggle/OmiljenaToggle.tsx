import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOmiljene } from '@/hooks/useOmiljene';

interface OmiljenaToggleProps {
  biljkaId: string;
  slug: string;
}

export function OmiljenaToggle({ biljkaId, slug }: OmiljenaToggleProps) {
  const { jeOmiljena, toggleOmiljena, toggleGuestOmiljena, jeGost } = useOmiljene();

  const aktivan = jeOmiljena(biljkaId);

  const handlePress = () => {
    if (jeGost) {
      toggleGuestOmiljena(biljkaId, slug);
    } else {
      toggleOmiljena(biljkaId);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={aktivan ? 'Ukloni iz omiljenih' : 'Dodaj u omiljene'}
      accessibilityState={{ checked: aktivan }}
      hitSlop={8}
      style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}
    >
      <Ionicons
        name={aktivan ? 'heart' : 'heart-outline'}
        size={22}
        color="#639922"
      />
    </Pressable>
  );
}
