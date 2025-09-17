
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header.tsx';
import { ImageUploader } from './components/ImageUploader.tsx';
import { ControlPanel } from './components/ControlPanel.tsx';
import { EditorPanel } from './components/EditorPanel.tsx';
import { editImageWithPrompt, enhancePrompt } from './services/geminiService.ts';
import { HistoryState } from './types.ts';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalMimeType, setOriginalMimeType] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // New state for masking tool
  const [isMasking, setIsMasking] = useState(false);
  const [maskImage, setMaskImage] = useState<string | null>(null);
  const [brushSize, setBrushSize] = useState(30);

  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const currentHistoryState = history[historyIndex] ?? null;
  const currentEditResult = currentHistoryState?.editResult ?? null;
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImage(reader.result as string);
      setOriginalMimeType(file.type);
      const initialState: HistoryState = { prompt: '', negativePrompt: '', editResult: null, mask: null };
      setHistory([initialState]);
      setHistoryIndex(0);
      setError(null);
      setPrompt('');
      setNegativePrompt('');
      setMaskImage(null);
      setIsMasking(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleGenerate = useCallback(async (currentPrompt?: string, currentNegativePrompt?: string) => {
    const p = currentPrompt ?? prompt;
    const np = currentNegativePrompt ?? negativePrompt;

    if (!originalImage || !originalMimeType || !p.trim()) {
      setError('Please upload an image and enter a prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const base64Data = originalImage.split(',')[1];
      const maskBase64 = maskImage?.split(',')[1];

      const result = await editImageWithPrompt(base64Data, originalMimeType, p, np, maskBase64);
      
      const newHistoryState: HistoryState = {
          prompt: p,
          negativePrompt: np,
          editResult: result,
          mask: maskImage, // Save the mask used for this generation
      };
      
      const newHistory = history.slice(0, historyIndex + 1);
      setHistory([...newHistory, newHistoryState]);
      setHistoryIndex(newHistory.length);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
      setIsMasking(false); // Turn off masking mode after generation
    }
  }, [originalImage, originalMimeType, prompt, negativePrompt, history, historyIndex, maskImage]);
  
  const handleEnhanceAndRetry = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { enhancedPrompt, enhancedNegativePrompt } = await enhancePrompt(prompt, negativePrompt);
      setPrompt(enhancedPrompt);
      setNegativePrompt(enhancedNegativePrompt);
      await handleGenerate(enhancedPrompt, enhancedNegativePrompt);
    } catch (err) {
      console.error("Failed to enhance prompt:", err);
      const newError = err instanceof Error ? err.message : 'Failed to enhance prompt.';
      setError(newError);
      setIsLoading(false); 
    }
  }, [prompt, negativePrompt, handleGenerate]);

  const handleReset = useCallback(() => {
    setOriginalImage(null);
    setOriginalMimeType(null);
    setError(null);
    setPrompt('');
    setNegativePrompt('');
    setIsLoading(false);
    setHistory([]);
    setHistoryIndex(-1);
    setMaskImage(null);
    setIsMasking(false);
  }, []);

  const handleUndo = useCallback(() => {
      if (canUndo) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          const prevState = history[newIndex];
          setPrompt(prevState.prompt);
          setNegativePrompt(prevState.negativePrompt);
          setMaskImage(prevState.mask);
          setError(null);
      }
  }, [canUndo, history, historyIndex]);

  const handleRedo = useCallback(() => {
      if (canRedo) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          const nextState = history[newIndex];
          setPrompt(nextState.prompt);
          setNegativePrompt(nextState.negativePrompt);
          setMaskImage(nextState.mask);
          setError(null);
      }
  }, [canRedo, history, historyIndex]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 lg:p-8">
        {!originalImage ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <div className="w-full h-full max-w-7xl flex flex-col lg:flex-row gap-8">
            <ControlPanel
              prompt={prompt}
              onPromptChange={setPrompt}
              negativePrompt={negativePrompt}
              onNegativePromptChange={setNegativePrompt}
              onGenerate={() => handleGenerate()}
              onReset={handleReset}
              isLoading={isLoading}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={canUndo}
              canRedo={canRedo}
              isMasking={isMasking}
              onToggleMasking={() => setIsMasking(!isMasking)}
              brushSize={brushSize}
              onBrushSizeChange={setBrushSize}
            />
            <EditorPanel
              originalImage={originalImage}
              editResult={currentEditResult}
              isLoading={isLoading}
              error={error}
              onEnhanceAndRetry={handleEnhanceAndRetry}
              isMasking={isMasking}
              maskImage={currentHistoryState?.mask ?? maskImage}
              onMaskChange={setMaskImage}
              brushSize={brushSize}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;