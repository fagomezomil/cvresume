import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useCallback, useState, useRef } from "react";
import {
  PiX,
  PiLink,
  PiCalendar,
  PiFolderSimple,
  PiPlus,
  PiMinus,
  PiArrowCounterClockwise,
  PiCaretLeft,
  PiCaretRight,
  PiNote
} from "react-icons/pi";
import { useLanguage } from "../context/LanguageContext";
import { getWorkTranslation, translateCategory } from "../utils/translations";

export default function ModalWork({ item, onClose, filteredItems = [], currentIndex = 0, onPrev, onNext }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const { t, language } = useLanguage();

  // Navigation state
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < filteredItems.length - 1;

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft' && canGoPrev) onPrev();
    if (e.key === 'ArrowRight' && canGoNext) onNext();
  }, [onClose, onPrev, onNext, canGoPrev, canGoNext]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyDown]);

  // Reset image index, zoom and position when item changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  }, [item?.id]);

  // Zoom handlers
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) {
        setImagePosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  // Drag handlers for zoomed image
  const handleDragStart = (e) => {
    if (zoomLevel === 1) return;

    setIsDragging(true);
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    dragStart.current = {
      x: clientX - imagePosition.x,
      y: clientY - imagePosition.y
    };
  };

  const handleDragMove = useCallback((e) => {
    if (!isDragging || zoomLevel === 1) return;

    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

    const newX = clientX - dragStart.current.x;
    const newY = clientY - dragStart.current.y;

    // Calculate bounds based on zoom level
    const maxOffset = (zoomLevel - 1) * 200;

    setImagePosition({
      x: Math.max(-maxOffset, Math.min(maxOffset, newX)),
      y: Math.max(-maxOffset, Math.min(maxOffset, newY))
    });
  }, [isDragging, zoomLevel]);

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Mouse events
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('touchend', handleDragEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, handleDragMove]);

  // Wheel zoom
  const handleWheel = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      if (e.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    }
  }, []);

  if (!item) return null;

  // Filter out empty images
  const images = (item.img || []).filter(img => img && img.trim() !== '');
  const currentImage = images[currentImageIndex];

  // Get translated content
  const workName = getWorkTranslation(item, 'workName', language);
  const description = getWorkTranslation(item, 'description', language);
  const note = getWorkTranslation(item, 'nota', language);
  const category = translateCategory(item.type, language);

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
        style={{ zIndex: 50 }}
      />

      {/* Modal Container - Full viewport */}
      <div
        key="modal-container"
        className="fixed inset-0 flex overflow-y-auto lg:overflow-hidden"
        style={{ zIndex: 60 }}
        onClick={onClose}
      >
        {/* Navigation Button - Left */}
        {canGoPrev && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm shadow-lg text-white/80 hover:text-white transition-colors"
            aria-label="Previous"
          >
            <PiCaretLeft className="text-3xl" />
          </motion.button>
        )}

        {/* Navigation Button - Right */}
        {canGoNext && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm shadow-lg text-white/80 hover:text-white transition-colors"
            aria-label="Next"
          >
            <PiCaretRight className="text-3xl" />
          </motion.button>
        )}

        {/* Close Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm shadow-lg text-white/80 hover:text-white transition-colors"
          aria-label={t('modalWork.cerrar')}
        >
          <PiX className="text-2xl" />
        </motion.button>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">

          {/* MOBILE LAYOUT */}
          <div className="lg:hidden flex flex-col w-full" onClick={(e) => e.stopPropagation()}>
            {/* Header Info - Mobile */}
            <div className="p-4 pt-16 pb-2">
              {/* Title */}
              <h2 className="text-[28px] font-bold text-white">
                {workName}
              </h2>

              {/* Navigation Counter */}
              {filteredItems.length > 1 && (
                <p className="text-xs text-white/40 mt-1">
                  {currentIndex + 1} / {filteredItems.length}
                </p>
              )}

              {/* Client & Date */}
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-white/60">
                {item.client && (
                  <span className="font-medium text-accent-teal">
                    {item.client}
                  </span>
                )}
                {item.date && (
                  <span className="flex items-center gap-1">
                    <PiCalendar className="text-sm" />
                    {item.date}
                  </span>
                )}
              </div>

              {/* Category Badge */}
              {item.type && (
                <div className="mt-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent-teal/20 text-accent-teal rounded-full text-xs font-medium">
                    <PiFolderSimple className="text-xs" />
                    {category}
                  </span>
                </div>
              )}
            </div>

            {/* Main Image - Mobile */}
            <div
              className="flex items-center justify-center relative"
              onWheel={handleWheel}
            >
              <div className="px-4">
                <motion.img
                  ref={imageRef}
                  key={`${currentImageIndex}-${zoomLevel}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{
                    opacity: 1,
                    scale: zoomLevel,
                    x: imagePosition.x,
                    y: imagePosition.y
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  src={`/images/works/${currentImage}`}
                  alt={workName}
                  className={`max-w-full max-h-[45vh] object-contain select-none ${zoomLevel > 1 ? 'cursor-grab' : 'cursor-default'
                    } ${isDragging ? 'cursor-grabbing' : ''}`}
                  style={{ transformOrigin: 'center' }}
                  onMouseDown={handleDragStart}
                  onTouchStart={handleDragStart}
                  draggable={false}
                />
              </div>

              {/* Zoom Controls - Mobile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full p-1"
              >
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleZoomOut();
                  }}
                  disabled={zoomLevel === 1}
                  className={`p-2 rounded-full transition-colors ${zoomLevel === 1 ? 'text-white/30 cursor-not-allowed' : 'text-white/80 hover:bg-white/10'}`}
                  aria-label="Zoom out"
                >
                  <PiMinus className="text-base" />
                </motion.button>

                <span className="text-xs font-medium text-white/80 px-2 min-w-[2.5rem] text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleZoomIn();
                  }}
                  disabled={zoomLevel === 3}
                  className={`p-2 rounded-full transition-colors ${zoomLevel === 3 ? 'text-white/30 cursor-not-allowed' : 'text-white/80 hover:bg-white/10'}`}
                  aria-label="Zoom in"
                >
                  <PiPlus className="text-base" />
                </motion.button>

                {zoomLevel > 1 && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleZoomReset();
                    }}
                    className="p-2 rounded-full text-white/80 hover:bg-white/10 transition-colors"
                    aria-label="Reset zoom"
                  >
                    <PiArrowCounterClockwise className="text-base" />
                  </motion.button>
                )}
              </motion.div>
            </div>

            {/* Image Gallery - Mobile (below main image) */}
            {images.length > 1 && (
              <div className="px-4 py-3">
                <p className="text-xs text-white/40 mb-2">
                  {t('modalWork.galeria')} ({images.length} {t('modalWork.imagenes')})
                </p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <motion.button
                      key={index}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setZoomLevel(1);
                        setImagePosition({ x: 0, y: 0 });
                      }}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${currentImageIndex === index
                        ? 'border-accent-teal ring-2 ring-accent-teal/30'
                        : 'border-white/10 hover:border-white/30'
                        }`}
                    >
                      <img
                        src={`/images/works/${img}`}
                        alt={`${workName} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Description & Info - Mobile */}
            <div className="p-4 pt-2 pb-8">
              {/* Description */}
              <p className="text-white/70 text-sm leading-relaxed">
                {description}
              </p>

              {/* Note */}
              {note && (
                <div className="flex items-start gap-2 mt-4 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <PiNote className="text-amber-400 text-lg flex-shrink-0 mt-0.5" />
                  <p className="text-xs italic text-amber-200 leading-relaxed">
                    {note}
                  </p>
                </div>
              )}

              {/* Link */}
              {item.url && (
                <motion.a
                  whileTap={{ scale: 0.98 }}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 bg-accent-teal text-white rounded-xl hover:bg-accent-teal-dark transition-colors font-medium text-sm"
                >
                  <PiLink className="text-lg" />
                  {t('modalWork.verProyecto')}
                </motion.a>
              )}
            </div>
          </div>

          {/* DESKTOP LAYOUT */}
          {/* Image Area - Only on desktop */}
          <div
            className="hidden lg:flex flex-1 lg:flex-[1.5] items-center justify-center p-8 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
          >
            <motion.img
              ref={imageRef}
              key={`${currentImageIndex}-${zoomLevel}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: 1,
                scale: zoomLevel,
                x: imagePosition.x,
                y: imagePosition.y
              }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              src={`/images/works/${currentImage}`}
              alt={workName}
              className={`max-w-full max-h-[85vh] object-contain select-none ${zoomLevel > 1 ? 'cursor-grab' : 'cursor-default'
                } ${isDragging ? 'cursor-grabbing' : ''}`}
              style={{ transformOrigin: 'center' }}
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
              draggable={false}
            />

            {/* Zoom Controls - Desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full p-1"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomOut();
                }}
                disabled={zoomLevel === 1}
                className={`p-2.5 rounded-full transition-colors ${zoomLevel === 1 ? 'text-white/30 cursor-not-allowed' : 'text-white/80 hover:bg-white/10'}`}
                aria-label="Zoom out"
              >
                <PiMinus className="text-lg" />
              </motion.button>

              <span className="text-xs font-medium text-white/80 px-2 min-w-[3rem] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomIn();
                }}
                disabled={zoomLevel === 3}
                className={`p-2.5 rounded-full transition-colors ${zoomLevel === 3 ? 'text-white/30 cursor-not-allowed' : 'text-white/80 hover:bg-white/10'}`}
                aria-label="Zoom in"
              >
                <PiPlus className="text-lg" />
              </motion.button>

              {zoomLevel > 1 && (
                <motion.button
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleZoomReset();
                  }}
                  className="p-2.5 rounded-full text-white/80 hover:bg-white/10 transition-colors"
                  aria-label="Reset zoom"
                >
                  <PiArrowCounterClockwise className="text-lg" />
                </motion.button>
              )}
            </motion.div>

            {/* Drag hint when zoomed */}
            {zoomLevel > 1 && !isDragging && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 text-xs text-white/40"
              >
                Arrastra para mover la imagen
              </motion.p>
            )}
          </div>

          {/* Info Panel - Desktop only */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="hidden lg:block lg:w-[320px] xl:w-[380px] bg-neutral-900/95 backdrop-blur-sm p-8 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Category Badge */}
            {item.type && (
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-teal/20 text-accent-teal rounded-full text-sm font-medium">
                  <PiFolderSimple className="text-base" />
                  {category}
                </span>
              </div>
            )}

            {/* Title */}
            <h2 className="text-2xl lg:text-3xl font-bold text-white">
              {workName}
            </h2>

            {/* Navigation Counter */}
            {filteredItems.length > 1 && (
              <p className="text-xs text-white/40 mt-2">
                {currentIndex + 1} / {filteredItems.length}
              </p>
            )}

            {/* Client & Date */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-white/60">
              {item.client && (
                <span className="font-medium text-accent-teal">
                  {item.client}
                </span>
              )}
              {item.date && (
                <span className="flex items-center gap-1">
                  <PiCalendar className="text-base" />
                  {item.date}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-white/70 mt-5 leading-relaxed">
              {description}
            </p>

            {/* Note */}
            {note && (
              <div className="flex items-start gap-2 mt-4 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <PiNote className="text-amber-400 text-lg flex-shrink-0 mt-0.5" />
                <p className="text-xs italic text-amber-200 leading-relaxed">
                  {note}
                </p>
              </div>
            )}

            {/* Link */}
            {item.url && (
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 px-5 py-3 bg-accent-teal text-white rounded-xl hover:bg-accent-teal-dark transition-colors font-medium"
              >
                <PiLink className="text-xl" />
                {t('modalWork.verProyecto')}
              </motion.a>
            )}

            {/* Image Gallery */}
            {images.length > 1 && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-white/40 mb-3">
                  {t('modalWork.galeria')} ({images.length} {t('modalWork.imagenes')})
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setZoomLevel(1);
                        setImagePosition({ x: 0, y: 0 });
                      }}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${currentImageIndex === index
                        ? 'border-accent-teal ring-2 ring-accent-teal/30'
                        : 'border-white/10 hover:border-white/30'
                        }`}
                    >
                      <img
                        src={`/images/works/${img}`}
                        alt={`${workName} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}