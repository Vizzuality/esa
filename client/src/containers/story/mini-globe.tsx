'use client';

import { useCallback, useRef } from 'react';

import ReactMapGL, { MapRef } from 'react-map-gl';

import { cn } from '@/lib/classnames';

import env from '@/env.mjs';

import { MAPBOX_STYLES } from '@/constants/map';

import { Bbox } from '@/types/map';

interface MiniGlobeProps {
  id: string;
  longitude: number;
  latitude: number;
  bbox: Bbox;
  onClick: () => void;
  className?: string;
  size?: number;
}

const MiniGlobe = ({
  id,
  longitude,
  latitude,
  bbox,
  onClick,
  className,
  size = 100,
}: MiniGlobeProps): JSX.Element => {
  const mapRef = useRef<MapRef>(null);

  const handleLoad = useCallback(() => {
    const mapInstance = mapRef.current?.getMap();
    if (!mapInstance || !bbox) return;

    mapInstance.getStyle().layers.forEach((layer) => {
      if (layer.type === 'symbol') {
        mapInstance.setLayoutProperty(layer.id, 'visibility', 'none');
      }
    });

    mapInstance.fitBounds(
      [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[3]],
      ],
      { animate: false, padding: 10 }
    );
  }, [bbox]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Back to globe"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
      className={cn(
        'overflow-hidden rounded-full border-2 border-dashed border-white/50 cursor-pointer [&_.mapboxgl-ctrl-logo]:!hidden [&_.mapboxgl-ctrl-attrib]:!hidden',
        className
      )}
      style={{ width: size, height: size }}
    >
      <ReactMapGL
        ref={mapRef}
        id={id}
        mapStyle={MAPBOX_STYLES.default}
        mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
        initialViewState={{
          longitude,
          latitude,
          zoom: 2,
        }}
        projection={{ name: 'globe' }}
        interactive={false}
        dragPan={false}
        scrollZoom={false}
        dragRotate={false}
        doubleClickZoom={false}
        touchZoomRotate={false}
        keyboard={false}
        attributionControl={false}
        onLoad={handleLoad}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default MiniGlobe;
