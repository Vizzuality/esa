'use client';

import { useCallback, useMemo, useRef } from 'react';

import ReactMapGL, { Layer, MapRef, Source } from 'react-map-gl';

import env from '@/env.mjs';

import { cn } from '@/lib/classnames';
import { pointToRoundedSquare } from '@/lib/mini-globe';

import { MAPBOX_STYLES } from '@/constants/map';

interface MiniGlobeProps {
  id: string;
  longitude: number;
  latitude: number;
  onClick: () => void;
  className?: string;
  size?: number;
  squareSizeKm?: number;
  cornerRadiusKm?: number;
}

const MiniGlobe = ({
  id,
  longitude,
  latitude,
  onClick,
  className,
  size = 100,
  squareSizeKm = 300,
  cornerRadiusKm = 150,
}: MiniGlobeProps): JSX.Element => {
  const mapRef = useRef<MapRef>(null);

  const targetZoom = 0;
  const referenceZoom = 2.0;

  const effectiveSquareSizeKm = useMemo(() => {
    const factor = Math.pow(2, referenceZoom - targetZoom);
    return squareSizeKm * factor;
  }, [squareSizeKm, targetZoom]);

  const square = useMemo(
    () => pointToRoundedSquare(longitude, latitude, effectiveSquareSizeKm, cornerRadiusKm, 12),
    [longitude, latitude, effectiveSquareSizeKm, cornerRadiusKm]
  );

  const handleLoad = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    map.getStyle().layers.forEach((layer) => {
      if (layer.type === 'symbol') map.setLayoutProperty(layer.id, 'visibility', 'none');
    });

    map.easeTo({
      center: [longitude, latitude],
      zoom: targetZoom,
      pitch: 0,
      offset: [1.5, 1.5],
      duration: 900,
      essential: true,
    });
  }, [longitude, latitude, targetZoom]);

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
        'cursor-pointer rounded-full bg-transparent outline-dashed outline-1 outline-offset-4 outline-gray-200',
        '[&_.mapboxgl-ctrl-attrib]:!hidden [&_.mapboxgl-ctrl-logo]:!hidden',
        className
      )}
      style={{ width: size, height: size }}
    >
      <div className="h-full w-full overflow-hidden rounded-full bg-transparent hover:scale-[1.05]">
        <ReactMapGL
          ref={mapRef}
          id={id}
          mapStyle={MAPBOX_STYLES.default}
          mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
          initialViewState={{ longitude, latitude, zoom: 2 }}
          projection={{ name: 'globe' }}
          interactive={false}
          attributionControl={false}
          onLoad={handleLoad}
          style={{ width: '100%', height: '100%' }}
        >
          <Source id={`${id}-square`} type="geojson" data={square}>
            <Layer
              id={`${id}-square-fill`}
              type="fill"
              paint={{ 'fill-color': '#008E7A', 'fill-opacity': 0.08 }}
            />
            <Layer
              id={`${id}-square-line`}
              type="line"
              paint={{
                'line-color': '#008E7A',
                'line-opacity': 0.7,
                'line-width': 2,
              }}
            />
          </Source>
        </ReactMapGL>
      </div>
    </div>
  );
};

export default MiniGlobe;
