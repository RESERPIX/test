declare global {
  interface Window {
    __hubigrNavigate?: (path: string) => void;
  }
}

export {};
