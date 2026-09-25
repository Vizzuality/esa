import { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';

import { ChevronDown, InfoIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { ScrollArea } from '@/components/ui/scroll-area';

type CardProps = PropsWithChildren & {
  title?: string;
  info?: string;
  className?: string;
  scrollIndicator?: boolean;
};

const Card = ({ children, title, info, className, scrollIndicator }: CardProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const [showIndicator, setShowIndicator] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const updateIndicator = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const { scrollTop, clientHeight, scrollHeight } = viewport;
    // Show while there is still content below the fold (1px tolerance).
    setShowIndicator(scrollTop + clientHeight < scrollHeight - 1);
  }, []);

  const handleScroll = useCallback(() => {
    updateIndicator();
    // Animate the chevron briefly on every scroll, then settle.
    setIsScrolling(true);
    clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 600);
  }, [updateIndicator]);

  useEffect(() => {
    if (!scrollIndicator) return;
    const viewport = viewportRef.current;
    if (!viewport) return;

    updateIndicator();
    viewport.addEventListener('scroll', handleScroll, { passive: true });
    const observer = new ResizeObserver(updateIndicator);
    observer.observe(viewport);
    Array.from(viewport.children).forEach((child) => observer.observe(child));

    return () => {
      viewport.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      clearTimeout(scrollTimeoutRef.current);
    };
  }, [scrollIndicator, updateIndicator, handleScroll]);

  const rafRef = useRef<number>();

  const stopAutoScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = undefined;
  }, []);

  const startAutoScroll = useCallback(() => {
    stopAutoScroll();
    const step = () => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      viewport.scrollTop += 4; // px per frame
      // Stop once we reach the bottom.
      if (viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - 1) {
        stopAutoScroll();
        return;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, [stopAutoScroll]);

  useEffect(() => stopAutoScroll, [stopAutoScroll]);

  return (
    <div
      className={cn(
        'animate-in slide-in-from-top-5 fade-in sm:bg-background/30 relative flex h-full flex-col rounded border border-[#335E6F] pt-4 sm:backdrop-blur-sm',
        scrollIndicator && 'overflow-hidden',
        className
      )}
    >
      {title && (
        <div className="mb-2 flex justify-between px-4">
          <p className="font-notes text-sm font-semibold uppercase">{title}</p>
          {info && <InfoIcon className="h-4 w-4" />}
        </div>
      )}
      <ScrollArea
        type="always"
        viewportRef={viewportRef}
        className={cn('overflow-x-visible', !title ? 'h-[calc(100%-20px)]' : 'h-full')}
      >
        <div className="pb-4">{children}</div>
      </ScrollArea>
      {scrollIndicator && (
        <button
          type="button"
          aria-label="Scroll for more"
          onMouseEnter={startAutoScroll}
          onMouseLeave={stopAutoScroll}
          onFocus={startAutoScroll}
          onBlur={stopAutoScroll}
          className={cn(
            'group absolute inset-x-0 bottom-0 flex items-center justify-center bg-white/20 py-0.5 backdrop-blur-[6px] transition-opacity duration-300',
            showIndicator ? 'opacity-100' : 'pointer-events-none opacity-0'
          )}
        >
          <ChevronDown
            className={cn(
              'h-6 w-6 shrink-0 stroke-[3px] text-gray-600 transition-colors duration-300 group-hover:animate-bounce',
              isScrolling && 'animate-bounce'
            )}
          />
        </button>
      )}
    </div>
  );
};

export default Card;
