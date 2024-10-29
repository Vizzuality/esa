import { useRouter } from 'next/navigation';

import { useSetAtom } from 'jotai';
import { ArrowLeft, FacebookIcon, LinkedinIcon, Share2, TwitterIcon, XIcon } from 'lucide-react';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'framer-motion';
import env from '@/env.mjs';

import { layersAtom } from '@/store/map';

import { Button } from '@/components/ui/button';
import CategoryIcon from '@/components/ui/category-icon';
import { Dialog, DialogContentHome, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/classnames';
import { use, useRef, useState } from 'react';
import { c } from 'nuqs/dist/serializer-5da93b5e';

const headerButtonClassName =
  'h-8 px-4 py-2 rounded-4xl sm:h-auto border border-gray-800 bg-gray-900 sm:px-5 sm:py-2.5 hover:bg-gray-800';

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

  const mobileRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll({
    target: mobileRef,
  });

  const [collapsed, setCollapsed] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (latest > 375) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  });

  return (
    <>
      <div className="bg-story-header fixed left-0 top-0 z-30 hidden w-screen overflow-x-hidden sm:block">
        <div className="flex justify-between gap-4 p-4 pb-2 text-center text-2xl font-bold sm:flex-row sm:items-center sm:px-12 sm:py-6">
          <div className="order-2 flex flex-1 items-center gap-2 sm:order-1 sm:gap-4">
            <CategoryIcon slug={categorySlug} className="hidden shrink-0 fill-gray-200 sm:block" />
            <h1 className="font-notes text-start text-base font-normal sm:text-center sm:text-2xl">
              {categoryTitle}: {title}
            </h1>
          </div>
          <Dialog>
            <DialogTrigger className={cn('order-2 px-4 py-2 sm:order-1 ', headerButtonClassName)}>
              <Share2 className="h-4 w-4 sm:h-6 sm:w-6" />
            </DialogTrigger>
            <DialogContentHome data-button-side="right" className="w-full sm:w-[500px]">
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
          <Button
            value="icon"
            className={cn('order-1 sm:order-2', headerButtonClassName)}
            onClick={handleGoHome}
          >
            <XIcon className="hidden h-6 w-6 sm:inline-block" />
            <ArrowLeft className="inline-block h-4 w-4 sm:hidden" />
          </Button>
        </div>
      </div>

      <div
        className={cn(
          'bg-background fixed left-0 top-0 z-30 h-fit min-h-fit w-screen overflow-x-hidden transition-all duration-300 sm:hidden',
          collapsed ? 'h-[56px]' : `h-[135px]`
        )}
      >
        <div
          ref={mobileRef}
          className={cn(
            'flex h-fit justify-between gap-x-2 gap-y-4  px-4 py-4 pb-2 text-center text-2xl font-bold',
            !collapsed && 'flex-wrap'
          )}
        >
          <Button
            value="icon"
            className={cn('flex-0 order-1', headerButtonClassName)}
            onClick={handleGoHome}
          >
            <XIcon className="hidden h-6 w-6 sm:inline-block" />
            <ArrowLeft className="inline-block h-4 w-4 sm:hidden" />
          </Button>

          <div className={cn('flex items-center gap-2', collapsed ? 'order-2' : 'order-3')}>
            <CategoryIcon
              slug={categorySlug}
              className={cn('shrink-0 fill-gray-200', collapsed && 'hidden')}
            />
            <h1
              className={cn(
                'font-notes text-start text-base font-normal sm:text-center sm:text-2xl',
                collapsed && 'max-w-[60vw] truncate'
              )}
            >
              {categoryTitle}: {title}
            </h1>
          </div>

          <Dialog>
            <DialogTrigger
              className={cn(
                'order-2 px-4 py-2',
                headerButtonClassName,
                collapsed ? 'order-3' : 'order-2'
              )}
            >
              <Share2 className="h-4 w-4 sm:h-6 sm:w-6" />
            </DialogTrigger>
            <DialogContentHome data-button-side="right" className="w-full sm:w-[500px]">
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
        </div>
      </div>
    </>
  );
};

export default StoryHeader;
