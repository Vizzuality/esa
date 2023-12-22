import React from 'react';
import { LocationType, MarkerType } from '../../types';
import {
  HEIGHT,
  MAPBOX_ACCESS_TOKEN,
  MARKER_ZOOM,
  MAX_PITCH,
  STYLE_ID,
  USERNAME,
  WIDTH,
} from '../../constants';

type StaticMapProps = {
  locationType: string;
  location?: LocationType;
  markers?: MarkerType[];
};

const StaticMap = ({ location, markers, locationType }: StaticMapProps) => {
  if (!location) return null;

  const { bearing, latitude, longitude, zoom, pitch } = location;
  const overlay = markers?.length
    ? `/${markers?.map(({ lat, lng }) => `pin-s+FFE094(${lng},${lat})`).join(',')}`
    : '';
  const mapStyle = `https://api.mapbox.com/styles/v1/${USERNAME}/${STYLE_ID}/static${overlay}/${longitude},${latitude},${
    locationType === 'marker' ? MARKER_ZOOM : zoom
  },${bearing},${Math.min(
    MAX_PITCH,
    pitch
  )}/${WIDTH}x${HEIGHT}@2x?access_token=${MAPBOX_ACCESS_TOKEN}`;

  return (
    <div>
      <img
        src={mapStyle}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          height: 'auto',
        }}
        width={WIDTH}
        height={HEIGHT}
        alt="map"
      />
    </div>
  );
};

export default StaticMap;
