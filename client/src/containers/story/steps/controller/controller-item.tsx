import { useCallback } from 'react';

import { useRecoilValue } from 'recoil';

import { useScrollToItem } from '@/lib/scroll';

import { stepAtom } from '@/store/stories';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type ScrollItemControllerProps = {
  title: string;
  newStep: number | string;
  className?: string;
};

export const ScrollItemController = ({ title, newStep, className }: ScrollItemControllerProps) => {
  const scrollToItem = useScrollToItem();

  const currStep = useRecoilValue(stepAtom);

  const handleSCrollToItem = useCallback(() => {
    if (newStep !== currStep) {
      scrollToItem(newStep);
    }
  }, [currStep, newStep, scrollToItem]);

  return (
    <>
      <Tooltip delayDuration={300}>
        <TooltipTrigger type="button" aria-label="Change layer opacity" className="h-5">
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
