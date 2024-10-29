import { useEffect, useState } from 'react';

import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfig from '@/../tailwind.config';
const { theme } = resolveConfig(tailwindConfig);

const getThemeSize = (size: string) => {
  if (theme?.screens && size in theme?.screens) {
    const screenSize = (theme?.screens?.[size as keyof typeof theme.screens] as string)?.replace(
      'px',
      ''
    );
    if (isFinite(Number(screenSize))) {
      return Number(screenSize);
    }
  }
  return 1;
};

export const useBreakpoint = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    setWidth(window.innerWidth);

    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (screenSize: string) => {
    return width >= getThemeSize(screenSize);
  };
};
