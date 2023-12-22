import React, { useMemo } from 'react';
import { Typography, Flex, Box } from '@strapi/design-system';
import { useMap } from 'react-map-gl';
import { CONTROLS } from '../../constants';

type MapInputsProps = {
  inputs?: [string, number][];
  handleChange: (key: string, value: number) => void;
  locationType?: string;
};

const MapInputs = ({ inputs, handleChange, locationType }: MapInputsProps) => {
  const { default: map } = useMap();

  const onChange = (key: string, value: number) => {
    if (locationType === 'map' && map) {
      switch (key) {
        case 'latitude':
          map?.setCenter([map.getCenter().lng, value]);
          break;
        case 'longitude':
          map?.setCenter([value, map.getCenter().lat]);
          break;
        case 'zoom':
          map?.setZoom(value);
          break;
        case 'bearing':
          map?.setBearing(value);
          break;
        case 'pitch':
          map?.setPitch(value);
          break;
        default:
          break;
      }
    }
    handleChange(key, Number(value));
  };

  return (
    <Flex gap={4} paddingTop={2}>
      {!!inputs &&
        inputs.map(([key, value]) => (
          <Box key={key}>
            <label htmlFor={key} style={{ display: 'block', marginBottom: 4 }}>
              <Typography textColor="neutral800" as="label" variant="pi">
                {key}
              </Typography>
            </label>
            <input
              id={key}
              step="any"
              max={CONTROLS[key]?.max}
              min={CONTROLS[key]?.min}
              type="number"
              name={key}
              value={value?.toFixed(4)}
              onChange={(e) => onChange(key, e.target.valueAsNumber)}
              style={{ maxWidth: '300px', width: '100%' }}
              inputMode="decimal"
              pattern="\d*"
              formNoValidate={true}
            />
          </Box>
        ))}
    </Flex>
  );
};

export default MapInputs;
