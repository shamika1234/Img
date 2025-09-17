
import React, { useState } from 'react';
import { IconSparkles, IconTrash, IconUndo, IconRedo, IconWand } from './Icon.tsx';
import { Loader } from './Loader.tsx';

interface ControlPanelProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  negativePrompt: string;
  onNegativePromptChange: (prompt: string) => void;
  onGenerate: () => void;
  onReset: () => void;
  isLoading: boolean;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isMasking: boolean;
  onToggleMasking: () => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
}

const examplePrompts = [
    "Add a majestic castle in the background",
    "Change my shirt to be bright red",
    "Put a cute cat on my shoulder",
    "Make the photo look like a watercolor painting",
];

const surprisePrompts = [
  "Turn the scene into a neon-lit cyberpunk city",
  "Add a gentle layer of morning fog",
  "Make it look like an oil painting by Van Gogh",
  "Place a whimsical fairy sitting on a flower",
  "Transform the background into a lush, enchanted forest",
  "Add a dramatic, fiery sunset to the sky",
  "Give the subject elegant, steampunk-style goggles",
  "Surround the scene with floating, glowing lanterns",
  "Change the season to a snowy winter day",
  "Add a reflection in a puddle on the ground showing a different world",
];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  prompt,
  onPromptChange,
  negativePrompt,
  onNegativePromptChange,
  onGenerate,
  onReset,
  isLoading,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isMasking,
  onToggleMasking,
  brushSize,
  onBrushSizeChange,
}) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    
    const handleExampleClick = (example: string) => {
        onPromptChange(example);
    }
    
    const handleSurpriseMe = () => {
        const randomPrompt = surprisePrompts[Math.floor(Math.random() * surprisePrompts.length)];
        onPromptChange(randomPrompt);
    };

  return (
    <div className="w-full lg:w-1/3 xl:w-1/4 bg-gray-800/50 border border-gray-700 rounded-2xl p-6 flex flex-col space-y-6 self-start">
      <h2 className="text-2xl font-bold text-white">Edit with AI</h2>

      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
          Describe your edit
        </label>
        <textarea
          id="prompt"
          rows={4}
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="e.g., 'add a futuristic city in the background'"
          className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
          disabled={isLoading}
        />
         <button 
            onClick={handleSurpriseMe} 
            disabled={isLoading}
            className="mt-2 text-sm flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors disabled:opacity-50">
            <IconWand className="w-4 h-4" />
            Surprise Me!
          </button>
      </div>

       <div className="space-y-3 bg-gray-900/50 p-3 rounded-lg border border-gray-700">
          <h3 className="font-semibold text-white">Masking Tool</h3>
          <p className="text-xs text-gray-400">Paint over an area to edit only that part of the image.</p>
          <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={isMasking} onChange={onToggleMasking} className="sr-only peer" disabled={isLoading}/>
              <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              <span className="ml-3 text-sm font-medium text-gray-300">{isMasking ? 'Masking Enabled' : 'Masking Disabled'}</span>
          </label>
          {isMasking && (
              <div className="pt-2">
                   <label htmlFor="brush-size" className="block text-sm font-medium text-gray-300 mb-1">
                      Brush Size: <span className="font-bold text-white">{brushSize}</span>
                  </label>
                  <input
                      id="brush-size"
                      type="range"
                      min="5"
                      max="100"
                      value={brushSize}
                      onChange={(e) => onBrushSizeChange(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      disabled={isLoading}
                  />
              </div>
          )}
      </div>

      <div className="space-y-2">
        <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
        </button>
        {showAdvanced && (
            <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                <label htmlFor="negative-prompt" className="block text-sm font-medium text-gray-300 mb-2">
                    Negative Prompt (Optional)
                </label>
                <textarea
                  id="negative-prompt"
                  rows={2}
                  value={negativePrompt}
                  onChange={(e) => onNegativePromptChange(e.target.value)}
                  placeholder="e.g., 'text, blurry, watermark'"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">Describe what you want to avoid in the image.</p>
            </div>
        )}
      </div>
      
      <div className="flex-grow"></div>

      <div className="pt-4 border-t border-gray-700">
        <div className="flex items-center space-x-3 mb-3">
            <button
                onClick={onUndo}
                disabled={!canUndo || isLoading}
                className="flex-1 flex items-center justify-center bg-gray-700 text-gray-300 font-medium py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <IconUndo className="w-5 h-5 mr-2" />
                Undo
            </button>
            <button
                onClick={onRedo}
                disabled={!canRedo || isLoading}
                className="flex-1 flex items-center justify-center bg-gray-700 text-gray-300 font-medium py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <IconRedo className="w-5 h-5 mr-2" />
                Redo
            </button>
        </div>
        <div className="flex flex-col space-y-3">
            <button
              onClick={onGenerate}
              disabled={isLoading || !prompt.trim()}
              className="w-full flex items-center justify-center bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-600 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <IconSparkles className="w-5 h-5 mr-2" />
                  Generate
                </>
              )}
            </button>
            <button
              onClick={onReset}
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-gray-700 text-gray-300 font-medium py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
                <IconTrash className="w-5 h-5 mr-2" />
                Start Over
            </button>
        </div>
      </div>
    </div>
  );
};