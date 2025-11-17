'use client';

import { create } from 'zustand';

interface PopoverState {
  openedPopovers: Record<string, boolean>;
  openPopover: (id: string) => void;
  closePopover: (id: string) => void;
  togglePopover: (id: string) => void;
  isPopoverOpen: (id: string) => boolean;
  closeAllPopovers: () => void;
}

export const usePopoverStore = create<PopoverState>((set, get) => ({
  openedPopovers: {},

  openPopover: (id) => {
    set((state) => ({
      openedPopovers: { ...state.openedPopovers, [id]: true }
    }));
  },

  closePopover: (id) => {
    set((state) => ({
      openedPopovers: { ...state.openedPopovers, [id]: false }
    }));
  },

  togglePopover: (id) => {
    const isOpen = get().isPopoverOpen(id);
    set((state) => ({
      openedPopovers: { ...state.openedPopovers, [id]: !isOpen }
    }));
  },

  isPopoverOpen: (id) => {
    return get().openedPopovers[id] || false;
  },

  closeAllPopovers: () => {
    set({ openedPopovers: {} });
  }
}));
