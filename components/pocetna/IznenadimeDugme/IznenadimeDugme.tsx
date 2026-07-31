import { useState } from 'react';
import { Pressable, View, Text } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase/client';
import { useT } from '@/hooks/useT';
import { SERIF_REGULAR } from '@/lib/constants/fontovi';

export function IznenadimeDugme() {
  const t = useT('pocetna');
  const [ucitava, setUcitava] = useState(false);

  const handleKlik = async () => {
    if (ucitava) return;
    setUcitava(true);
    try {
      const { count } = await supabase
        .from('biljke')
        .select('*', { count: 'exact', head: true })
        .is('deleted_at', null);

      if (!count || count === 0) return;

      const offset = Math.floor(Math.random() * count);
      const { data } = await supabase
        .from('biljke')
        .select('slug')
        .is('deleted_at', null)
        .order('srpski_naziv')
        .range(offset, offset)
        .single();

      if (data?.slug) router.push(`/biljka/${data.slug}` as never);
    } finally {
      setUcitava(false);
    }
  };

  return (
    <Pressable
      onPress={handleKlik}
      disabled={ucitava}
      accessibilityRole="button"
      accessibilityLabel={t('iznenadi_me')}
      accessibilityState={{ disabled: ucitava }}
      style={({ pressed }) => ({ opacity: ucitava ? 0.5 : pressed ? 0.7 : 1 })}
      className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 self-center"
    >
      {ucitava ? (
        <Ionicons name="sync" size={16} color="#639922" />
      ) : (
        <Ionicons name="shuffle" size={16} color="#639922" />
      )}
      <Text
        className="text-sm text-zinc-500 dark:text-zinc-400"
        style={{ fontFamily: SERIF_REGULAR }}
      >
        {t('iznenadi_me')}
      </Text>
    </Pressable>
  );
}
