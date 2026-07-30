import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/i18n';

export type Jezik = 'sr' | 'en';

export const useJezikaStore = create<{ jezik: Jezik; setJezik: (jezik: Jezik) => void }>()(
  persist(
    (set) => ({
      jezik: 'sr',
      setJezik: (jezik) => {
        set({ jezik });
        i18n.changeLanguage(jezik); // web ne mora ovo, next-intl menja URL
      },
    }),
    {
      name: 'jezik-podesavanje',
      storage: createJSONStorage(() => AsyncStorage),
      // VAZNO: Zustand rehydracija ne poziva setJezik — direktno setuje state.
      // onRehydrateStorage poziva i18n.changeLanguage() odmah po ucitavanju iz AsyncStorage.
      onRehydrateStorage: () => (state) => {
        if (state?.jezik) i18n.changeLanguage(state.jezik);
      },
    }
  )
);
