import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CropRect } from '../../utils/imageProcessing';
import { RotateCw, Maximize2, UserCheck, Lock, Unlock, ArrowLeftRight, ZoomIn, ZoomOut } from 'lucide-react';

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
  lockAspect = false,
  showFaceGuide = false,
  onCropChange,
  minCropSize = 30
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Crop box in natural image coordinates
  const [crop, setCrop] = useState<CropRect>({ x: 0, y: 0, width: 100, height: 100 });
  const [displayScale, setDisplayScale] = useState<number>(1);
  const [showOval, setShowOval] = useState<boolean>(showFaceGuide);
  const [isLocked, setIsLocked] = useState<boolean>(lockAspect);
  const [cursorStyle, setCursorStyle] = useState<string>('default');

  // Sync external lockAspect prop when changed
  useEffect(() => {
    setIsLocked(lockAspect);
  }, [lockAspect]);

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

  // Touch and pinch tracking state
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStartDistRef = useRef<number | null>(null);
  const pinchStartCropRef = useRef<CropRect | null>(null);

  // Initialize crop centered in image
  useEffect(() => {
    if (!image) return;

    const imgW = image.naturalWidth || image.width;
    const imgH = image.naturalHeight || image.height;

    let targetW = imgW * 0.9;
    let targetH = imgH * 0.85;

    if (isLocked && aspectRatio) {
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
  }, [image]);

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
    ctx.fillStyle = 'rgba(15, 23, 42, 0.60)'; // dimming
    ctx.beginPath();
    ctx.rect(0, 0, canvasW, canvasH);
    ctx.rect(cx + cw, cy, -cw, ch); // cut out inner crop box (counter-clockwise)
    ctx.fill();

    // Crop box border
    ctx.strokeStyle = '#FF9933'; // Saffron accent
    ctx.lineWidth = 2.5;
    ctx.strokeRect(cx, cy, cw, ch);

    // Rule of thirds subtle grid inside crop box
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.40)';
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
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const ovalCx = cx + cw / 2;
      const ovalCy = cy + ch * 0.44;
      const ovalRx = cw * 0.28;
      const ovalRy = ch * 0.34;
      ctx.ellipse(ovalCx, ovalCy, ovalRx, ovalRy, 0, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 153, 51, 0.7)';
      ctx.beginPath();
      ctx.moveTo(ovalCx - ovalRx * 0.6, ovalCy - ovalRy * 0.15);
      ctx.lineTo(ovalCx + ovalRx * 0.6, ovalCy - ovalRy * 0.15);
      ctx.stroke();
    }

    // Corner handles (Squares)
    const cornerSize = 11;
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#14213D';
    ctx.lineWidth = 2;

    const corners = [
      { x: cx, y: cy },
      { x: cx + cw, y: cy },
      { x: cx + cw, y: cy + ch },
      { x: cx, y: cy + ch }
    ];

    corners.forEach((h) => {
      ctx.fillRect(h.x - cornerSize / 2, h.y - cornerSize / 2, cornerSize, cornerSize);
      ctx.strokeRect(h.x - cornerSize / 2, h.y - cornerSize / 2, cornerSize, cornerSize);
    });

    // Side handles (Pill shapes specially styled for easy drag/stretch)
    // Left (W) and Right (E) side handles: Vertical pill for width stretching
    const sidePillW = 8;
    const sidePillH = 22;

    // Right handle (East)
    ctx.fillStyle = '#FF9933';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(cx + cw - sidePillW / 2, cy + ch / 2 - sidePillH / 2, sidePillW, sidePillH, 4);
    ctx.fill();
    ctx.stroke();

    // Left handle (West)
    ctx.beginPath();
    ctx.roundRect(cx - sidePillW / 2, cy + ch / 2 - sidePillH / 2, sidePillW, sidePillH, 4);
    ctx.fill();
    ctx.stroke();

    // Top (N) and Bottom (S) handles: Horizontal pill for height stretching
    const topPillW = 22;
    const topPillH = 8;

    // Top handle (North)
    ctx.beginPath();
    ctx.roundRect(cx + cw / 2 - topPillW / 2, cy - topPillH / 2, topPillW, topPillH, 4);
    ctx.fill();
    ctx.stroke();

    // Bottom handle (South)
    ctx.beginPath();
    ctx.roundRect(cx + cw / 2 - topPillW / 2, cy + ch - topPillH / 2, topPillW, topPillH, 4);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }, [image, crop, showOval]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Helper to determine which handle or region is at mouse (x, y)
  const getHandleAt = (mouseX: number, mouseY: number) => {
    const { x, y, width: w, height: h } = crop;
    // Generous hit tolerance so touch and mouse are very easy to grab
    const hitTol = Math.max(22, 22 / (displayScale || 1));

    if (Math.hypot(mouseX - x, mouseY - y) < hitTol) return 'nw';
    if (Math.hypot(mouseX - (x + w), mouseY - y) < hitTol) return 'ne';
    if (Math.hypot(mouseX - (x + w), mouseY - (y + h)) < hitTol) return 'se';
    if (Math.hypot(mouseX - x, mouseY - (y + h)) < hitTol) return 'sw';

    // Width drag handles (East and West)
    if (Math.hypot(mouseX - (x + w), mouseY - (y + h / 2)) < hitTol) return 'e';
    if (Math.hypot(mouseX - x, mouseY - (y + h / 2)) < hitTol) return 'w';

    // Height drag handles (North and South)
    if (Math.hypot(mouseX - (x + w / 2), mouseY - y) < hitTol) return 'n';
    if (Math.hypot(mouseX - (x + w / 2), mouseY - (y + h)) < hitTol) return 's';

    // Inside box -> move
    if (mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h) {
      return 'move';
    }

    return null;
  };

  // Hover cursor updates
  const handlePointerHover = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragRef.current.isDragging || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / displayScale;
    const mouseY = (e.clientY - rect.top) / displayScale;

    const handle = getHandleAt(mouseX, mouseY);
    if (handle === 'e' || handle === 'w') setCursorStyle('ew-resize');
    else if (handle === 'n' || handle === 's') setCursorStyle('ns-resize');
    else if (handle === 'nw' || handle === 'se') setCursorStyle('nwse-resize');
    else if (handle === 'ne' || handle === 'sw') setCursorStyle('nesw-resize');
    else if (handle === 'move') setCursorStyle('move');
    else setCursorStyle('default');
  };

  // Pointer Down
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || displayScale <= 0) return;

    // Track active touch pointer
    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // Handle two-finger pinch gesture
    if (activePointersRef.current.size === 2) {
      const pts = Array.from(activePointersRef.current.values());
      pinchStartDistRef.current = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      pinchStartCropRef.current = { ...crop };
      dragRef.current.isDragging = false;
      dragRef.current.dragType = null;
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / displayScale;
    const mouseY = (e.clientY - rect.top) / displayScale;

    const dragType = getHandleAt(mouseX, mouseY);

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

  // Pointer Move (Dragging & Pinch-to-zoom)
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // 1. Two-finger pinch-to-zoom processing
    if (activePointersRef.current.size >= 2 && pinchStartDistRef.current && pinchStartCropRef.current && image) {
      const pts = Array.from(activePointersRef.current.values());
      const currentDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const zoomRatio = currentDist / Math.max(10, pinchStartDistRef.current);

      const imgW = image.naturalWidth || image.width;
      const imgH = image.naturalHeight || image.height;
      const startCrop = pinchStartCropRef.current;

      let newW = startCrop.width / zoomRatio;
      let newH = isLocked && aspectRatio ? newW / aspectRatio : startCrop.height / zoomRatio;

      newW = Math.max(minCropSize, Math.min(imgW, newW));
      newH = Math.max(minCropSize, Math.min(imgH, newH));

      const centerX = startCrop.x + startCrop.width / 2;
      const centerY = startCrop.y + startCrop.height / 2;
      const newX = Math.max(0, Math.min(imgW - newW, Math.round(centerX - newW / 2)));
      const newY = Math.max(0, Math.min(imgH - newH, Math.round(centerY - newH / 2)));

      const pinchCrop: CropRect = {
        x: newX,
        y: newY,
        width: Math.round(newW),
        height: Math.round(newH)
      };
      setCrop(pinchCrop);
      onCropChange(pinchCrop);
      return;
    }

    if (!dragRef.current.isDragging || !image) {
      handlePointerHover(e);
      return;
    }

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
    } 
    // East handle -> stretch width to the right (khinch ke bada karna)
    else if (dragType === 'e') {
      const maxW = imgW - startCrop.x;
      const newW = Math.max(minCropSize, Math.min(maxW, startCrop.width + dx));
      newCrop.width = Math.round(newW);
      if (isLocked && aspectRatio) {
        const newH = Math.min(imgH, newW / aspectRatio);
        newCrop.height = Math.round(newH);
        newCrop.y = Math.max(0, Math.min(imgH - newCrop.height, Math.round(startCrop.y - (newH - startCrop.height) / 2)));
      }
    } 
    // West handle -> stretch width to the left
    else if (dragType === 'w') {
      const maxDx = startCrop.width - minCropSize;
      const clampedDx = Math.max(-startCrop.x, Math.min(maxDx, dx));
      newCrop.x = Math.round(startCrop.x + clampedDx);
      newCrop.width = Math.round(startCrop.width - clampedDx);
      if (isLocked && aspectRatio) {
        const newH = Math.min(imgH, newCrop.width / aspectRatio);
        newCrop.height = Math.round(newH);
        newCrop.y = Math.max(0, Math.min(imgH - newCrop.height, Math.round(startCrop.y - (newH - startCrop.height) / 2)));
      }
    } 
    // South handle -> stretch height down
    else if (dragType === 's') {
      const maxH = imgH - startCrop.y;
      const newH = Math.max(minCropSize, Math.min(maxH, startCrop.height + dy));
      newCrop.height = Math.round(newH);
      if (isLocked && aspectRatio) {
        const newW = Math.min(imgW, newH * aspectRatio);
        newCrop.width = Math.round(newW);
        newCrop.x = Math.max(0, Math.min(imgW - newCrop.width, Math.round(startCrop.x - (newW - startCrop.width) / 2)));
      }
    } 
    // North handle -> stretch height up
    else if (dragType === 'n') {
      const maxDy = startCrop.height - minCropSize;
      const clampedDy = Math.max(-startCrop.y, Math.min(maxDy, dy));
      newCrop.y = Math.round(startCrop.y + clampedDy);
      newCrop.height = Math.round(startCrop.height - clampedDy);
      if (isLocked && aspectRatio) {
        const newW = Math.min(imgW, newCrop.height * aspectRatio);
        newCrop.width = Math.round(newW);
        newCrop.x = Math.max(0, Math.min(imgW - newCrop.width, Math.round(startCrop.x - (newW - startCrop.width) / 2)));
      }
    } 
    // Corner handles
    else if (dragType === 'se') {
      let newW = Math.max(minCropSize, Math.min(imgW - startCrop.x, startCrop.width + dx));
      let newH = Math.max(minCropSize, Math.min(imgH - startCrop.y, startCrop.height + dy));
      if (isLocked && aspectRatio) {
        newH = newW / aspectRatio;
        if (startCrop.y + newH > imgH) {
          newH = imgH - startCrop.y;
          newW = newH * aspectRatio;
        }
      }
      newCrop.width = Math.round(newW);
      newCrop.height = Math.round(newH);
    } 
    else if (dragType === 'sw') {
      const maxDx = startCrop.width - minCropSize;
      const clampedDx = Math.max(-startCrop.x, Math.min(maxDx, dx));
      let newW = startCrop.width - clampedDx;
      let newH = Math.max(minCropSize, Math.min(imgH - startCrop.y, startCrop.height + dy));
      if (isLocked && aspectRatio) {
        newH = newW / aspectRatio;
        if (startCrop.y + newH > imgH) {
          newH = imgH - startCrop.y;
          newW = newH * aspectRatio;
        }
      }
      newCrop.x = Math.round(startCrop.x + startCrop.width - newW);
      newCrop.width = Math.round(newW);
      newCrop.height = Math.round(newH);
    } 
    else if (dragType === 'ne') {
      let newW = Math.max(minCropSize, Math.min(imgW - startCrop.x, startCrop.width + dx));
      const maxDy = startCrop.height - minCropSize;
      const clampedDy = Math.max(-startCrop.y, Math.min(maxDy, dy));
      let newH = startCrop.height - clampedDy;
      if (isLocked && aspectRatio) {
        newH = newW / aspectRatio;
        if (startCrop.y + startCrop.height - newH < 0) {
          newH = startCrop.y + startCrop.height;
          newW = newH * aspectRatio;
        }
      }
      newCrop.y = Math.round(startCrop.y + startCrop.height - newH);
      newCrop.width = Math.round(newW);
      newCrop.height = Math.round(newH);
    } 
    else if (dragType === 'nw') {
      const maxDx = startCrop.width - minCropSize;
      const clampedDx = Math.max(-startCrop.x, Math.min(maxDx, dx));
      let newW = startCrop.width - clampedDx;
      const maxDy = startCrop.height - minCropSize;
      const clampedDy = Math.max(-startCrop.y, Math.min(maxDy, dy));
      let newH = startCrop.height - clampedDy;
      if (isLocked && aspectRatio) {
        newH = newW / aspectRatio;
        if (startCrop.y + startCrop.height - newH < 0) {
          newH = startCrop.y + startCrop.height;
          newW = newH * aspectRatio;
        }
      }
      newCrop.x = Math.round(startCrop.x + startCrop.width - newW);
      newCrop.y = Math.round(startCrop.y + startCrop.height - newH);
      newCrop.width = Math.round(newW);
      newCrop.height = Math.round(newH);
    }

    setCrop(newCrop);
    onCropChange(newCrop);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    activePointersRef.current.delete(e.pointerId);
    if (activePointersRef.current.size < 2) {
      pinchStartDistRef.current = null;
      pinchStartCropRef.current = null;
    }
    dragRef.current.isDragging = false;
    dragRef.current.dragType = null;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Smooth Zoom In / Zoom Out step
  const handleZoomStep = (factor: number) => {
    if (!image) return;
    const imgW = image.naturalWidth || image.width;
    const imgH = image.naturalHeight || image.height;
    const currentCrop = crop;

    let newW = Math.max(minCropSize, Math.min(imgW, currentCrop.width * factor));
    let newH = isLocked && aspectRatio ? newW / aspectRatio : Math.max(minCropSize, Math.min(imgH, currentCrop.height * factor));
    if (newH > imgH) {
      newH = imgH;
      if (isLocked && aspectRatio) newW = newH * aspectRatio;
    }

    const centerX = currentCrop.x + currentCrop.width / 2;
    const centerY = currentCrop.y + currentCrop.height / 2;
    const newX = Math.max(0, Math.min(imgW - newW, Math.round(centerX - newW / 2)));
    const newY = Math.max(0, Math.min(imgH - newH, Math.round(centerY - newH / 2)));

    const updated: CropRect = {
      x: newX,
      y: newY,
      width: Math.round(newW),
      height: Math.round(newH)
    };
    setCrop(updated);
    onCropChange(updated);
  };

  // 1-Click Stretch to Full Width
  const stretchToFullWidth = () => {
    if (!image) return;
    const imgW = image.naturalWidth || image.width;
    const fullWidthCrop: CropRect = {
      x: 0,
      y: crop.y,
      width: imgW,
      height: crop.height
    };
    setCrop(fullWidthCrop);
    onCropChange(fullWidthCrop);
  };

  // Reset to full image
  const resetCropToFull = () => {
    if (!image) return;
    const imgW = image.naturalWidth || image.width;
    const imgH = image.naturalHeight || image.height;
    const fullCrop: CropRect = {
      x: 0,
      y: 0,
      width: imgW,
      height: imgH
    };
    setCrop(fullCrop);
    onCropChange(fullCrop);
  };

  return (
    <div className="flex flex-col items-center w-full space-y-2.5">
      {/* Interactive Canvas Viewport */}
      <div
        ref={containerRef}
        className="w-full flex justify-center items-center bg-gray-950/85 rounded-2xl p-2 sm:p-4 border border-gray-200 overflow-hidden shadow-inner select-none relative"
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="touch-none rounded-lg max-w-full"
          style={{ cursor: cursorStyle, imageRendering: 'auto' }}
        />
      </div>

      {/* Helper guidance note */}
      <div className="w-full text-center">
        <p className="text-[11px] text-gray-500 font-medium">
          💡 <span className="font-semibold text-navy">Width bada karne ke liye:</span> Orange side handles (↔) ko pakad kar right/left kheenche, ya neeche <span className="text-saffron-dark font-semibold">"↔ Full Width"</span> button dabayein.
        </p>
      </div>

      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 w-full px-1 text-xs text-gray-600">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono bg-white px-2 py-1 rounded border border-gray-200 shadow-xs font-semibold text-navy">
            Crop: {crop.width} × {crop.height} px
          </span>

          {/* 1-Click Stretch Width Button */}
          <button
            type="button"
            onClick={stretchToFullWidth}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-saffron/40 bg-saffron/15 hover:bg-saffron/25 text-navy font-bold transition active:scale-95"
            title="Stretch crop box to full image width"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-saffron-dark" />
            <span>↔ Full Width (Poora Kheechein)</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Lock / Unlock ratio toggle */}
          <button
            type="button"
            onClick={() => setIsLocked(!isLocked)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition ${
              isLocked
                ? 'bg-navy/10 border-navy/30 text-navy font-bold'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            title="Toggle aspect ratio lock"
          >
            {isLocked ? (
              <>
                <Lock className="w-3.5 h-3.5 text-navy" />
                <span>Locked Ratio</span>
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5 text-gray-500" />
                <span>Free Width & Height</span>
              </>
            )}
          </button>

          {showFaceGuide && (
            <button
              type="button"
              onClick={() => setShowOval(!showOval)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition ${
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

          {/* Zoom In & Out Controls */}
          <div className="flex items-center gap-0.5 border border-gray-200 rounded-lg p-0.5 bg-white shadow-xs">
            <button
              type="button"
              onClick={() => handleZoomStep(0.9)}
              className="p-1 hover:bg-gray-100 rounded text-gray-700 transition"
              title="Zoom In (Crop closer)"
              aria-label="Zoom in crop"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleZoomStep(1.1)}
              className="p-1 hover:bg-gray-100 rounded text-gray-700 transition"
              title="Zoom Out (Show more image)"
              aria-label="Zoom out crop"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={resetCropToFull}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition"
            title="Reset crop to entire image"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Fit All</span>
          </button>
        </div>
      </div>
    </div>
  );
};
