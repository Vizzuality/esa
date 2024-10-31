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

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => window.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

export const useIsMobile = () => {
  const smSize = getThemeSize('sm');
  return useMediaQuery(`(max-width: ${smSize}px)`);
};
