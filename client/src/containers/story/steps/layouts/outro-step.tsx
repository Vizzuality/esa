'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useScroll, motion, useTransform } from 'framer-motion';
import { useSetRecoilState } from 'recoil';

import env from '@/env.mjs';

import { isFlyingBackAtom } from '@/store';

import { StepLayoutItem, StepLayoutOutroStepComponent } from '@/types/generated/strapi.schemas';

const apiBaseUrl = env.NEXT_PUBLIC_API_URL.replace('/api', '');

type MediaStepLayoutProps = {
  step: StepLayoutItem;
  categoryId?: number;
  showContent: boolean;
};

const OutroStepLayout = ({ step, showContent }: MediaStepLayoutProps) => {
  const { push } = useRouter();

  const setIsFlyingBack = useSetRecoilState(isFlyingBackAtom);

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

  const mediaSrc = media?.url;
  const mediaMime = media?.mime;

  const isVideo = mediaType.includes('video');

  const handlePlayVideo = useCallback(
    (e: React.MouseEvent<HTMLVideoElement, MouseEvent>, action: 'play' | 'pause') => {
      if (action === 'play') e.currentTarget.play();
      else e.currentTarget.pause();
    },
    []
  );

  const scale = useTransform(scrollYProgress, [0.5, 0.7], ['1', '2']);
  const scaleContent = useTransform(scrollYProgress, [0.5, 0.7], ['1', '0.75']);

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
          <div className="pointer-events-auto flex w-full flex-1 items-center justify-between">
            <div className="flex w-full flex-1 flex-col justify-between gap-12 lg:flex-row">
              {isVideo && (
                <motion.div
                  initial={{ opacity: 0, x: '-300%' }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                  style={{ scale: scaleContent }}
                  className="relative z-50 w-full flex-1"
                >
                  <video
                    width="100%"
                    height="100%"
                    src={mediaSrc}
                    ref={videoRef}
                    muted
                    loop
                    autoPlay={true}
                    onMouseEnter={(e) => handlePlayVideo(e, 'play')}
                    onMouseLeave={(e) => handlePlayVideo(e, 'pause')}
                  >
                    <source src={mediaSrc} type={mediaMime} />
                  </video>
                </motion.div>
              )}
              <motion.div
                className="flex w-full max-w-5xl flex-1 items-center justify-center space-y-16"
                initial={{ opacity: 0, x: '300%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                style={{ scale: scaleContent }}
              >
                <div className="max-w-lg space-y-4">
                  <h3 className="text-enlight-yellow-500 text-2xl font-bold tracking-wider">
                    {title}
                  </h3>
                  <p>{content}</p>
                </div>
              </motion.div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5 }}
            style={{ scale }}
            className="font-notes z-10 w-full place-self-end pb-[10vh] text-center text-sm italic text-white"
          >
            Continue scrolling to explore more stories
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default OutroStepLayout;
