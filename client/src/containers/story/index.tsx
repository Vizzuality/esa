'use client';

import { useEffect } from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useSetRecoilState } from 'recoil';

import { tmpBboxAtom } from '@/store';

import { useGetStoriesId } from '@/types/generated/story';

import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';

const Story = () => {
  const { id } = useParams();
  const { data: storyData } = useGetStoriesId(+id);
  const setTmpBbox = useSetRecoilState(tmpBboxAtom);

  useEffect(() => {
    if (storyData?.data?.attributes?.bbox) {
      setTmpBbox(storyData?.data?.attributes?.bbox as [number, number, number, number]);
    }
  }, [storyData?.data?.attributes?.bbox, setTmpBbox]);

  return (
    <div className="text-primary justify-between p-12">
      <div className="2xl:w-70 w-64">
        <Card>
          <div className="flex flex-col space-y-2">
            <h1>{storyData?.data?.attributes?.title}</h1>

            <Link href="/">
              <Button variant="secondary">Back to Home page</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Story;
