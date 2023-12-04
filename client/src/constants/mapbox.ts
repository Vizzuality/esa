import env from '@/env.mjs';

export const MAPBOX_STYLES = {
  default:
    env.NEXT_PUBLIC_ENVIRONMENT === 'production'
      ? 'mapbox://styles/vizzualityesa/clpb479bt007101o9cmnn1dq9?fresh=true'
      : 'mapbox://styles/vizzualityesa/clpb479bt007101o9cmnn1dq9?fresh=3',
};
