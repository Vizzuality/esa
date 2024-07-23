'use client';

import { useCallback } from 'react';

import { cn } from '@/lib/classnames';
import { useScrollToItem } from '@/lib/scroll';

import { useSyncStep } from '@/store/stories';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type ScrollItemControllerProps = {
  title: string;
  newStep: number | string;
  className?: string;
};

export const ScrollItemController = ({ title, newStep }: ScrollItemControllerProps) => {
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
          <Button
            variant="icon"
            className={cn(
              'outline-secondary h-4 w-4 rounded-full border-[1.5px] border-gray-800 bg-gray-900 transition-all duration-200 hover:outline',
              newStep === currStep ? 'border-secondary borde' : 'border-gray-700'
            )}
            onClick={handleSCrollToItem}
            size="icon"
          >
            <div
              className={cn(
                'h-2 w-2 rounded-full',
                newStep === currStep ? 'bg-secondary' : 'bg-transparent'
              )}
            ></div>
          </Button>
        </TooltipTrigger>

        <TooltipContent
          align="center"
          side="left"
          alignOffset={0}
          sideOffset={10}
          className="rounded-none px-1 py-px font-normal"
        >
          {title && <p>{title}</p>}
        </TooltipContent>
      </Tooltip>
    </>
  );
};
