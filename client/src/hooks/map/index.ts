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

const properties = [
  'boxZoom',
  'scrollZoom',
  'dragPan',
  'dragRotate',
  'keyboard',
  'doubleClickZoom',
  'touchZoomRotate',
];

export const setMapEnable = (map: mapboxgl.Map, enabled: boolean) => {
  if (!map) return;

  if (enabled) {
    properties.forEach((prop) => {
      // @ts-expect-error - TS doesn't know about these properties
      map[prop].enable();
    });
    const canvas = map.getCanvas();
    if (canvas) {
      canvas.style.cursor = 'pointer';
    }
  } else {
    properties.forEach((prop) => {
      // @ts-expect-error - TS doesn't know about these properties
      map[prop].disable();
    });
    map.getCanvas().style.cursor = 'default';
  }
};
