import env from '@/env.mjs';

export const getImageSrc = (url?: string) => {
  if (!url) return '';
  if (url.includes('http')) {
    return url;
  }
<<<<<<< HEAD
  return `${env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${url}`;
=======
  return `${env.NEXT_PUBLIC_API_URL}${url}`;
>>>>>>> ebf3e15 (Update main (#52))
};
