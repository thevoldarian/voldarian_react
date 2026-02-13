// jest-dom adds custom matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import { vi } from 'vitest';
import type { ReactNode } from 'react';

// Global mock for react-i18next so tests receive deterministic text.
// It returns translation keys as the visible string which keeps tests
// resilient without loading the full i18n stack.
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: async () => {} },
  }),
  Trans: ({ children }: { children: ReactNode }) => children,
}));

// Minimal environment polyfills/mocks for browser APIs used by UI libs
if (typeof window !== 'undefined') {
  // matchMedia used by some components/styles
  if (!window.matchMedia) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.matchMedia = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
  }

  // Simple ResizeObserver mock for layout libraries
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!window.ResizeObserver) {
    class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.ResizeObserver = ResizeObserver;
  }

  // requestAnimationFrame fallback for jsdom
  if (!window.requestAnimationFrame) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(cb, 0) as unknown as number;
  }
}
