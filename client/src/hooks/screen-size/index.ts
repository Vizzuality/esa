import { useMediaMatch } from 'rooks';
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

export const useBreakpoint = (size: string) => {
  const themeSize = getThemeSize(size);
  return useMediaMatch(`(max-width: ${themeSize}px)`);
};

export const useIsMobile = () => {
  const mobileSize = getThemeSize('sm');
  const isMobile = useMediaMatch(`(max-width: ${mobileSize}px)`);
  return isMobile;
};
