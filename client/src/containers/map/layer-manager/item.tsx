import { useCallback, useEffect } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';

import { parseConfig } from '@/lib/json-converter';

import {
  LayersSettingsAtom,
  layersInteractiveAtom,
  layersInteractiveIdsAtom,
  layersSettingsAtom,
} from '@/store/map';

import { useGetLayersId } from '@/types/generated/layer';
import { LayerResponseDataObject } from '@/types/generated/strapi.schemas';
import { Config, LayerTyped } from '@/types/layers';

import DeckJsonLayer from '@/components/map/layers/deck-json-layer';
import MapboxLayer from '@/components/map/layers/mapbox-layer';

interface LayerManagerItemProps extends Required<Pick<LayerResponseDataObject, 'id'>> {
  beforeId: string;
  settings: Record<string, unknown>;
}

const LayerManagerItem = ({ id, beforeId, settings }: LayerManagerItemProps) => {
  const { data } = useGetLayersId(id, {
    populate: 'metadata',
  });
  const layersInteractive = useAtomValue(layersInteractiveAtom);
  const setLayersInteractive = useSetAtom(layersInteractiveAtom);
  const setLayersInteractiveIds = useSetAtom(layersInteractiveIdsAtom);

  const setLayersSettings = useSetAtom(layersSettingsAtom);

  const handleAddMapboxLayer = useCallback(
    ({ styles }: Config) => {
      if (!data?.data?.attributes) return null;

      const { interaction_config } = data.data.attributes as LayerTyped;

      if (interaction_config?.enabled) {
        const ids = styles.map((l) => l.id).filter((i) => !!i) as string[];

        if (layersInteractive.includes(id)) {
          return;
        }

        setLayersInteractive((prev) => [...prev, id]);
        setLayersInteractiveIds((prev) => {
          return [...prev, ...ids];
        });
      }
    },
    [data?.data?.attributes, id, layersInteractive, setLayersInteractive, setLayersInteractiveIds]
  );

  const handleRemoveMapboxLayer = useCallback(
    ({ styles }: Config) => {
      if (!data?.data?.attributes) return null;

      const { interaction_config } = data.data.attributes as LayerTyped;

      if (interaction_config?.enabled) {
        const ids = styles.map((l) => l.id);

        setLayersInteractive((prev) => prev.filter((i) => i !== id));
        setLayersInteractiveIds((prev) => prev.filter((i) => !ids.includes(i)));
      }
    },
    [data?.data?.attributes, id, setLayersInteractive, setLayersInteractiveIds]
  );

  useEffect(() => {
    if (data?.data?.attributes) {
      const { params_config } = data.data.attributes as LayerTyped;
      if (params_config?.length) {
        const newSettings = params_config.reduce((acc: LayersSettingsAtom, curr) => {
          return {
            ...acc,
            [curr.key as unknown as string]: curr.default,
          };
        }, {});
        setLayersSettings((prev) => ({ ...prev, [id]: newSettings }));
      }
    }
  }, [data?.data?.attributes, id, setLayersSettings]);

  if (!data?.data?.attributes) return null;

  const { type } = data.data.attributes as LayerTyped;

  if (type === 'mapbox') {
    const { config, params_config } = data.data.attributes;

    const c = parseConfig<Config>({
      config,
      params_config,
      settings,
    });

    if (!c) return null;

    return (
      <MapboxLayer
        id={`${id}-layer`}
        beforeId={beforeId}
        config={c}
        onAdd={handleAddMapboxLayer}
        onRemove={handleRemoveMapboxLayer}
      />
    );
  }

  if (type === 'deckgl') {
    const { config, params_config } = data.data.attributes;
    const c = parseConfig({
      // TODO: type
      config,
      params_config,
      settings,
    });

    return <DeckJsonLayer id={`${id}-layer`} beforeId={beforeId} config={c} />;
  }
};

export default LayerManagerItem;
