import { useCallback, useMemo } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';

import { cn } from '@/lib/classnames';

import { layersSettingsAtom, layersAtom, DEFAULT_SETTINGS } from '@/store/map';

import MapLegendItem from '@/containers/map/legend/item';

import Legend from '@/components/map/legend';

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

  const ITEMS = useMemo(() => {
    return layers?.map((layer) => {
      const settings = layersSettings[layer] ?? { opacity: 1, visibility: true, expand: true };

      return (
        <MapLegendItem
          id={layer}
          key={layer}
          settings={settings}
          onChangeOpacity={(opacity: number) => {
            handleChangeOpacity(layer, opacity);
          }}
          onChangeVisibility={(visibility: boolean) => {
            handleChangeVisibility(layer, visibility);
          }}
          onChangeExpand={(expand: boolean) => {
            handleChangeExpand(layer, expand);
          }}
          sortable={{
            enabled: false,
            handle: false,
          }}
        />
      );
    });
  }, [layers, layersSettings, handleChangeOpacity, handleChangeVisibility, handleChangeExpand]);

  return (
    <div className="pointer-events-auto z-10 w-full">
      <Legend
        className={cn(
          'max-h-[calc(100vh_-_theme(space.16)_-_theme(space.6)_-_theme(space.48))] w-fit',
          className
        )}
        sortable={{
          enabled: false,
          handle: false,
        }}
        onChangeOrder={handleChangeOrder}
      >
        {ITEMS}
      </Legend>
    </div>
  );
};

export default MapLegends;
