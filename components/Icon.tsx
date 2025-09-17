
import React from 'react';

interface IconProps {
  className?: string;
}

export const IconPhotoEdit: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 12.1a3.1 3.1 0 0 0 -2.7 -2.7" />
        <path d="M3.9 12.1a3.1 3.1 0 0 0 2.7 2.7" />
        <path d="M12 21.1a3.1 3.1 0 0 0 2.7 -2.7" />
        <path d="M12 3.9a3.1 3.1 0 0 0 -2.7 2.7" />
        <path d="M11 12.5l-1.5 4l-1.5 -4" />
        <path d="M14 12.5l1.5 4l1.5 -4" />
        <path d="M10 9h6" />
        <path d="M13 9v8" />
    </svg>
);


export const IconUpload: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export const IconSparkles: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 3l1.9 3.8l4.1 .6l-3 2.9l.7 4.1l-3.7 -2l-3.7 2l.7 -4.1l-3 -2.9l4.1 -.6z" />
        <path d="M3 12l1.9 3.8l4.1 .6l-3 2.9l.7 4.1l-3.7 -2l-3.7 2l.7 -4.1l-3 -2.9l4.1 -.6z" />
    </svg>
);

export const IconTrash: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 7l16 0" />
        <path d="M10 11l0 6" />
        <path d="M14 11l0 6" />
        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
    </svg>
);

export const IconPhoto: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="15" y1="8" x2="15.01" y2="8"></line>
        <rect x="4" y="4" width="16" height="16" rx="3"></rect>
        <path d="M4 15l4 -4a3 5 0 0 1 3 0l5 5"></path>
        <path d="M14 14l1 -1a3 5 0 0 1 3 0l2 2"></path>
    </svg>
);

export const IconExclamationTriangle: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

export const IconUndo: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 7v6h6" />
        <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </svg>
);

export const IconRedo: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 7v6h-6" />
        <path d="M3 17a9 9 0 0 0 9 9 9 9 0 0 0 6-2.3L21 13" />
    </svg>
);

export const IconDownload: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

export const IconWand: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M15 4V2" />
        <path d="M15 8V6" />
        <path d="M12.5 6.5L14 5" />
        <path d="M16 8.5L17.5 7" />
        <path d="M18 4h2" />
        <path d="M22 4h-2" />
        <path d="M20.5 6.5L19 5" />
        <path d="M18 8.5L16.5 7" />
        <path d="m9 13.5 1-1" />
        <path d="M3 21l6-6" />
        <path d="M9 12.5l1.5-1.5" />
        <path d="M13.5 12.5L15 11" />
        <path d="M16.5 9.5L18 8" />
        <path d="M3 3l18 18" />
    </svg>
);