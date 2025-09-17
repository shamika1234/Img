
import React from 'react';
import { IconPhotoEdit } from './Icon.tsx';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <IconPhotoEdit className="h-8 w-8 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white">AI Photo Editor</h1>
          </div>
        </div>
      </div>
    </header>
  );
};