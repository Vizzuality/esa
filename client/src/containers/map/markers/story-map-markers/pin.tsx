'use client';

import { useState, useEffect } from 'react';

import Image from 'next/image';

export const StoryPin = ({ name }: { name: string }) => {
  const [size, setSize] = useState(1);
  const [opacity, setOpacity] = useState(1);
  // Animate the size and opacity of the markers
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const startTime = performance.now();
    const velocity = 3000; // total duration (ms) of one pulse
    const minScale = 0.75; // minimum scale (0.75 -> 1 -> 0.75)

    const animate = () => {
      const elapsed = (performance.now() - startTime) % velocity;
      const progress = elapsed / velocity; // 0..1
      const x = Math.abs(Math.sin(progress * Math.PI)); // ease in/out
      setOpacity(0.85 + 0.15 * x); // 0.85 -> 1.0
      setSize(minScale + (1 - minScale) * x); // 0.75 -> 1.0
      requestAnimationFrame(animate);
    };

    const frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div
        className="absolute left-1/2 top-1/2 z-0 h-16 w-16 -translate-x-1/2 -translate-y-1/2 transform rounded-full border-[3px] bg-gray-800/80 will-change-[transform,opacity]"
        style={
          {
            opacity,
            '--tw-scale-x': size,
            '--tw-scale-y': size,
          } as React.CSSProperties
        }
      />

      <div className="absolute left-full top-1/2 -translate-y-1/2 pl-2">
        <div className="font-notes whitespace-nowrap rounded border border-gray-800 bg-gray-800/80 px-2 py-1 text-sm font-bold uppercase leading-5 tracking-[0.05em] text-gray-200">
          {name}
        </div>
      </div>

      <Image
        src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/map/pin-marker.svg`}
        width={32}
        height={32}
        priority
        alt="Story marker"
        className="relative z-10 h-6 w-6 origin-bottom object-cover"
      />
    </div>
  );
};
