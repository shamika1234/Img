
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface MaskingCanvasProps {
  imageSrc: string;
  brushSize: number;
  onMaskChange: (mask: string | null) => void;
  initialMask: string | null;
}

export const MaskingCanvas: React.FC<MaskingCanvasProps> = ({
  imageSrc,
  brushSize,
  onMaskChange,
  initialMask,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Maintain aspect ratio
    const container = containerRef.current;
    if (!container) return;

    const canvasWidth = container.clientWidth;
    const canvasHeight = (image.height / image.width) * canvasWidth;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Draw the original image as the background
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  }, [image]);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => setImage(img);
  }, [imageSrc]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    if (initialMask) {
      const maskImg = new Image();
      maskImg.src = initialMask;
      maskImg.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(maskImg, 0, 0, canvas.width, canvas.height);
      };
    } else {
      draw(); // Clear canvas if initialMask is null
    }
  }, [initialMask, draw]);
  
  const getMousePos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const touch = 'touches' in e ? e.touches[0] : null;
    return {
      x: (touch ? touch.clientX : (e as React.MouseEvent).clientX) - rect.left,
      y: (touch ? touch.clientY : (e as React.MouseEvent).clientY) - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getMousePos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const drawOnCanvas = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const pos = getMousePos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'; // Semi-transparent red
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.closePath();
    }
    setIsDrawing(false);
    
    // Create a new canvas for the mask only (black and white)
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    const maskCtx = maskCanvas.getContext('2d');
    
    if (maskCtx) {
      // Draw original image to get pixel data
      maskCtx.drawImage(image!, 0, 0, canvas.width, canvas.height);
      const originalImageData = maskCtx.getImageData(0, 0, canvas.width, canvas.height);

      // Get drawn data from main canvas
      const drawnImageData = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height);
      
      const maskData = maskCtx.createImageData(canvas.width, canvas.height);

      for (let i = 0; i < originalImageData.data.length; i += 4) {
        // If the pixel on the drawing canvas is different from the original image, it's part of the mask
        if (
          drawnImageData.data[i] !== originalImageData.data[i] ||
          drawnImageData.data[i + 1] !== originalImageData.data[i + 1] ||
          drawnImageData.data[i + 2] !== originalImageData.data[i + 2]
        ) {
          // White for masked area
          maskData.data[i] = 255;
          maskData.data[i + 1] = 255;
          maskData.data[i + 2] = 255;
          maskData.data[i + 3] = 255;
        } else {
          // Black for unmasked area
          maskData.data[i] = 0;
          maskData.data[i + 1] = 0;
          maskData.data[i + 2] = 0;
          maskData.data[i + 3] = 255;
        }
      }
      maskCtx.putImageData(maskData, 0, 0);
      onMaskChange(maskCanvas.toDataURL('image/png'));
    }
  };

  const handleClear = () => {
    draw();
    onMaskChange(null);
  };
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
        <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-full object-contain cursor-crosshair rounded-lg"
            onMouseDown={startDrawing}
            onMouseMove={drawOnCanvas}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={drawOnCanvas}
            onTouchEnd={stopDrawing}
          />
        </div>
        <button 
            onClick={handleClear} 
            className="absolute top-2 right-2 bg-gray-900/80 text-white text-xs px-3 py-1 rounded-full hover:bg-black transition-colors"
        >
            Clear Mask
        </button>
    </div>
  );
};
