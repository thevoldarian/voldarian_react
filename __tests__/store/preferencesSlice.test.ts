import { describe, it, expect } from 'vitest';
import preferencesReducer, {
  setTheme,
  setLanguage,
  toggleSidebar,
  setSidebarCollapsed,
} from '../../src/store/slices/preferencesSlice';

describe('preferencesSlice', () => {
  const initialState = {
    theme: 'light' as const,
    language: 'en' as const,
    sidebarCollapsed: false,
  };

  it('should handle setTheme', () => {
    const state = preferencesReducer(initialState, setTheme('dark'));
    expect(state.theme).toBe('dark');
  });

  it('should handle setLanguage', () => {
    const state = preferencesReducer(initialState, setLanguage('es'));
    expect(state.language).toBe('es');
  });

  it('should handle toggleSidebar', () => {
    const state = preferencesReducer(initialState, toggleSidebar());
    expect(state.sidebarCollapsed).toBe(true);

    const state2 = preferencesReducer(state, toggleSidebar());
    expect(state2.sidebarCollapsed).toBe(false);
  });

  it('should handle setSidebarCollapsed', () => {
    const state = preferencesReducer(initialState, setSidebarCollapsed(true));
    expect(state.sidebarCollapsed).toBe(true);

    const state2 = preferencesReducer(state, setSidebarCollapsed(false));
    expect(state2.sidebarCollapsed).toBe(false);
  });
});
