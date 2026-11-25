import { useEffect } from 'react';

import { useMap } from 'react-map-gl';

type UseMapImageOptions = {
  url: string;
  name: string;
  sdf?: boolean;
};

type UseMapSvgImageOptions = {
  name: string;
  svg: string;
  pixelRatio?: number;
};

// `map.loadImage` can't decode SVG in every browser, so rasterize it through an <img>.
export function useMapSvgImage({ name, svg, pixelRatio = 2 }: UseMapSvgImageOptions) {
  const { default: map } = useMap();

  useEffect(() => {
    if (!map) return;
    const image = new Image();
    // Draw at `pixelRatio` size so the icon stays sharp on high-DPI screens.
    image.width = Number(svg.match(/width="([\d.]+)"/)?.[1] ?? 0) * pixelRatio;
    image.height = Number(svg.match(/height="([\d.]+)"/)?.[1] ?? 0) * pixelRatio;
    image.onload = () => {
      if (!map.hasImage(name)) map.addImage(name, image, { pixelRatio });
    };
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }, [map, name, svg, pixelRatio]);
}

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
