import env from '@/env.mjs';

export const getImageSrc = (url?: string) =>
  env.NEXT_PUBLIC_ENVIRONMENT === 'development'
    ? `${env.NEXT_PUBLIC_API_URL.replace('/api', '')}${url}`
    : url || '';
