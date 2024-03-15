import { useCallback, useMemo } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';

import { cn } from '@/lib/classnames';

import { layersSettingsAtom, layersAtom, DEFAULT_SETTINGS } from '@/store/map';
<<<<<<< HEAD

import { useGetLayers } from '@/types/generated/layer';
import { Layer } from '@/types/generated/strapi.schemas';
import { LegendConfig } from '@/types/layers';
=======
>>>>>>> ebf3e15 (Update main (#52))

import MapLegendItem from '@/containers/map/legend/item';

import Legend from '@/components/map/legend';
import { Settings } from '@/components/map/legend/types';

type LegendProps = Layer & {
  id: number;
  settings: Settings;
};

const MapLegends = ({ className = '' }) => {
  const layers = useAtomValue(layersAtom);
  const setLayers = useSetAtom(layersAtom);
  const layersSettings = useAtomValue(layersSettingsAtom);
  const setLayersSettings = useSetAtom(layersSettingsAtom);

  const handleChangeOrder = useCallback(
    (order: string[]) => {
      const newLayers: number[] = order.reduce((prev: number[], curr) => {
        const id = layers.find((layer) => layer === Number(curr));
        return !!id ? [...prev, id] : prev;
      }, []);

      setLayers(newLayers);
    },
    [layers, setLayers]
  );

  const handleChangeOpacity = useCallback(
    (id: number, opacity: number) =>
      setLayersSettings((prev) => ({
        ...prev,
        [id]: {
          ...DEFAULT_SETTINGS,
          ...prev[id],
          opacity,
        },
      })),
    [setLayersSettings]
  );

  const handleChangeVisibility = useCallback(
    (id: number, visibility: boolean) =>
      setLayersSettings((prev) => ({
        ...prev,
        [id]: {
          ...DEFAULT_SETTINGS,
          ...prev[id],
          visibility,
        },
      })),
    [setLayersSettings]
  );

  const handleChangeExpand = useCallback(
    (id: number, expand: boolean) =>
      setLayersSettings((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          expand,
        },
      })),
    [setLayersSettings]
  );

<<<<<<< HEAD
  const {
    data: layersData,
    isFetching,
    isFetched,
    isError,
  } = useGetLayers(
    {
      filters: {
        id: {
          $in: layers,
        },
      },
    },
    {
      query: {
        enabled: !!layers.length,
      },
    }
  );
=======
  const ITEMS = useMemo(() => {
    return layers?.map((layer) => {
      const settings = layersSettings[layer] ?? { opacity: 1, visibility: true, expand: true };
>>>>>>> ebf3e15 (Update main (#52))

  const LEGENDS = useMemo(() => {
    return layersData?.data?.reduce<LegendProps[]>((acc, curr) => {
      const layerId = curr.id;
      const legends = curr?.attributes?.legend_config;

      // IF legends is an array, return it, otherwise, create an array with the object
      const legendsConfig: LegendConfig[] = Array.isArray(legends)
        ? legends
        : typeof legends === 'object'
        ? [legends]
        : [];

      if (!layerId || !curr?.attributes || !legends || !legendsConfig.length) return acc;

      const settings = layersSettings[layerId] ?? { opacity: 1, visibility: true, expand: true };

      // Extract all legends from a layer
      const layerLegends = legendsConfig.map((legend) => ({
        ...curr.attributes,
        settings,
        id: layerId,
        legend_config: legend,
      })) as LegendProps[];

      return [...acc, ...layerLegends];
    }, []);
  }, [layersData?.data, layersSettings]);

  return (
    <Legend
      className={cn('pointer-events-auto z-10 sm:min-w-[280px] sm:max-w-[400px] ', className)}
      sortable={{
        enabled: false,
        handle: false,
      }}
      onChangeOrder={handleChangeOrder}
      key={layers?.join('-')}
    >
      {LEGENDS?.map((legend, index) => (
        <MapLegendItem
          id={legend.id}
          key={`${legend.id}-${index}`}
          layer={legend}
          settings={legend.settings}
          onChangeOpacity={(opacity: number) => {
            handleChangeOpacity(legend.id, opacity);
          }}
          onChangeVisibility={(visibility: boolean) => {
            handleChangeVisibility(legend.id, visibility);
          }}
          onChangeExpand={(expand: boolean) => {
            handleChangeExpand(legend.id, expand);
          }}
          isFetching={isFetching}
          isFetched={isFetched}
          isError={isError}
          sortable={{
            enabled: false,
            handle: false,
          }}
        />
      ))}
    </Legend>
  );
};

export default MapLegends;
