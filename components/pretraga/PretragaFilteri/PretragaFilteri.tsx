import { ScrollView } from 'react-native';
import { TAGOVI } from '@/lib/constants/tagovi';
import { useJezikaStore } from '@/stores/jezikaStore';
import { FilterChip } from './FilterChip';

interface PretragaFilteriProps {
  aktivni_filter: string;
  onFilterChange: (filter: string) => void;
}

export function PretragaFilteri({ aktivni_filter, onFilterChange }: PretragaFilteriProps) {
  const { jezik } = useJezikaStore();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-2"
      style={{ flexGrow: 0 }}
      contentContainerStyle={{ paddingRight: 8, alignItems: 'center' }}
    >
      <FilterChip
        label={jezik === 'sr' ? 'Sve' : 'All'}
        aktivan={aktivni_filter === ''}
        onPress={() => onFilterChange('')}
      />
      {TAGOVI.map((tag) => (
        <FilterChip
          key={tag.filter}
          label={tag.label[jezik]}
          aktivan={aktivni_filter === tag.filter}
          onPress={() => onFilterChange(aktivni_filter === tag.filter ? '' : tag.filter)}
        />
      ))}
    </ScrollView>
  );
}
