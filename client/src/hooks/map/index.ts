import { useEffect } from 'react';

import { useMap } from 'react-map-gl';

type UseMapImageOptions = {
  url: string;
  name: string;
  sdf?: boolean;
};

export function useMapImage({ url, name, sdf = false }: UseMapImageOptions) {
  const { default: map } = useMap();

  useEffect(() => {
    if (map) {
      map.loadImage(url, (error, image) => {
        if (error) throw error;
        if (!map.hasImage(name) && image) map.addImage(name, image, { sdf });
      });
    }
  }, [map, url, name, sdf]);
}
