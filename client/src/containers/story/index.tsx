'use client';

import { useEffect } from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useSetRecoilState } from 'recoil';

import { tmpBboxAtom } from '@/store';

import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';

const Story = () => {
  const { id } = useParams();
  const setTmpBbox = useSetRecoilState(tmpBboxAtom);

  useEffect(() => {
    setTmpBbox([20, 0, 25, 1]);
  }, [setTmpBbox]);

  return (
    <div className="text-primary justify-between p-12">
      <div className="2xl:w-70 w-64">
        <Card>
          <h1>{id}</h1>

          <Link href="/">
            <Button variant="secondary">Back to Home page</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default Story;
