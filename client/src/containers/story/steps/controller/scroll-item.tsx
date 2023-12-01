import { PropsWithChildren, useRef } from 'react';

import { useScroll } from 'framer-motion';

import { useAddScrollItem } from '@/lib/scroll';

interface ScrollItemProps extends PropsWithChildren {
  step: number;
}

export const ScrollItem = ({ children, step }: ScrollItemProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const scrollMotionValue = useScroll({
    target: ref,
    offset: ['0 1', '1 0'],
  });

  useAddScrollItem({
    ref,
    key: `scroll-${step}`,
    data: {
      step,
    },
    ...scrollMotionValue,
  });

  return (
    <section ref={ref} id={`scroll-${step}`} className="pointer-events-none h-full w-full">
      {children}
    </section>
  );
};
