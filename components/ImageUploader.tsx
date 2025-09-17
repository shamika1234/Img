
import React, { useCallback, useState } from 'react';
import { IconUpload } from './Icon.tsx';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onImageUpload(e.dataTransfer.files[0]);
      }
    },
    [onImageUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`relative block w-full h-96 rounded-2xl border-2 border-dashed transition-all duration-300 ${
          isDragging ? 'border-cyan-400 bg-gray-800/50' : 'border-gray-600 hover:border-gray-500'
        } flex flex-col items-center justify-center text-center cursor-pointer p-6`}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className={`p-4 rounded-full bg-gray-800 transition-colors duration-300 ${isDragging ? 'bg-cyan-500/20' : ''}`}>
                <IconUpload className={`w-12 h-12 text-gray-500 transition-colors duration-300 ${isDragging ? 'text-cyan-400' : ''}`} />
            </div>
          <span className="text-xl font-semibold text-gray-300">
            Drag & drop an image here
          </span>
          <span className="text-gray-400">or click to select a file</span>
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};