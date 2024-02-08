import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  RefObject,
} from 'react';

import { motionValue, MotionValue, useMotionValueEvent, useScroll } from 'framer-motion';

import { useStep } from '@/store/stories';

type ScrollItem = {
  key: string | number;
  ref: RefObject<HTMLDivElement>;
  data: Record<string, any>;
  scrollX: MotionValue<number>;
  scrollY: MotionValue<number>;
  scrollXProgress: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
};

interface ScrollContext {
  scrollItems: ScrollItem[];
  addScrollItem: (data: ScrollItem) => void;
  scrollToItem: (item: number | string) => void;
}

const Context = createContext<ScrollContext>({
  scrollItems: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  addScrollItem: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  scrollToItem: () => {},
});

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'
    ? useLayoutEffect
    : useEffect;

export const ScrollProvider = ({ children }: PropsWithChildren<any>) => {
  const [scrollItems, setScrollItems] = useState<ScrollItem[]>([]);
  const { scrollY } = useScroll({
    offset: ['start end', 'start center'],
  });

  const { setStep } = useStep();

  const addScrollItem = useCallback<ScrollContext['addScrollItem']>(
    (data) => {
      if (scrollItems.find((item) => item.key === data.key)) return;
      return setScrollItems((prev) => [...prev, data]);
    },
    [scrollItems, setScrollItems]
  );

  const scrollToItem = useCallback<ScrollContext['scrollToItem']>(
    (item) => {
      const scrollItem = scrollItems.find((i) => i.key === `scroll-${item}`);

      if (scrollItem) {
        scrollItem.ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [scrollItems]
  );

  const handleChange = useCallback(
    (key: number | string) => {
      const item = scrollItems.find((i) => i.key === key);

      if (item) {
        setStep(item?.data?.step);
      }
    },
    [scrollItems, setStep]
  );

  const scrollItemsHeights = useMemo(() => {
    return scrollItems.map((s) => {
      return {
        key: s.key,
        rect: s.ref.current?.getBoundingClientRect(),
      };
    });
  }, [scrollItems]);

  const context = useMemo(
    () => ({
      scrollItems,
      addScrollItem,
      scrollToItem,
    }),
    [scrollItems, addScrollItem, scrollToItem]
  );

  useMotionValueEvent(scrollY, 'change', (v) => {
    const current = scrollItemsHeights.reduce(
      (acc, i) => {
        const currentH = i.rect?.height ?? 0;
        const h = acc.height + currentH;
        const accH = Math.max(acc.height - window.innerHeight * 0.5, 0);

        // console.log({ currentH, accHeight: acc.height, v });
        if (v < accH) {
          return {
            key: acc.key,
            height: acc.height,
          };
        }

        return {
          key: i.key,
          height: h,
        };
      },
      {
        key: scrollItemsHeights[0].key,
        height: 0,
      }
    );

    handleChange(current.key);
  });

  return (
    <Context.Provider key="scroll-provider" value={context}>
      {children}
    </Context.Provider>
  );
};

export function useScrollItems() {
  const { scrollItems } = useContext(Context);

  return scrollItems;
}

export function useScrollItem(key: string) {
  const { scrollItems } = useContext(Context);

  const scrollItem = scrollItems.find((item) => item.key === key);

  if (!scrollItem) {
    return {
      key,
      scrollX: motionValue<number>(0),
      scrollY: motionValue<number>(0),
      scrollXProgress: motionValue<number>(0),
      scrollYProgress: motionValue<number>(0),
    } as ScrollItem;
  }

  return scrollItem;
}

export function useAddScrollItem(data: ScrollItem) {
  const { addScrollItem } = useContext(Context);

  useIsomorphicLayoutEffect(() => {
    addScrollItem(data);
  }, [addScrollItem, data]);

  return null;
}

export const useScrollToItem = () => {
  const { scrollToItem } = useContext(Context);

  return useCallback(
    (key: string | number) => {
      scrollToItem(key);
    },
    [scrollToItem]
  );
};

export const useScrollToNextStep = () => {
  const { scrollToItem } = useContext(Context);

  return useCallback(
    (key: string | number) => {
      scrollToItem(key);
    },
    [scrollToItem]
  );
};
