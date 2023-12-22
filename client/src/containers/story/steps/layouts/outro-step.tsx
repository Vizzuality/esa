'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useScroll, motion, useTransform } from 'framer-motion';
import { useSetRecoilState } from 'recoil';

import { getImageSrc } from '@/lib/image-src';

import { isFlyingBackAtom } from '@/store';

import { StepLayoutOutroStepComponent } from '@/types/generated/strapi.schemas';

type MediaStepLayoutProps = {
  step: StepLayoutOutroStepComponent;
  categoryId?: number;
  showContent: boolean;
};

const links = [
  [
    'https://www.gaf.de/',
    '',
    'https://site.tre-altamira.com/',
    'http://www.gisat.cz/',
    'https://www.ait.ac.at/en/',
    'https://www.caribou.space/',
  ],
  ['https://www.adb.org/'],
  ['https://www.esa.int/'],
];

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

  const mediaSrc = getImageSrc(media?.url);

  const mediaMime = media?.mime;

  const isVideo = mediaType.includes('video');

  // const handlePlayVideo = useCallback(
  //   (e: React.MouseEvent<HTMLVideoElement, MouseEvent>, action: 'play' | 'pause') => {
  //     if (action === 'play') e.currentTarget.play();
  //     else e.currentTarget.pause();
  //   },
  //   []
  // );

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
          <div className="pointer-events-auto flex w-full flex-1 flex-col items-center justify-between p-10">
            <div className="flex w-full flex-1 flex-col justify-between gap-12 lg:flex-row">
              {isVideo && (
                <motion.div
                  initial={{ opacity: 0, x: '-300%' }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                  style={{ scale: scaleContent }}
                  className="relative z-50 mt-10 flex w-full flex-1 items-center justify-center"
                >
                  <video
                    width="100%"
                    height="100%"
                    src={mediaSrc}
                    ref={videoRef}
                    muted
                    loop
                    autoPlay={true}
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
                <div className="max-w-lg space-y-4 p-10">
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
            className="font-notes z-10 w-full space-y-4 place-self-end pb-[10vh] text-center text-sm italic text-white"
          >
            <p>Continue scrolling to explore more stories</p>
          </motion.div>
          {showContent && show && step.disclaimer && (
            <div className="font-notes pointer-events-auto relative w-screen bg-white p-4 text-xs italic text-black">
              <ul className="flex items-center justify-center gap-x-10 gap-y-2">
                {step.disclaimer.map((d, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <p>{d.title}</p>
                    <div className="flex gap-2">
                      {d.logos &&
                        d.logos?.data?.map((logo, index) => {
                          const src = getImageSrc(logo?.attributes?.url);

                          const url = links[i][index];
                          return url ? (
                            <a
                              key={logo?.attributes?.url}
                              href={links[i][index]}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Image
                                src={src}
                                width={50}
                                height={30}
                                alt=""
                                className="h-8 w-full object-contain object-center"
                              />
                            </a>
                          ) : (
                            <div>
                              <Image
                                src={src}
                                width={50}
                                height={30}
                                alt=""
                                className="h-8 w-full object-contain object-center"
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
