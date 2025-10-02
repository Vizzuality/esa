'use client';

import { Layer } from 'react-map-gl';

import { useAtomValue } from 'jotai';

import { layersAtom, layersSettingsAtom } from '@/store/map';

import LayerManagerItem from '@/containers/map/layer-manager/item';

import { DeckMapboxOverlayProvider } from '@/components/map/provider';

const LayerManager = () => {
  const layers = useAtomValue(layersAtom);
  const layersSettings = useAtomValue(layersSettingsAtom);

  return (
    <DeckMapboxOverlayProvider>
      <>
        {/*
          Generate all transparent backgrounds to be able to sort by layers without an error
          - https://github.com/visgl/react-map-gl/issues/939#issuecomment-625290200
        */}
        {layers.map((l, i) => {
          const beforeId = i === 0 ? 'custom-layers' : `${layers[i - 1]}-layer`;
          return (
            <Layer
              id={`${l}-layer`}
              key={l}
              type="background"
              layout={{ visibility: 'none' }}
              beforeId={beforeId}
            />
          );
        })}

        {/*
          Loop through active layers. The id is gonna be used to fetch the current layer and know how to order the layers.
          The first item will always be at the top of the layers stack
        */}
        {layers.map((l) => {
          const beforeId = `${l}-layer`;
          return (
            <LayerManagerItem
              key={`${l}-layer-${beforeId}`}
              id={l}
              beforeId={beforeId}
              settings={layersSettings?.[l]}
            />
          );
        })}
      </>
    </DeckMapboxOverlayProvider>
  );
};

export default LayerManager;
