
import React from 'react';
import { EditResult } from '../types.ts';
import { Loader } from './Loader.tsx';
import { IconExclamationTriangle, IconPhoto, IconSparkles, IconDownload } from './Icon.tsx';
import { MaskingCanvas } from './MaskingCanvas.tsx';

interface EditorPanelProps {
  originalImage: string;
  editResult: EditResult | null;
  isLoading: boolean;
  error: string | null;
  onEnhanceAndRetry: () => void;
  isMasking: boolean;
  maskImage: string | null;
  onMaskChange: (mask: string | null) => void;
  brushSize: number;
}

const ImageContainer: React.FC<{ title: string; children: React.ReactNode; actions?: React.ReactNode }> = ({ title, children, actions }) => (
  <div className="flex-1 flex flex-col bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
    <div className="flex items-center justify-between bg-gray-900/50 border-b border-gray-700 px-4">
      <h3 className="text-center font-semibold py-3 text-gray-300">{title}</h3>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
    <div className="flex-grow p-2 flex items-center justify-center relative min-h-[300px] md:min-h-0">
      {children}
    </div>
  </div>
);

export const EditorPanel: React.FC<EditorPanelProps> = ({
  originalImage,
  editResult,
  isLoading,
  error,
  onEnhanceAndRetry,
  isMasking,
  maskImage,
  onMaskChange,
  brushSize,
}) => {
  const editedImage = editResult?.image;
  const aiText = editResult?.text;

  const handleDownload = () => {
    if (!editedImage) return;
    const link = document.createElement('a');
    link.href = editedImage;
    link.download = 'edited-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderEditedContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-gray-400 space-y-3">
          <Loader className="w-10 h-10" />
          <span className="text-lg font-medium animate-pulse">AI is creating...</span>
        </div>
      );
    }
    if (error) {
       const isSafetyError = error.includes('IMAGE_SAFETY') || error.includes('safety filters');
      return (
        <div className="flex flex-col items-center justify-center text-red-400 text-center p-4 space-y-3">
            <IconExclamationTriangle className="w-12 h-12 text-red-500"/>
          <p className="font-semibold">Generation Failed</p>
          <p className="text-sm">{error}</p>
          {isSafetyError && (
             <div className="mt-4 flex flex-col items-center gap-2">
                <button
                   onClick={onEnhanceAndRetry}
                   disabled={isLoading}
                   className="w-full flex items-center justify-center bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
                 >
                   <IconSparkles className="w-5 h-5 mr-2" />
                   Enhance & Retry
                 </button>
               <p className="text-xs text-gray-400 mt-2 bg-gray-700/50 p-2 rounded-md">
                   Hint: Let the AI improve your prompt to avoid safety blocks and try again.
               </p>
             </div>
          )}
        </div>
      );
    }
    if (editedImage) {
      return (
        <>
        <img src={editedImage} alt="Edited" className="max-w-full max-h-full object-contain rounded-lg" />
        {aiText && (
          <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm p-2 rounded-md text-center text-xs text-gray-200">
            {aiText}
          </div>
        )}
        </>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center text-gray-500 space-y-3">
        <IconPhoto className="w-16 h-16" />
        <span className="text-lg">Your edited image will appear here</span>
      </div>
    );
  };

  const renderOriginalContent = () => {
    if (isMasking) {
      return (
        <MaskingCanvas
          imageSrc={originalImage}
          brushSize={brushSize}
          onMaskChange={onMaskChange}
          initialMask={maskImage}
        />
      );
    }
    return <img src={originalImage} alt="Original" className="max-w-full max-h-full object-contain rounded-lg" />;
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-8">
      <ImageContainer title={isMasking ? "Draw a Mask" : "Original"}>
        {renderOriginalContent()}
      </ImageContainer>
      <ImageContainer 
        title="Edited"
        actions={editedImage && !isLoading && !error ? (
          <button onClick={handleDownload} className="p-2 text-gray-400 hover:text-white transition-colors" aria-label="Download Image">
            <IconDownload className="w-5 h-5" />
          </button>
        ) : undefined}
      >
        {renderEditedContent()}
      </ImageContainer>
    </div>
  );
};