import { create } from "zustand";

interface PretragaStore {
  q: string;
  filter: string;
  setQ: (q: string) => void;
  setFilter: (filter: string) => void;
}

// Zustand store za globalnu pretragu — deli state izmedju Navbar search i pretraga stranice
export const usePretragaStore = create<PretragaStore>((set) => ({
  q: "",
  filter: "",
  setQ: (q) => set({ q }),
  setFilter: (filter) => set({ filter }),
}));
