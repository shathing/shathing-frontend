import { create } from "zustand";
import type { Category } from "@/types/models/category";
import type { Location } from "@/types/models/location";

type ShareItemPostState = {
  selectedCategory: Category | null;
  selectedLocation: Location | null;
  setSelectedCategory: (category: Category | null) => void;
  setSelectedLocation: (location: Location | null) => void;
};

export const useShareItemPostStore = create<ShareItemPostState>()(
  (set) => ({
    selectedCategory: null,
    selectedLocation: null,
    setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
    setSelectedLocation: (selectedLocation) => set({ selectedLocation }),
  })
);
