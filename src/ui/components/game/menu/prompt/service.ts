import { create } from "zustand";

export interface PromptConfig {
  title?: string;
  message: string;
  placeholder?: string;
  defaultValue?: string;
  confirmText?: string;
  cancelText?: string;
}

interface PromptState {
  config: PromptConfig | null;
  resolver: ((value: string | null) => void) | null;
}

const usePromptStore = create<PromptState>(() => ({
  config: null,
  resolver: null,
}));

export function showPrompt(config: PromptConfig): Promise<string | null> {
  return new Promise((resolve) => {
    usePromptStore.setState({ config, resolver: resolve });
  });
}

export function resolvePrompt(value: string | null) {
  usePromptStore.getState().resolver?.(value);
  usePromptStore.setState({ config: null, resolver: null });
}

export function usePromptState() {
  return usePromptStore((s) => s.config);
}
