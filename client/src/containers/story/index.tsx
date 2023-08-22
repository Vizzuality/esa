'use client';

import { useEffect } from 'react';

import Link from 'next/link';

import { useSetRecoilState } from 'recoil';

import { tmpBboxAtom } from '@/store';

const Story = ({ storyId, step }: { storyId: string; step: string }) => {
  const setTmpBbox = useSetRecoilState(tmpBboxAtom);

  useEffect(() => {
    setTmpBbox([20, 0, 25, 1]);
  }, [setTmpBbox]);

  return (
    <div className="absolute left-0 top-0 z-50 bg-white">
      <h1>
        {storyId} step {step}
      </h1>
      <Link href="/">Back to Home page</Link>
    </div>
  );
};

export default Story;
