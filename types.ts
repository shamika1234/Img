
export interface EditResult {
  image: string | null;
  text: string | null;
}

export interface EnhancedPrompts {
    enhancedPrompt: string;
    enhancedNegativePrompt: string;
}

export interface HistoryState {
  prompt: string;
  negativePrompt: string;
  editResult: EditResult | null;
  mask: string | null;
}