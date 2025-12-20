import { create } from "zustand";


const DEFAULT_THEME = "coffee";

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("theme") || DEFAULT_THEME,
    
    setTheme: (theme) => {
        localStorage.setItem("theme", theme);
        set({ theme });
    }
}));