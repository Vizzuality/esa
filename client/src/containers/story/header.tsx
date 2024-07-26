import { useRouter } from 'next/navigation';

import { useSetAtom } from 'jotai';
import { FacebookIcon, LinkedinIcon, Share2, TwitterIcon, XIcon } from 'lucide-react';

import env from '@/env.mjs';

import { layersAtom } from '@/store/map';

import { Button } from '@/components/ui/button';
import CategoryIcon from '@/components/ui/category-icon';
import { Dialog, DialogContentHome, DialogTrigger } from '@/components/ui/dialog';

const headerButtonClassName =
  'rounded-4xl h-auto border border-gray-800 bg-gray-900 px-5 py-2.5 hover:bg-gray-800';

const shareIcons = [
  {
    icon: FacebookIcon,
    link: 'https://www.facebook.com/sharer/sharer.php?u=',
  },
  {
    icon: TwitterIcon,
    link: 'https://twitter.com/intent/tweet?text=',
  },
  {
    icon: LinkedinIcon,
    link: 'https://www.linkedin.com/shareArticle?mini=true&url=',
  },
];

type StoryHeaderProps = {
  categorySlug?: string;
  categoryTitle?: string;
  title?: string;
  storyId?: string;
};

const StoryHeader = ({ categorySlug, title, categoryTitle, storyId }: StoryHeaderProps) => {
  const { push } = useRouter();
  const setLayers = useSetAtom(layersAtom);

  const handleGoHome = () => {
    setLayers([]);
    push('/globe');
  };

  const storyUrl = `${env.NEXT_PUBLIC_URL}${
    env.NEXT_PUBLIC_BASE_PATH ? env.NEXT_PUBLIC_BASE_PATH : ''
  }/stories/${storyId}`;

  const handleCopyToClipboard = () => {
    navigator?.clipboard?.writeText(storyUrl);
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
          <Dialog>
            <DialogTrigger className={headerButtonClassName}>
              <Share2 className="h-6 w-6" />
            </DialogTrigger>
            <DialogContentHome data-button-side="right" className="w-[500px]">
              <div className="space-y-6 p-6">
                <div className="font-notes text-lg font-bold uppercase leading-[27px] tracking-widest text-white">
                  Share story
                </div>
                <div className="space-y-2">
                  <div className="font-open-sans text-sm font-normal leading-tight text-gray-300">
                    Copy and paste link to share
                  </div>
                  <div className="flex w-full items-center justify-start gap-2 rounded-[32px] border border-gray-200 py-2 pl-4 pr-2">
                    <div className="flex shrink grow basis-0 flex-col items-start justify-start gap-1.5">
                      <div className="font-open-sans text-sm font-normal leading-tight text-gray-300">
                        {storyUrl}
                      </div>
                    </div>
                    <div className="flex items-start justify-start">
                      <Button
                        onClick={handleCopyToClipboard}
                        variant="secondary"
                        className="ont-open-sans h-fit rounded-full bg-teal-500 px-4 py-2 text-sm font-normal leading-none text-white hover:bg-teal-500/80"
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-x-2">
                  {shareIcons.map(({ icon: Icon, link }) => (
                    <a
                      key={`${link}${env.NEXT_PUBLIC_URL}${env.NEXT_PUBLIC_BASE_PATH}/stories/${storyId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 px-0 py-0"
                      href={link}
                    >
                      <Icon className="h-4 w-4 fill-gray-200 stroke-none" />
                    </a>
                  ))}
                </div>
              </div>
            </DialogContentHome>
          </Dialog>
          <Button value="icon" className={headerButtonClassName} onClick={handleGoHome}>
            <XIcon className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StoryHeader;
