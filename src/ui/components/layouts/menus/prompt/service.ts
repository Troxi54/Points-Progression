export interface PromptConfig {
  title?: string;
  message: string;
  placeholder?: string;
  defaultValue?: string;
  confirmText?: string;
  cancelText?: string;
}

type PromptResolver = (value: string | null) => void;

let resolver: PromptResolver | null = null;
let currentConfig: PromptConfig | null = null;
let notifyUpdate: (() => void) | null = null;

export function showPrompt(config: PromptConfig): Promise<string | null> {
  if (resolver) {
    console.warn("Prompt is already open");
    return Promise.resolve(null);
  }

  currentConfig = config;

  return new Promise((resolve) => {
    resolver = resolve;
    notifyUpdate?.();
  });
}

export function resolvePrompt(value: string | null) {
  resolver?.(value);
  resolver = null;
  currentConfig = null;
  notifyUpdate?.();
}

export function usePromptState(onUpdate: () => void): PromptConfig | null {
  notifyUpdate = onUpdate;
  return currentConfig;
}
