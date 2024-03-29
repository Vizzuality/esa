import React, { useState } from 'react';

import ReactMapGL, { Marker, NavigationControl, ViewStateChangeEvent, useMap } from 'react-map-gl';

import Media from '../PluginMedia';
import { MarkerDragEvent, MarkerEvent } from 'react-map-gl/dist/esm/types';
import { LocationType, MarkerType } from '../../types';
import { MAPBOX_ACCESS_TOKEN, STYLE_ID, USERNAME } from '../../constants';

type MapProps = {
  id?: string;
  initialState: LocationType;
  markers: MarkerType[];
  handleMoveEnd: (_location: LocationType) => void;
  handleAddMarker: (e: mapboxgl.MapLayerMouseEvent) => void;
  handleDragMarker: (e: MarkerDragEvent<mapboxgl.Marker>, marker: MarkerType) => void;
  handleEditMarker: (marker: MarkerType) => void;
  isStoryMarker?: boolean;
};

const Map = ({
  id = 'default',
  initialState,
  markers,
  handleMoveEnd,
  handleAddMarker,
  handleDragMarker,
  handleEditMarker,
  isStoryMarker,
}: MapProps) => {
  const { [id]: map } = useMap();
  const [draggingMarker, setDraggingMarker] = useState<number | null>();

  /** Avoid unwanted click at the end of the drag event */
  const handleDragMarkerEnd = () => {
    setTimeout(() => setDraggingMarker(null), 500);
  };

  const onMoveEnd = (e: ViewStateChangeEvent) => {
    if (map) {
      const bbox = map
        .getBounds()
        .toArray()
        .flat()
        .map((v: number) => {
          return parseFloat(v.toFixed(2));
        }) as [number, number, number, number];
      handleMoveEnd({ ...e.viewState, bbox });
    }
  };

  const onClickMarker = (e: MarkerEvent<mapboxgl.Marker, MouseEvent>, marker: MarkerType) => {
    // Avoid map click event
    e.originalEvent.stopPropagation();
    // Story Markers are not editable
    if (isStoryMarker) return;
    // Avoid editing marker when dragging
    if (draggingMarker) return;
    handleEditMarker(marker);
  };

  return (
    <ReactMapGL
      id={id}
      initialViewState={initialState}
      mapStyle={`mapbox://styles/${USERNAME}/${STYLE_ID}`}
      mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      attributionControl={false}
      style={{ height: '500px', width: '100%' }}
      onMoveEnd={onMoveEnd}
      onClick={handleAddMarker}
      clickTolerance={10}
      minZoom={1}
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
            {isStoryMarker ? (
              <div
                style={{
                  backgroundColor: '#FFE094',
                  width: 16,
                  height: 16,
                  transform: 'rotate(45deg)',
                  border: '1.5px solid black',
                  boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
                }}
              ></div>
            ) : (
              <Media
                isDragging={draggingMarker === id}
                isMarker={!draggingMarker || draggingMarker === id}
                playable
                name={name}
                media={media}
              />
            )}
          </Marker>
        );
      })}
      <NavigationControl showZoom showCompass visualizePitch />
    </ReactMapGL>
  );
};

export default Map;
