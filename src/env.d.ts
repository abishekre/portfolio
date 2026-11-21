// Globals set by small inline scripts (Toast, LockScreen, StatusBar) so any page can call them.
interface Window {
  __toast?: (text: string, ms?: number) => void;
  __egg?: (id: 'dev' | 'offline' | 'coffee' | 'jiggle') => boolean;
  __eggs?: () => string[];
  __lock?: (instant?: boolean) => void;
  __unlock?: () => void;
  __tick?: () => void;
  __theme?: {
    mode: () => 'light' | 'dark' | 'auto';
    isDark: () => boolean;
    set: (mode: 'light' | 'dark' | 'auto', x?: number, y?: number) => void;
    toggle: (x?: number, y?: number) => void;
    calm: (on: boolean) => void;
  };
  __cc?: { open: () => void; close: () => void };
  va?: (kind: 'event', data: { name: string }) => void;
}
