'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useScroll, motion, useTransform, useMotionValueEvent, useInView } from 'framer-motion';
import { useSetAtom } from 'jotai';

import { cn } from '@/lib/classnames';
import { getImageSrc } from '@/lib/image-src';

import { layersAtom } from '@/store/map';
import { storyNavigation } from '@/store/stories';

import { StepLayoutOutroStepComponent } from '@/types/generated/strapi.schemas';

import { useIsMobile } from '@/hooks/screen-size';

import RichText from '@/components/ui/rich-text';
import ScrollExplanation from '@/components/ui/scroll-explanation';

import Feedback from '@/containers/story/feedback';

type Disclaimer = {
  id: number;
  title: string;
  partners: {
    id: number;
    name: string;
    logo: {
      data: { id: number; attributes: { url: string; alternativeText?: string; caption?: string } };
    };
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
  const setLayers = useSetAtom(layersAtom);

  const { content, title } = step as StepLayoutOutroStepComponent;

  // Merge all partners from the step and category disclaimer
  // If the title is the same, merge the partners into a single array
  const allPartners = useMemo(() => {
    const stepPartners = 'disclaimer' in step ? (step.disclaimer as Disclaimer[]) : [];
    const partners: Record<string, Disclaimer['partners']> = {};

    [...((disclaimer as Disclaimer[]) || []), ...(stepPartners || [])].forEach((partner) => {
      if (!partners[partner.title]) {
        partners[partner.title] = [];
      }
      partners[partner.title] = [...partners[partner.title], ...partner.partners];
    });

    return Object.entries(partners)?.map(([title, partners]) => ({
      title,
      partners,
    }));
  }, [step, disclaimer]);

  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const navigatedRef = useRef(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
    smooth: 10000,
  });

  // Sentinel at the very bottom of the outro: only enters view once the user has
  // scrolled past the outro content, so we redirect at the true end of the story.
  // The outro is the last step, so the page can't scroll past the sentinel — at max
  // scroll it sits right at (or just below) the fold and would never intersect. The
  // bottom margin grows the observer root downward so it registers in the final
  // stretch of scroll, while still gating the redirect on `hasSeenOutro`.
  const isEnd = useInView(endRef, { amount: 'some', margin: '0px 0px 200px 0px' });

  const [show, setShow] = useState(true);
  // True once the user has scrolled far enough to see the "Continue scrolling" hint;
  // gates the redirect so we only leave for the globe after that hint is shown.
  const [hasSeenOutro, setHasSeenOutro] = useState(false);

  const isMobile = useIsMobile();

  useEffect(() => {
    if (!showContent) setShow(false);
  }, [showContent]);

  useEffect(() => {
    if (isEnd && hasSeenOutro && !navigatedRef.current) {
      navigatedRef.current = true;
      storyNavigation.isLeaving = true;
      setLayers([]);
      push('/globe', { scroll: false });
    }
  }, [isEnd, hasSeenOutro, setLayers, push]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!show && showContent && v > 0.2) {
      if (!isMobile && v > 0.2) setShow(true);
      if (isMobile && v > 0.1) setShow(true);
    }
    if (show && v < 0.2) setShow(false);
    // Matches the "Continue scrolling" hint threshold (showContinueScrolling, 0.3-0.5).
    if (!hasSeenOutro && v > 0.5) setHasSeenOutro(true);
  });

  // const media = (step as any)?.media?.data?.attributes;
  // const videoRef = useRef<HTMLVideoElement>(null);
  // const mediaType = media?.mime?.split('/')[0];
  // const mediaSrc = getImageSrc(media?.url);
  // const mediaMime = media?.mime;
  // const isVideo = mediaType?.includes('video');
  // const isImage = mediaType?.includes('image');

  const scrollOpacity = useTransform(scrollYProgress, [0.5, 0.8], [1, 0.1]);
  const showContinueScrolling = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);

  const categoryDisclaimer = disclaimer as Disclaimer[];

  return (
    <div ref={containerRef} className="relative flex h-[300vh] items-end pt-[50vh] sm:items-start">
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
          <div className={cn('flex flex-1 flex-col justify-between sm:gap-12 lg:flex-row')}>
            {/* {mediaSrc && (
              <motion.div
                initial={{ opacity: 0, x: '-300%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                style={{ opacity: scrollOpacity }}
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
            )} */}

            <motion.div
              className="flex w-full max-w-5xl flex-1 flex-col justify-center space-y-4 sm:items-center"
              initial={{ opacity: 0, x: '300%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              style={{ opacity: scrollOpacity }}
            >
              <div className="max-w-lg  space-y-4 p-4 sm:p-10">
                <h3 className="text-enlight-yellow-500 text-2xl font-bold tracking-wider">
                  {title}
                </h3>
                <RichText className="conclusion-list text-white">{content}</RichText>
              </div>
              <Feedback />
            </motion.div>
          </div>
        </div>
        <div className="fixed bottom-0">
          <motion.div style={{ opacity: showContinueScrolling }} className="z-10 mb-8">
            <ScrollExplanation>Continue scrolling to explore more stories</ScrollExplanation>
          </motion.div>

          <div
            className={cn(
              'font-notes pointer-events-auto relative w-screen bg-white p-4 text-xs italic text-gray-900 opacity-0',
              showContent && show && categoryDisclaimer?.length && 'opacity-100'
            )}
          >
            <ul className="flex flex-col flex-wrap items-center justify-center gap-x-10 gap-y-2 sm:flex-row">
              {allPartners.map((item) => (
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
                            key={partner.id}
                            src={src}
                            width={125}
                            height={32}
                            alt={
                              partner.logo?.data?.attributes?.alternativeText ||
                              partner.name ||
                              partner.logo?.data?.attributes?.caption ||
                              'Partner logo'
                            }
                            className="h-8 w-auto max-w-[125px] shrink-0 object-contain object-center"
                          />
                        </a>
                      ) : (
                        <div>
                          <Image
                            key={partner.id}
                            src={src}
                            width={125}
                            height={32}
                            alt={
                              partner.logo?.data?.attributes?.alternativeText ||
                              partner.name ||
                              partner.logo?.data?.attributes?.caption ||
                              'Partner logo'
                            }
                            className="h-8 w-auto max-w-[125px] shrink-0 object-contain object-center"
                          />
                        </div>
                      );
                    })}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
      <div ref={endRef} className="pointer-events-none absolute bottom-0 h-px w-full" />
    </div>
  );
};

export default OutroStepLayout;
