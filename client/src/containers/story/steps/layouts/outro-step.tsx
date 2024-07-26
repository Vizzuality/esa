'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useScroll, motion, useTransform } from 'framer-motion';
import { useSetAtom } from 'jotai';

import { getImageSrc } from '@/lib/image-src';

import { isFlyingBackAtom } from '@/store/map';

import { StepLayoutOutroStepComponent } from '@/types/generated/strapi.schemas';

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

  const setIsFlyingBack = useSetAtom(isFlyingBackAtom);

  const { content, title } = step as StepLayoutOutroStepComponent;
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
    smooth: 10000,
  });

  const [show, setShow] = useState(false);

  useTransform(scrollYProgress, (v) => {
    if (!show && showContent && v > 0.2) {
      setShow(true);
    }
  });

  useEffect(() => {
    if (!showContent) setShow(false);
  }, [showContent]);

  useTransform(scrollYProgress, (v) => {
    if (v > 0.6) {
      setIsFlyingBack(true);
      setTimeout(() => {
        setIsFlyingBack(false);
      }, 3000);
      push('/');
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
    <div ref={containerRef} className="flex h-[300vh]">
      {showContent && show && (
        <motion.div className="sticky top-0 flex h-screen w-screen flex-col items-center justify-center 2xl:px-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="fixed bottom-0 left-0 h-full w-screen backdrop-blur-sm"
          >
            <div className="h-full w-full bg-slate-900/60"></div>
          </motion.div>
          <div className="pointer-events-auto flex w-full flex-1 flex-col items-center justify-between p-10">
            <div className="flex w-full flex-1 flex-col justify-between gap-12 lg:flex-row">
              <motion.div
                initial={{ opacity: 0, x: '-300%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                style={{ scale: scaleContent }}
                className="relative z-50 mt-10 flex w-full flex-1 items-center justify-center"
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
                <div className="max-w-lg space-y-4 p-10">
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

          {showContent && show && categoryDisclaimer?.length && (
            <div className="font-notes pointer-events-auto relative w-screen bg-white p-4 text-xs italic text-gray-900">
              <ul className="flex items-center justify-center gap-x-10 gap-y-2">
                {categoryDisclaimer.map((item) => (
                  <li key={item.title} className="flex items-center gap-2">
                    <p>{item.title}</p>
                    <div className="flex gap-2">
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
                              className="h-8 w-full max-w-[125px] object-contain object-center"
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
          )}
        </motion.div>
      )}
    </div>
  );
};

export default OutroStepLayout;
