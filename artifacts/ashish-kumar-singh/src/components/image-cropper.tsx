import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Minus, Plus, Move } from 'lucide-react';

interface ImageCropperProps {
  imageSrc: string;
  aspectRatio: number; // width / height
  onCropComplete: (croppedFile: File) => void;
  onCancel: () => void;
  fileName?: string;
}

export function ImageCropper({
  imageSrc,
  aspectRatio,
  onCropComplete,
  onCancel,
  fileName = 'cropped-image.png',
}: ImageCropperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Load image
  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      imgRef.current = img;
      setImageSize({ width: img.width, height: img.height });
      // Reset state
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    };
  }, [imageSrc]);

  // Compute crop box dimensions based on container
  const cropBox = (() => {
    if (!containerRef.current) return { width: 300, height: 300 / aspectRatio };
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    const maxCropWidth = containerWidth * 0.8;
    const maxCropHeight = containerHeight * 0.7;

    let width = maxCropWidth;
    let height = width / aspectRatio;

    if (height > maxCropHeight) {
      height = maxCropHeight;
      width = height * aspectRatio;
    }

    return { width, height };
  })();

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - offset.x,
      y: e.touches[0].clientY - offset.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  // Apply cropping and output a file
  const handleCrop = () => {
    const img = imgRef.current;
    if (!img || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to crop size
    const targetWidth = cropBox.width * 2; // High-res output
    const targetHeight = cropBox.height * 2;
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, targetWidth, targetHeight);

    // Calculate scaling factors between screen elements and original image
    const container = containerRef.current;
    if (!container) return;

    // Fit image inside container for display calculations
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    const scaleX = containerWidth / img.width;
    const scaleY = containerHeight / img.height;
    const baseScale = Math.min(scaleX, scaleY);

    const displayedImgWidth = img.width * baseScale;
    const displayedImgHeight = img.height * baseScale;

    // Display position of the image center on screen relative to container center
    const displayedCenterX = containerWidth / 2 + offset.x;
    const displayedCenterY = containerHeight / 2 + offset.y;

    // Center of crop box is always center of container
    const cropCenterX = containerWidth / 2;
    const cropCenterY = containerHeight / 2;

    // Calculate crop origin in displayed image coordinate system
    // Displayed top-left of the image:
    const displayedImgLeft = displayedCenterX - (displayedImgWidth * zoom) / 2;
    const displayedImgTop = displayedCenterY - (displayedImgHeight * zoom) / 2;

    // Crop box top-left:
    const cropLeft = cropCenterX - cropBox.width / 2;
    const cropTop = cropCenterY - cropBox.height / 2;

    // Relative crop offset in the displayed image coordinates
    const relCropX = (cropLeft - displayedImgLeft) / (baseScale * zoom);
    const relCropY = (cropTop - displayedImgTop) / (baseScale * zoom);

    const cropSrcWidth = cropBox.width / (baseScale * zoom);
    const cropSrcHeight = cropBox.height / (baseScale * zoom);

    ctx.drawImage(
      img,
      relCropX,
      relCropY,
      cropSrcWidth,
      cropSrcHeight,
      0,
      0,
      targetWidth,
      targetHeight
    );

    // Convert canvas to Blob/File
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], fileName, { type: 'image/png' });
        onCropComplete(file);
      }
    }, 'image/png', 0.95);
  };

  // Render overlay with dimmed borders outside crop area
  const renderOverlayPath = () => {
    if (!containerRef.current) return '';
    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight;
    const boxW = cropBox.width;
    const boxH = cropBox.height;

    const left = (w - boxW) / 2;
    const top = (h - boxH) / 2;

    // Path representing outside container with cut-out in center
    return `M 0 0 H ${w} V ${h} H 0 Z M ${left} ${top} V ${top + boxH} H ${left + boxW} V ${top} Z`;
  };

  // Center image size for background calculations
  const getTransformStyle = () => {
    return {
      transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
      transition: isDragging ? 'none' : 'transform 0.1s ease-out',
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in font-hindi">
      <div className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-gray-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800">फोटो क्रॉप करें (Crop Image)</h3>
          <span className="text-xs text-gray-500 bg-gray-200/60 px-3 py-1 rounded-full font-medium">
            अपेक्षित आकार: {aspectRatio === 1 ? '1:1 (वर्ग)' : '4:5 (खड़ा)'}
          </span>
        </div>

        {/* Workspace */}
        <div 
          ref={containerRef}
          className="relative w-full h-[320px] bg-gray-900 overflow-hidden cursor-move touch-none flex items-center justify-center"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {imageSrc && (
            <img
              src={imageSrc}
              alt="Source"
              style={getTransformStyle()}
              className="max-w-full max-h-full object-contain pointer-events-none select-none"
            />
          )}

          {/* Mask Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path d={renderOverlayPath()} fill="rgba(0, 0, 0, 0.6)" fillRule="evenodd" />
            <rect
              x={(containerRef.current?.clientWidth || 0 - cropBox.width) / 2}
              y={(containerRef.current?.clientHeight || 0 - cropBox.height) / 2}
              width={cropBox.width}
              height={cropBox.height}
              fill="none"
              stroke="#F97316"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>
          
          <div className="absolute top-3 left-3 bg-black/60 text-white rounded-full p-2 text-xs flex items-center gap-1.5 backdrop-blur-sm pointer-events-none">
            <Move size={14} />
            <span>खिसकाने के लिए ड्रैग करें</span>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-t bg-gray-50/50 space-y-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border-gray-300"
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
            >
              <Minus className="h-4 w-4 text-gray-600" />
            </Button>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-orange-500 h-1.5 bg-gray-200 rounded-lg cursor-pointer"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border-gray-300"
              onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
            >
              <Plus className="h-4 w-4 text-gray-600" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              className="flex-1 rounded-full text-gray-700 py-5 border-gray-300"
              onClick={onCancel}
            >
              रद्द करें (Cancel)
            </Button>
            <Button 
              className="flex-1 rounded-full bg-orange-500 hover:bg-orange-600 text-white py-5 shadow-lg shadow-orange-500/20"
              onClick={handleCrop}
            >
              क्रॉप और अपलोड (Crop)
            </Button>
          </div>
        </div>

        {/* Hidden Canvas */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
