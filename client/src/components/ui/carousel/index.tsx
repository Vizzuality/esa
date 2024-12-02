import './index.css';
import React, {
  ComponentPropsWithRef,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';

import Image from 'next/image';

import { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';
import { getImageSrc } from '@/lib/image-src';

type UseDotButtonType = {
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
};

export const useDotButton = (emblaApi: EmblaCarouselType | undefined): UseDotButtonType => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  };
};

type DotButtonPropType = ComponentPropsWithRef<'button'>;

export const DotButton: React.FC<DotButtonPropType> = (props) => {
  const { children, ...restProps } = props;

  return (
    <button type="button" {...restProps}>
      {children}
    </button>
  );
};

type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
};

export const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined
): UsePrevNextButtonsType => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on('reInit', onSelect).on('select', onSelect);
  }, [emblaApi, onSelect]);

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  };
};

type PrevButtonPropType = ComponentPropsWithRef<'button'>;

export const PrevButton: React.FC<PrevButtonPropType> = (props) => {
  const { children, ...restProps } = props;

  return (
    <button className="rounded-full border border-white p-2" type="button" {...restProps}>
      <ChevronLeftIcon className="h-6 w-6 text-white" />
      {children}
    </button>
  );
};

export const NextButton: React.FC<PrevButtonPropType> = (props) => {
  const { children, ...restProps } = props;

  return (
    <button className="rounded-full border border-white p-2" type="button" {...restProps}>
      <ChevronRightIcon className="h-6 w-6 text-white" />
      {children}
    </button>
  );
};

type CarouselMediaProps = {
  media: {
    id: number;
    url: string;
    mime: string;
    type: string;
    title: string;
  };
  isCurrentMedia?: boolean;
};

export const CarouselMedia = ({ media, isCurrentMedia }: CarouselMediaProps) => {
  const mediaSrc = getImageSrc(media?.url);

  if (media?.type === 'video') {
    return (
      <video
        width="100%"
        height="100%"
        src={mediaSrc}
        loop
        controls
        className={cn(
          'h-full max-h-[calc(100vh-152px)] w-full bg-black',
          isCurrentMedia ? 'object-contain' : 'object-cover'
        )}
      >
        <source src={media.url} type={media.mime} />
      </video>
    );
  }
  return (
    <Image
      src={mediaSrc}
      className={cn(
        'h-full max-h-[calc(100vh-152px)] w-full',
        isCurrentMedia ? 'object-contain' : 'object-cover'
      )}
      height={1200}
      width={500}
      alt={media.title}
    />
  );
};

type PropType = PropsWithChildren & {
  options?: EmblaOptionsType;
  medias: CarouselMediaProps['media'][];
  selected?: number;
};

const EmblaCarousel: React.FC<PropType> = ({ options, medias, selected }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
  // const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
  //   usePrevNextButtons(emblaApi);

  const [currSlider, setCurrSlider] = useState(0);

  useEffect(() => {
    if (selected !== undefined && emblaApi) {
      emblaApi.scrollTo(selected);
      setCurrSlider(selected);
    }
  }, [selected, emblaApi]);

  const handleSelectedSlide = useCallback((embla: EmblaCarouselType) => {
    setCurrSlider(embla.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (emblaApi) emblaApi.on('slidesInView', handleSelectedSlide);
  }, [emblaApi, handleSelectedSlide]);

  return (
    <section className="embla w-full space-y-4">
      <div className="embla__viewport w-full" ref={emblaRef}>
        <div
          className={cn(
            'embla__container -ml-4 items-center sm:-ml-10',
            medias.length === 1 && ' justify-center'
          )}
        >
          {medias?.map((media, index) => (
            <div
              className={cn(
                'embla__slide flex-[0_0_60%] pl-4 sm:pl-10',
                index === currSlider ? 'h-[80vh]' : 'h-[40vh]'
              )}
              key={index}
            >
              <div className={cn('h-full w-full text-white')}>
                <CarouselMedia media={media} isCurrentMedia={index === currSlider} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex justify-between">
        {/* <div className="my-auto">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
        </div> */}

        <div className="flex flex-1 items-center justify-center gap-2">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              data-selected={index === selectedIndex}
              onClick={() => onDotButtonClick(index)}
              className={cn(
                'h-4 w-4 rounded-full border border-white data-[selected=true]:bg-white/50',
                index === selectedIndex ? ' embla__dot--selected' : ''
              )}
            />
          ))}
        </div>

        {/* <div className="right-0 my-auto">
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div> */}
      </div>
    </section>
  );
};

export default EmblaCarousel;
