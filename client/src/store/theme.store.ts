import { create } from 'zustand';

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: localStorage.getItem('theme') === 'dark',
  toggleDarkMode: () => set((state) => {
    const newMode = !state.isDarkMode;
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { isDarkMode: newMode };
  }),
  initTheme: () => {
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ isDarkMode: isDark });
  }
}));
