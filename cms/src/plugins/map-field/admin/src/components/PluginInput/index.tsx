/**
 *
 * PluginInput
 *
 */

import React, { useCallback } from 'react';
import ReactMapGL, { NavigationControl, ViewStateChangeEvent } from 'react-map-gl';

import { useIntl } from 'react-intl';

import { Stack, Typography } from '@strapi/design-system';

import 'mapbox-gl/dist/mapbox-gl.css';

const PluginInput = ({
  name,
  intlLabel,
  value,
  onChange,
}) => {
  const { formatMessage } = useIntl();

  const initialViewState = value && JSON.parse(value) || null;

  const handleMoveEnd = useCallback((e: ViewStateChangeEvent) => {
    console.log({ target: { name, value: e.viewState, type: "json" } })
    onChange({ target: { name, value: JSON.stringify(e.viewState), type: "json" } });
  }, []);

  return (
    <Stack spacing={4}>
      <Typography
        textColor="neutral800"
        as="label"
        variant="pi"
        fontWeight="bold"
      >
        {formatMessage(intlLabel)}
      </Typography>

      <Typography
        textColor="neutral800"
        as="label"
        variant="pi"
      >
        {/* Explain that this map is for setting the location, zoom, rotation and tilt of the map. */}
        <ul>
          <li>This map is for setting the location, zoom and rotation of the map. You can use the controls in the top right to change the zoom and rotation.</li>
          <li>The same view you see here will be the same view your users will see.</li>
        </ul>
      </Typography>

      <ReactMapGL
        // {...value}
        initialViewState={initialViewState}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.STRAPI_ADMIN_MAPBOX_ACCESS_TOKEN}
        attributionControl={false}
        style={{ height:"500px", width:"100%" }}
        onMoveEnd={handleMoveEnd}
      >
        <NavigationControl
          showZoom
          showCompass
          visualizePitch
        />
      </ReactMapGL>
    </Stack>
  );
};

export default PluginInput;
