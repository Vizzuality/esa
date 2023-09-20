import React, { useState } from 'react';

import ReactMapGL, { Marker, NavigationControl, ViewStateChangeEvent, useMap } from 'react-map-gl';

import Media from '../PluginMedia';
import { MarkerDragEvent, MarkerEvent } from 'react-map-gl/dist/esm/types';
import { LocationType, MarkerType } from '../../types';

const mapboxAccessToken = process.env.STRAPI_ADMIN_MAPBOX_ACCESS_TOKEN;

type MapProps = {
  id?: string;
  initialState: LocationType;
  markers: MarkerType[];
  handleMoveEnd: (_location: LocationType) => void;
  handleAddMarker: (e: mapboxgl.MapLayerMouseEvent) => void;
  handleDragMarker: (e: MarkerDragEvent<mapboxgl.Marker>, marker: MarkerType) => void;
  handleEditMarker: (marker: MarkerType) => void;
};

const Map = ({
  id = 'default',
  initialState,
  markers,
  handleMoveEnd,
  handleAddMarker,
  handleDragMarker,
  handleEditMarker,
}: MapProps) => {
  const { [id]: map } = useMap();
  const [draggingMarker, setDraggingMarker] = useState<number | null>();

  /** Avoid unwanted click at the end of the drag event */
  const handleDragMarkerEnd = () => {
    setTimeout(() => setDraggingMarker(null), 500);
  };

  const onMoveEnd = (e: ViewStateChangeEvent) => {
    if (map) {
      const bounds = map
        .getBounds()
        .toArray()
        .flat()
        .map((v: number) => {
          return parseFloat(v.toFixed(2));
        }) as [number, number, number, number];
      handleMoveEnd({ ...e.viewState, bounds });
    }
  };

  const onClickMarker = (e: MarkerEvent<mapboxgl.Marker, MouseEvent>, marker) => {
    e.originalEvent.stopPropagation();
    if (draggingMarker) return;
    handleEditMarker(marker);
  };

  return (
    <ReactMapGL
      id={id}
      initialViewState={initialState}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={mapboxAccessToken}
      attributionControl={false}
      style={{ height: '500px', width: '100%' }}
      onMoveEnd={onMoveEnd}
      onClick={handleAddMarker}
      clickTolerance={10}
    >
      {markers.map((marker) => {
        const { id, lat, lng, media, name } = marker;
        return (
          <Marker
            key={id}
            latitude={lat}
            longitude={lng}
            onDrag={(e) => handleDragMarker(e, marker)}
            onDragEnd={handleDragMarkerEnd}
            onDragStart={() => setDraggingMarker(id)}
            onClick={(e) => onClickMarker(e, marker)}
            draggable
            clickTolerance={0}
            style={{
              zIndex: draggingMarker === id ? 10 : 1,
            }}
          >
            <Media
              isDragging={draggingMarker === id}
              isMarker={!draggingMarker || draggingMarker === id}
              playable
              name={name}
              media={media}
            />
          </Marker>
        );
      })}
      <NavigationControl showZoom showCompass visualizePitch />
    </ReactMapGL>
  );
};

export default Map;
