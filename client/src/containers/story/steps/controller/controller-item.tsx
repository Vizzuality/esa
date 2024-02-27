'use client';

import { useCallback } from 'react';

import { useScrollToItem } from '@/lib/scroll';

import { useSyncStep } from '@/store/stories';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type ScrollItemControllerProps = {
  title: string;
  newStep: number | string;
  className?: string;
};

export const ScrollItemController = ({ title, newStep, className }: ScrollItemControllerProps) => {
  const scrollToItem = useScrollToItem();

  const { step: currStep } = useSyncStep();

  const handleSCrollToItem = useCallback(() => {
    if (newStep !== currStep) {
      scrollToItem(newStep);
    }
  }, [currStep, newStep, scrollToItem]);

  return (
    <>
      <Tooltip delayDuration={300}>
        <TooltipTrigger
          type="button"
          aria-label={`Scroll to step ${newStep}`}
          className="h-5"
          asChild
        >
          <Button variant="icon" className={className} onClick={handleSCrollToItem} size="icon" />
        </TooltipTrigger>

        <TooltipContent
          align="end"
          alignOffset={-10}
          sideOffset={0}
          className="rounded-none px-1 py-px font-normal"
        >
          {title && <p>{title}</p>}
          {newStep === 0 && !title && <p>Introduction</p>}
          {newStep === 4 && !title && <p>Conclusion</p>}
        </TooltipContent>
      </Tooltip>
    </>
  );
};
