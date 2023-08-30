/**
 *
 * PluginInput
 *
 */

import React from 'react';
import Map from 'react-map-gl';

import { useIntl } from 'react-intl';

import { Stack, Typography } from '@strapi/design-system';

import 'mapbox-gl/dist/mapbox-gl.css';

console.log(process.env)

const PluginInput = ({
  name,
  intlLabel,
  value,
  onChange,
}) => {
  const { formatMessage } = useIntl();

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

      <Map
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.STRAPI_ADMIN_MAPBOX_ACCESS_TOKEN}
        attributionControl={false}
        style={{ height:"500px", width:"100%" }}
        onMove={(e) => {

        }}
      >
      </Map>
    </Stack>
  );
};

export default PluginInput;
