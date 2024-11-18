'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useScroll, motion, useTransform, useMotionValueEvent } from 'framer-motion';

import { cn } from '@/lib/classnames';
import { getImageSrc } from '@/lib/image-src';

import { StepLayoutOutroStepComponent } from '@/types/generated/strapi.schemas';

import { useIsMobile } from '@/hooks/screen-size';

import ScrollExplanation from '@/components/ui/scroll-explanation';

type Disclaimer = {
  id: number;
  title: string;
  partners: {
    id: number;
    logo: { data: { id: number; attributes: { url: string } } };
    url: string;
  }[];
};

type MediaStepLayoutProps = {
  step: StepLayoutOutroStepComponent;
  showContent: boolean;
  disclaimer?: unknown;
};

const OutroStepLayout = ({ step, showContent, disclaimer }: MediaStepLayoutProps) => {
  const { push } = useRouter();

  const { content, title } = step as StepLayoutOutroStepComponent;
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
    smooth: 10000,
  });

  const [show, setShow] = useState(true);

  const isMobile = useIsMobile();

  useEffect(() => {
    if (!showContent) setShow(false);
  }, [showContent]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!show && showContent && v > 0.2) {
      if (!isMobile && v > 0.2) setShow(true);
      if (isMobile && v > 0.1) setShow(true);
    }
    if (show && v < 0.2) setShow(false);
    if (v > 0.7) {
      push('/globe');
    }
  });

  const media = (step as any)?.media?.data?.attributes;

  const videoRef = useRef<HTMLVideoElement>(null);

  const mediaType = media?.mime?.split('/')[0];

  const mediaSrc = getImageSrc(media?.url);

  const mediaMime = media?.mime;

  const isVideo = mediaType?.includes('video');
  const isImage = mediaType?.includes('image');

  const scaleContent = useTransform(scrollYProgress, [0.5, 0.7], ['1', '0.75']);

  const categoryDisclaimer = disclaimer as Disclaimer[];

  return (
    <div ref={containerRef} className="absolute flex h-[300vh] items-end pt-[50vh] sm:items-start">
      <motion.div
        className={cn(
          'sticky bottom-0 flex h-screen min-h-fit w-screen flex-col items-center justify-center opacity-0 sm:top-0 sm:min-h-screen 2xl:px-12'
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent && show ? 1 : 0 }}
        transition={{ duration: 1.5 }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent && show ? 1 : 0 }}
          transition={{ duration: 1.5 }}
          className="fixed bottom-0 left-0 h-full w-screen backdrop-blur-sm"
        >
          <div className="h-full w-full bg-slate-900/60"></div>
        </motion.div>

        <div className="pointer-events-auto flex w-full flex-1 flex-col items-center justify-between sm:p-10">
          <div className="flex w-full flex-1 flex-col justify-between sm:gap-12 lg:flex-row">
            <motion.div
              initial={{ opacity: 0, x: '-300%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              style={{ scale: scaleContent }}
              className="relative z-50 flex w-full flex-1 items-center justify-center sm:mt-10"
            >
              {isVideo && (
                <video
                  width="100%"
                  height="100%"
                  src={mediaSrc}
                  ref={videoRef}
                  muted
                  loop
                  autoPlay={true}
                  controls
                >
                  <source src={mediaSrc} type={mediaMime} />
                </video>
              )}
              {isImage && (
                <Image
                  className="aspect-video w-full object-cover"
                  src={mediaSrc}
                  width={534}
                  height={330}
                  alt="story conclusion image"
                />
              )}
            </motion.div>

            <motion.div
              className="flex w-full max-w-5xl flex-1 items-center justify-center space-y-16"
              initial={{ opacity: 0, x: '300%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              style={{ scale: scaleContent }}
            >
              <div className="max-w-lg space-y-4 p-4 sm:p-10">
                <h3 className="text-enlight-yellow-500 text-2xl font-bold tracking-wider">
                  {title}
                </h3>
                <p>{content}</p>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="z-10 mb-8">
          <ScrollExplanation>Continue scrolling to explore more stories</ScrollExplanation>
        </div>

        <div
          className={cn(
            'font-notes pointer-events-auto relative w-screen bg-white p-4 text-xs italic text-gray-900 opacity-0',
            showContent && show && categoryDisclaimer?.length && 'opacity-100'
          )}
        >
          <ul className="flex flex-col flex-wrap items-center justify-center gap-x-10 gap-y-2 sm:flex-row">
            {categoryDisclaimer.map((item) => (
              <li key={item.title} className="flex items-center gap-2">
                <p className="shrink-0">{item.title}</p>
                <div className="flex flex-wrap gap-2">
                  {item.partners?.map((partner) => {
                    const src = getImageSrc(partner.logo?.data?.attributes?.url);

                    const url = partner.url;
                    return url ? (
                      <a
                        key={partner.id}
                        href={partner.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          src={src}
                          width={50}
                          height={30}
                          alt=""
                          className="h-8 w-full max-w-[125px] shrink-0 object-contain object-center"
                        />
                      </a>
                    ) : (
                      <div>
                        <Image
                          src={src}
                          width={50}
                          height={30}
                          alt=""
                          className="h-8 w-full max-w-[125px] object-contain object-center"
                        />
                      </div>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default OutroStepLayout;
