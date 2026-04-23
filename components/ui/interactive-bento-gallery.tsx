'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export interface BentoMediaItem {
  desc: string;
  id: number;
  mediaClassName?: string;
  span: string;
  title: string;
  type: 'image' | 'video';
  url: string;
}

interface MediaItemProps {
  className?: string;
  item: BentoMediaItem;
  onClick?: () => void;
}

function MediaItem({ item, className = '', onClick }: MediaItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isBuffering, setIsBuffering] = useState(item.type === 'video');
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (item.type !== 'video' || !videoRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setIsInView(entry.isIntersecting));
      },
      {
        root: null,
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    observer.observe(videoRef.current);

    return () => {
      observer.disconnect();
    };
  }, [item.type]);

  useEffect(() => {
    if (item.type !== 'video' || !videoRef.current) {
      return;
    }

    const video = videoRef.current;
    let isMounted = true;

    const playVideo = async () => {
      try {
        if (video.readyState < 3) {
          setIsBuffering(true);
          await new Promise<void>((resolve) => {
            const handleCanPlay = () => {
              video.removeEventListener('canplay', handleCanPlay);
              resolve();
            };

            video.addEventListener('canplay', handleCanPlay, { once: true });
          });
        }

        if (!isMounted) {
          return;
        }

        setIsBuffering(false);
        await video.play();
      } catch (error) {
        console.warn('Video playback failed:', error);
      }
    };

    if (isInView) {
      void playVideo();
    } else {
      video.pause();
    }

    return () => {
      isMounted = false;
      video.pause();
    };
  }, [isInView, item.type]);

  if (item.type === 'video') {
    return (
      <div className={`${className} relative overflow-hidden`}>
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          onClick={onClick}
          playsInline
          muted
          loop
          preload="auto"
          style={{
            opacity: isBuffering ? 0.82 : 1,
            transition: 'opacity 0.2s',
            transform: 'translateZ(0)',
            willChange: 'transform',
          }}
        >
          <source src={item.url} type="video/mp4" />
        </video>
        {isBuffering ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <img
      src={item.url}
      alt={item.title}
      className={`cursor-pointer object-cover ${className} ${item.mediaClassName ?? ''}`}
      onClick={onClick}
      loading="lazy"
      decoding="async"
    />
  );
}

interface GalleryModalProps {
  isOpen: boolean;
  mediaItems: BentoMediaItem[];
  onClose: () => void;
  selectedItem: BentoMediaItem;
  setSelectedItem: (item: BentoMediaItem | null) => void;
}

function GalleryModal({
  isOpen,
  mediaItems,
  onClose,
  selectedItem,
  setSelectedItem,
}: GalleryModalProps) {
  const [dockPosition, setDockPosition] = useState({ x: 0, y: 0 });

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="fixed inset-0 z-[80] flex min-h-screen w-full items-center justify-center bg-black/70 p-4 backdrop-blur-lg"
      >
        <div className="flex h-full w-full max-w-6xl flex-col">
          <div className="flex-1 p-2 sm:p-3 md:p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedItem.id}
                className="relative mx-auto aspect-[16/9] h-auto max-h-[72vh] w-full max-w-[95%] overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-2xl sm:max-w-[88%] md:max-w-4xl"
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                    mass: 0.5,
                  },
                }}
                exit={{
                  opacity: 0,
                  y: 20,
                  scale: 0.97,
                  transition: { duration: 0.15 },
                }}
              >
                <MediaItem
                  item={selectedItem}
                  className="h-full w-full bg-black/20 object-contain"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 sm:p-5">
                  <h3 className="text-base font-semibold text-white sm:text-lg md:text-xl">
                    {selectedItem.title}
                  </h3>
                  <p className="mt-1 text-xs text-white/80 sm:text-sm">
                    {selectedItem.desc}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <motion.button
          className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/60 p-2 text-white/80 backdrop-blur-sm hover:bg-white/10"
          onClick={onClose}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Close gallery"
        >
          <X className="h-4 w-4" />
        </motion.button>
      </motion.div>

      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        initial={false}
        animate={{ x: dockPosition.x, y: dockPosition.y }}
        onDragEnd={(_, info) => {
          setDockPosition((current) => ({
            x: current.x + info.offset.x,
            y: current.y + info.offset.y,
          }));
        }}
        className="fixed bottom-4 left-1/2 z-[90] -translate-x-1/2 touch-none"
      >
        <motion.div className="relative cursor-grab rounded-xl border border-cyan-400/25 bg-cyan-400/12 shadow-lg backdrop-blur-xl active:cursor-grabbing">
          <div className="flex items-center px-3 py-2">
            {mediaItems.map((item, index) => (
              <motion.div
                key={item.id}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedItem(item);
                }}
                style={{
                  zIndex:
                    selectedItem.id === item.id ? 30 : mediaItems.length - index,
                }}
                className={`relative -ml-2 h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg ${
                  selectedItem.id === item.id
                    ? 'ring-2 ring-white/70 shadow-lg'
                    : 'hover:ring-2 hover:ring-white/30'
                }`}
                initial={{ rotate: index % 2 === 0 ? -12 : 12 }}
                animate={{
                  scale: selectedItem.id === item.id ? 1.15 : 1,
                  rotate: selectedItem.id === item.id ? 0 : index % 2 === 0 ? -12 : 12,
                  y: selectedItem.id === item.id ? -6 : 0,
                }}
                whileHover={{
                  scale: 1.24,
                  rotate: 0,
                  y: -8,
                  transition: { type: 'spring', stiffness: 400, damping: 25 },
                }}
              >
                <MediaItem item={item} className="h-full w-full" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/15" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

interface InteractiveBentoGalleryProps {
  description?: string;
  enableInteractions?: boolean;
  mediaItems: BentoMediaItem[];
  title?: string;
}

export default function InteractiveBentoGallery({
  description,
  enableInteractions = true,
  mediaItems,
  title,
}: InteractiveBentoGalleryProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [items, setItems] = useState(mediaItems);
  const [selectedItem, setSelectedItem] = useState<BentoMediaItem | null>(null);

  return (
      <div className="mx-auto w-full max-w-4xl">
      {title || description ? (
        <div className="mb-8 text-center">
          {title ? (
            <motion.h3
              className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-2xl font-semibold text-transparent md:text-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {title}
            </motion.h3>
          ) : null}
          {description ? (
            <motion.p
              className="mt-2 text-sm text-white/55 md:text-base"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {description}
            </motion.p>
          ) : null}
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {enableInteractions && selectedItem ? (
          <GalleryModal
            selectedItem={selectedItem}
            isOpen
            onClose={() => setSelectedItem(null)}
            setSelectedItem={setSelectedItem}
            mediaItems={items}
          />
        ) : (
            <motion.div
              className="grid grid-cols-1 auto-rows-[84px] gap-3 sm:grid-cols-3 sm:auto-rows-[88px] md:grid-cols-4 md:auto-rows-[92px]"
              initial="hidden"
              animate="visible"
              exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08 },
              },
            }}
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                layoutId={`media-${item.id}`}
                className={`group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] ${
                  enableInteractions ? 'cursor-move' : 'cursor-default'
                } ${item.span}`}
                onClick={() => {
                  if (enableInteractions && !isDragging) {
                    setSelectedItem(item);
                  }
                }}
                variants={{
                  hidden: { opacity: 0, y: 40, scale: 0.94 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      type: 'spring',
                      stiffness: 350,
                      damping: 25,
                      delay: index * 0.04,
                    },
                  },
                }}
                whileHover={{ scale: 1.02 }}
                drag={enableInteractions}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={1}
                onDragStart={() => {
                  if (enableInteractions) {
                    setIsDragging(true);
                  }
                }}
                onDragEnd={(_, info) => {
                  if (!enableInteractions) {
                    return;
                  }

                  setIsDragging(false);
                  const moveDistance = info.offset.x + info.offset.y;

                  if (Math.abs(moveDistance) <= 50) {
                    return;
                  }

                  const nextItems = [...items];
                  const draggedItem = nextItems[index];
                  const targetIndex =
                    moveDistance > 0
                      ? Math.min(index + 1, items.length - 1)
                      : Math.max(index - 1, 0);

                  nextItems.splice(index, 1);
                  nextItems.splice(targetIndex, 0, draggedItem);
                  setItems(nextItems);
                }}
              >
                <div className="relative h-full w-full overflow-hidden rounded-[1.1rem]">
                  <MediaItem
                    item={item}
                    className="absolute inset-0 h-full w-full"
                    onClick={() => {
                      if (enableInteractions && !isDragging) {
                        setSelectedItem(item);
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                  <motion.div
                    className="absolute inset-0 flex flex-col justify-end p-4"
                    initial={{ opacity: 0.88 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="relative line-clamp-1 text-lg font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="relative mt-1 line-clamp-2 max-h-0 overflow-hidden text-sm leading-relaxed text-white/0 transition-all duration-300 group-hover:max-h-20 group-hover:text-white/78">
                      {item.desc}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
