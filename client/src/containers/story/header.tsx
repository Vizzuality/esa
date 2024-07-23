import { Share2, XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import CategoryIcon from '@/components/ui/category-icon';
import { useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';
import { layersAtom } from '@/store/map';

const headerButtonClassName =
  'rounded-4xl h-auto border border-gray-800 bg-gray-900 px-5 py-2.5 hover:bg-gray-800';

type StoryHeaderProps = {
  categorySlug?: string;
  categoryTitle?: string;
  title?: string;
};

const StoryHeader = ({ categorySlug, title, categoryTitle }: StoryHeaderProps) => {
  const { push } = useRouter();
  const setLayers = useSetAtom(layersAtom);

  const handleGoHome = () => {
    setLayers([]);
    push('/');
  };

  return (
    <div className="bg-story-header fixed left-0 top-0 z-30 w-full">
      <div className="flex items-center justify-between px-12 py-6 text-center text-2xl font-bold">
        <div className="flex gap-4">
          <CategoryIcon slug={categorySlug} className="fill-gray-200" />
          <h1 className="font-notes text-2xl font-normal">
            {categoryTitle}: {title}
          </h1>
        </div>
        <div className="space-x-2">
          <Button value="icon" className={headerButtonClassName}>
            <Share2 className="h-6 w-6" />
          </Button>
          <Button value="icon" className={headerButtonClassName} onClick={handleGoHome}>
            <XIcon className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StoryHeader;
