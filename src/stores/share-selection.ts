import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Category } from "@/types/models/category";
import type { LegalDong } from "@/types/models/legal-dong";

type ShareSelectionState = {
  selectedCategory: Category | null;
  selectedLegalDong: LegalDong | null;
  setSelectedCategory: (category: Category | null) => void;
  setSelectedLegalDong: (dong: LegalDong | null) => void;
  resetSelections: () => void;
};

const initialState = {
  selectedCategory: null,
  selectedLegalDong: null,
};

export const useShareSelectionStore = create<ShareSelectionState>()(
  persist(
    (set) => ({
      ...initialState,
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSelectedLegalDong: (dong) => set({ selectedLegalDong: dong }),
      resetSelections: () => set(initialState),
    }),
    {
      name: "share-selection",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedCategory: state.selectedCategory,
        selectedLegalDong: state.selectedLegalDong,
      }),
    }
  )
);
