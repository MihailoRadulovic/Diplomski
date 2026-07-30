import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Tema = 'svetla' | 'tamna' | 'sistem';

export const useTemaStore = create<{ tema: Tema; setTema: (tema: Tema) => void }>()(
  persist(
    (set) => ({ tema: 'sistem', setTema: (tema) => set({ tema }) }),
    { name: 'tema-podesavanje', storage: createJSONStorage(() => AsyncStorage) }
  )
);
