import { create } from "zustand";
import type { Category } from "@/types/models/category";
import type { Region } from "@/types/models/region";

type ShareItemPostState = {
  selectedCategory: Category | null;
  selectedRegion: Region | null;
};

type ShareItemPostActions = {
  setSelectedCategory: (category: Category | null) => void;
  setSelectedRegion: (region: Region | null) => void;
}

const initialState: ShareItemPostState = {
  selectedCategory: null,
  selectedRegion: null,
}

export const useShareItemPostStore = create<ShareItemPostState & ShareItemPostActions>()(
  (set) => ({
    ...initialState,
    setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
    setSelectedRegion: (selectedRegion) => set({ selectedRegion }),
  })
);
