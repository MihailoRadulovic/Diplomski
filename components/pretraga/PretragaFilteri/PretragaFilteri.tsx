import { ScrollView } from 'react-native';
import { TAGOVI } from '@/lib/constants/tagovi';
import { FilterChip } from './FilterChip';

interface PretragaFilteriProps {
  aktivni_filter: string;
  onFilterChange: (filter: string) => void;
}

export function PretragaFilteri({ aktivni_filter, onFilterChange }: PretragaFilteriProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-3"
      contentContainerStyle={{ paddingRight: 8 }}
    >
      {TAGOVI.map((tag) => (
        <FilterChip
          key={tag.filter}
          label={tag.label.sr}
          aktivan={aktivni_filter === tag.filter}
          onPress={() => onFilterChange(aktivni_filter === tag.filter ? '' : tag.filter)}
        />
      ))}
    </ScrollView>
  );
}
