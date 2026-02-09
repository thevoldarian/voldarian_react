import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark';
export type Language = 'en' | 'es' | 'de' | 'ja' | 'ar';

interface PreferencesState {
  theme: Theme;
  language: Language;
  sidebarCollapsed: boolean;
}

const initialState: PreferencesState = {
  theme: 'light',
  language: 'en',
  sidebarCollapsed: false,
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
    toggleSidebar: state => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
  },
});

export const { setTheme, setLanguage, toggleSidebar, setSidebarCollapsed } = preferencesSlice.actions;
export default preferencesSlice.reducer;
