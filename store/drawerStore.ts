import { create } from 'zustand';

type DrawerContent = 'therapist-profile' | null;

interface DrawerState {
  isOpen: boolean;
  content: DrawerContent;
  openDrawer: (content: DrawerContent) => void;
  closeDrawer: () => void;
}

export const useDrawerStore = create<DrawerState>((set) => ({
  isOpen: false,
  content: null,
  openDrawer: (content) => set({ isOpen: true, content }),
  closeDrawer: () => set({ isOpen: false, content: null }),
}));
