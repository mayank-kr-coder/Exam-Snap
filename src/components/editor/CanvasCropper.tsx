import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CropRect } from '../../utils/imageProcessing';
import { RotateCw, ZoomIn, ZoomOut, Maximize2, UserCheck } from 'lucide-react';

interface CanvasCropperProps {
  image: HTMLImageElement;
  aspectRatio?: number; // e.g. 3.5 / 4.5 = 0.777
  lockAspect?: boolean;
  showFaceGuide?: boolean;
  onCropChange: (rect: CropRect) => void;
  minCropSize?: number;
}

export const CanvasCropper: React.FC<CanvasCropperProps> = ({
  image,
  aspectRatio,
  lockAspect = true,
  showFaceGuide = true,
  onCropChange,
  minCropSize = 40
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Crop box in natural image coordinates
  const [crop, setCrop] = useState<CropRect>({ x: 0, y: 0, width: 100, height: 100 });
  const [displayScale, setDisplayScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [showOval, setShowOval] = useState<boolean>(showFaceGuide);

  // Interaction dragging state
  const dragRef = useRef<{
    isDragging: boolean;
    dragType: 'move' | 'nw' | 'ne' | 'se' | 'sw' | 'n' | 'e' | 's' | 'w' | null;
    startX: number;
    startY: number;
    startCrop: CropRect;
  }>({
    isDragging: false,
    dragType: null,
    startX: 0,
    startY: 0,
    startCrop: { x: 0, y: 0, width: 0, height: 0 }
  });

  // Initialize crop centered in image with target aspect ratio
  useEffect(() => {
    if (!image) return;

    const imgW = image.naturalWidth || image.width;
    const imgH = image.naturalHeight || image.height;

    let targetW = imgW * 0.85;
    let targetH = imgH * 0.85;

    if (aspectRatio) {
      if (targetW / targetH > aspectRatio) {
        targetW = targetH * aspectRatio;
      } else {
        targetH = targetW / aspectRatio;
      }
    }

    const initialCrop: CropRect = {
      x: Math.max(0, Math.round((imgW - targetW) / 2)),
      y: Math.max(0, Math.round((imgH - targetH) / 2)),
      width: Math.round(targetW),
      height: Math.round(targetH)
    };

    setCrop(initialCrop);
    onCropChange(initialCrop);
  }, [image, aspectRatio]);

  // Render preview canvas and crop overlay
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const containerWidth = container.clientWidth || 360;
    const maxHeight = 460;

    const imgW = image.naturalWidth || image.width;
    const imgH = image.naturalHeight || image.height;

    // Calculate fit-to-container scale
    const scale = Math.min(containerWidth / imgW, maxHeight / imgH, 1);
    setDisplayScale(scale);

    const canvasW = Math.round(imgW * scale);
    const canvasH = Math.round(imgH * scale);

    canvas.width = canvasW;
    canvas.height = canvasH;

    // Clear
    ctx.clearRect(0, 0, canvasW, canvasH);

    // Draw base image scaled
    ctx.drawImage(image, 0, 0, canvasW, canvasH);

    // Darkened dimmed overlay outside crop box
    const cx = crop.x * scale;
    const cy = crop.y * scale;
    const cw = crop.width * scale;
    const ch = crop.height * scale;

    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.55)'; // subtle dimming
    ctx.beginPath();
    ctx.rect(0, 0, canvasW, canvasH);
    ctx.rect(cx + cw, cy, -cw, ch); // cut out inner crop box (counter-clockwise)
    ctx.fill();

    // Crop box border
    ctx.strokeStyle = '#FF9933'; // Saffron accent
    ctx.lineWidth = 2;
    ctx.strokeRect(cx, cy, cw, ch);

    // Rule of thirds subtle grid inside crop box
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);

    ctx.beginPath();
    // vertical lines
    ctx.moveTo(cx + cw / 3, cy);
    ctx.lineTo(cx + cw / 3, cy + ch);
    ctx.moveTo(cx + (2 * cw) / 3, cy);
    ctx.lineTo(cx + (2 * cw) / 3, cy + ch);
    // horizontal lines
    ctx.moveTo(cx, cy + ch / 3);
    ctx.lineTo(cx + cw, cy + ch / 3);
    ctx.moveTo(cx, cy + (2 * ch) / 3);
    ctx.lineTo(cx + cw, cy + (2 * ch) / 3);
    ctx.stroke();
    ctx.setLineDash([]);

    // Face oval guideline if enabled
    if (showOval) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      // Ellipse roughly where face should be
      const ovalCx = cx + cw / 2;
      const ovalCy = cy + ch * 0.44;
      const ovalRx = cw * 0.28;
      const ovalRy = ch * 0.34;
      ctx.ellipse(ovalCx, ovalCy, ovalRx, ovalRy, 0, 0, 2 * Math.PI);
      ctx.stroke();

      // Eye-level crosshair guideline
      ctx.strokeStyle = 'rgba(255, 153, 51, 0.6)';
      ctx.beginPath();
      ctx.moveTo(ovalCx - ovalRx * 0.6, ovalCy - ovalRy * 0.15);
      ctx.lineTo(ovalCx + ovalRx * 0.6, ovalCy - ovalRy * 0.15);
      ctx.stroke();
    }

    // Corner and edge handles
    const handleSize = 9;
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#14213D';
    ctx.lineWidth = 1.5;

    const handles = [
      { x: cx, y: cy },
      { x: cx + cw, y: cy },
      { x: cx + cw, y: cy + ch },
      { x: cx, y: cy + ch },
      { x: cx + cw / 2, y: cy },
      { x: cx + cw, y: cy + ch / 2 },
      { x: cx + cw / 2, y: cy + ch },
      { x: cx, y: cy + ch / 2 }
    ];

    handles.forEach((h) => {
      ctx.fillRect(h.x - handleSize / 2, h.y - handleSize / 2, handleSize, handleSize);
      ctx.strokeRect(h.x - handleSize / 2, h.y - handleSize / 2, handleSize, handleSize);
    });

    ctx.restore();
  }, [image, crop, showOval]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Pointer event handlers for touch and desktop mouse
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || displayScale <= 0) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / displayScale;
    const mouseY = (e.clientY - rect.top) / displayScale;

    // Check hit on corner or edge handles first
    const hitTolerance = 18 / displayScale;

    const { x, y, width: w, height: h } = crop;

    let dragType: typeof dragRef.current.dragType = null;

    if (Math.hypot(mouseX - x, mouseY - y) < hitTolerance) dragType = 'nw';
    else if (Math.hypot(mouseX - (x + w), mouseY - y) < hitTolerance) dragType = 'ne';
    else if (Math.hypot(mouseX - (x + w), mouseY - (y + h)) < hitTolerance) dragType = 'se';
    else if (Math.hypot(mouseX - x, mouseY - (y + h)) < hitTolerance) dragType = 'sw';
    else if (mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h) {
      dragType = 'move';
    }

    if (dragType) {
      dragRef.current = {
        isDragging: true,
        dragType,
        startX: mouseX,
        startY: mouseY,
        startCrop: { ...crop }
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current.isDragging || !image) return;

    const canvas = canvasRef.current;
    if (!canvas || displayScale <= 0) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = (e.clientX - rect.left) / displayScale;
    const currentY = (e.clientY - rect.top) / displayScale;

    const dx = currentX - dragRef.current.startX;
    const dy = currentY - dragRef.current.startY;
    const { startCrop, dragType } = dragRef.current;

    const imgW = image.naturalWidth || image.width;
    const imgH = image.naturalHeight || image.height;

    let newCrop = { ...startCrop };

    if (dragType === 'move') {
      newCrop.x = Math.max(0, Math.min(imgW - startCrop.width, startCrop.x + dx));
      newCrop.y = Math.max(0, Math.min(imgH - startCrop.height, startCrop.y + dy));
    } else if (dragType === 'se') {
      let newW = Math.max(minCropSize, startCrop.width + dx);
      let newH = Math.max(minCropSize, startCrop.height + dy);
      if (lockAspect && aspectRatio) {
        newH = newW / aspectRatio;
      }
      if (startCrop.x + newW > imgW) {
        newW = imgW - startCrop.x;
        if (lockAspect && aspectRatio) newH = newW / aspectRatio;
      }
      if (startCrop.y + newH > imgH) {
        newH = imgH - startCrop.y;
        if (lockAspect && aspectRatio) newW = newH * aspectRatio;
      }
      newCrop.width = Math.round(newW);
      newCrop.height = Math.round(newH);
    } else if (dragType === 'nw') {
      let newW = Math.max(minCropSize, startCrop.width - dx);
      let newH = Math.max(minCropSize, startCrop.height - dy);
      if (lockAspect && aspectRatio) {
        newH = newW / aspectRatio;
      }
      const newX = startCrop.x + (startCrop.width - newW);
      const newY = startCrop.y + (startCrop.height - newH);
      if (newX >= 0 && newY >= 0) {
        newCrop.x = Math.round(newX);
        newCrop.y = Math.round(newY);
        newCrop.width = Math.round(newW);
        newCrop.height = Math.round(newH);
      }
    } else if (dragType === 'ne') {
      let newW = Math.max(minCropSize, startCrop.width + dx);
      let newH = Math.max(minCropSize, startCrop.height - dy);
      if (lockAspect && aspectRatio) {
        newH = newW / aspectRatio;
      }
      const newY = startCrop.y + (startCrop.height - newH);
      if (startCrop.x + newW <= imgW && newY >= 0) {
        newCrop.y = Math.round(newY);
        newCrop.width = Math.round(newW);
        newCrop.height = Math.round(newH);
      }
    } else if (dragType === 'sw') {
      let newW = Math.max(minCropSize, startCrop.width - dx);
      let newH = Math.max(minCropSize, startCrop.height + dy);
      if (lockAspect && aspectRatio) {
        newH = newW / aspectRatio;
      }
      const newX = startCrop.x + (startCrop.width - newW);
      if (newX >= 0 && startCrop.y + newH <= imgH) {
        newCrop.x = Math.round(newX);
        newCrop.width = Math.round(newW);
        newCrop.height = Math.round(newH);
      }
    }

    setCrop(newCrop);
    onCropChange(newCrop);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    dragRef.current.isDragging = false;
    dragRef.current.dragType = null;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (e) {
      // ignore
    }
  };

  const resetCropToFull = () => {
    if (!image) return;
    const imgW = image.naturalWidth || image.width;
    const imgH = image.naturalHeight || image.height;
    let targetW = imgW;
    let targetH = imgH;
    if (aspectRatio) {
      if (targetW / targetH > aspectRatio) targetW = targetH * aspectRatio;
      else targetH = targetW / aspectRatio;
    }
    const fullCrop: CropRect = {
      x: Math.round((imgW - targetW) / 2),
      y: Math.round((imgH - targetH) / 2),
      width: Math.round(targetW),
      height: Math.round(targetH)
    };
    setCrop(fullCrop);
    onCropChange(fullCrop);
  };

  return (
    <div className="flex flex-col items-center w-full space-y-3">
      {/* Interactive Canvas Viewport */}
      <div
        ref={containerRef}
        className="w-full flex justify-center items-center bg-gray-950/80 rounded-2xl p-2 sm:p-4 border border-gray-200 overflow-hidden shadow-inner select-none relative"
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="touch-none cursor-move rounded-lg max-w-full"
          style={{ imageRendering: 'auto' }}
        />
      </div>

      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 w-full px-1 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <span className="font-mono bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">
            Crop: {crop.width} × {crop.height} px
          </span>
          {aspectRatio && (
            <span className="text-gray-500 font-medium hidden sm:inline">
              Locked ({aspectRatio.toFixed(2)} : 1)
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {showFaceGuide && (
            <button
              type="button"
              onClick={() => setShowOval(!showOval)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded border transition ${
                showOval
                  ? 'bg-saffron/10 border-saffron text-saffron-dark font-medium'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
              title="Toggle Face & Eye Alignment Oval"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Face Guide</span>
            </button>
          )}

          <button
            type="button"
            onClick={resetCropToFull}
            className="flex items-center gap-1 px-2.5 py-1 rounded border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition"
            title="Reset crop to center"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
