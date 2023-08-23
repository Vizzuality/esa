'use client';

import { useEffect } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation';

import { useSetRecoilState } from 'recoil';

import { tmpBboxAtom } from '@/store';

import { Button } from '@/components/ui/button';

const TOTAL_STEPS = 3;

const Story = () => {
  const setTmpBbox = useSetRecoilState(tmpBboxAtom);
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const step = searchParams.get('step');
  const pathname = usePathname();
  const storyId = pathname.split('/').pop();

  useEffect(() => {
    setTmpBbox([20, 0, 25, 1]);
  }, [setTmpBbox]);

  const currentStep = step && Number.isInteger(parseInt(step)) ? parseInt(step) : 1;

  const handleStep = (direction: 'next' | 'prev') => {
    if (direction === 'prev' && currentStep > 1) {
      push(`${pathname}?step=${currentStep - 1}`);
    } else if (direction === 'next' && currentStep < TOTAL_STEPS) {
      push(`${pathname}?step=${currentStep + 1}`);
    }
  };

  return (
    <div className="absolute left-0 top-0 z-50 bg-white">
      <h1>
        {storyId} step {step}
      </h1>

      <div>
        <Button disabled={currentStep <= 1} onClick={() => handleStep('prev')}>
          Prev
        </Button>
        <Button disabled={currentStep >= TOTAL_STEPS} onClick={() => handleStep('next')}>
          Next
        </Button>
      </div>

      <Link href="/">Back to Home page</Link>
    </div>
  );
};

export default Story;
