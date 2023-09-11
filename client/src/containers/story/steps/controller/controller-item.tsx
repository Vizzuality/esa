import { useCallback } from 'react';

import { useRecoilValue } from 'recoil';

import { useScrollToItem } from '@/lib/scroll';

import { stepAtom } from '@/store/stories';

import { Button } from '@/components/ui/button';

type ScrollItemControllerProps = {
  newStep: number | string;
  className?: string;
};

export const ScrollItemController = ({ newStep, className }: ScrollItemControllerProps) => {
  const scrollToItem = useScrollToItem();

  const currStep = useRecoilValue(stepAtom);

  const handleSCrollToItem = useCallback(() => {
    if (newStep !== currStep) {
      scrollToItem(newStep);
    }
  }, [currStep, newStep, scrollToItem]);

  return <Button variant="icon" className={className} onClick={handleSCrollToItem} size="icon" />;
};
