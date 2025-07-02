import { create } from "zustand";

export const useStore = create((set) => ({
	activeVideo: null,
	setActiveVideo: (video) => set({ activeVideo: video }),
	splashscreenVisible: true,
	setSplashscreenVisible: (visible) => set({ splashscreenVisible: visible }),
}));
