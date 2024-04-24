'use-client';

import { ReactElement, createElement, isValidElement, useMemo } from 'react';

import { useAtomValue } from 'jotai';

import { parseConfig } from '@/lib/json-converter';

import { layersSettingsAtom } from '@/store/map';

import { LayerTyped, LegendConfig } from '@/types/layers';
import { LEGEND_TYPE, LegendType } from '@/types/map';

import Metadata from '@/containers/metadata';

import LegendItem from '@/components/map/legend/item';
import {
  LegendTypeBasic,
  LegendTypeChoropleth,
  LegendTypeGradient,
  LegendTypeTimeline,
} from '@/components/map/legend/item-types';
import LegendTypeSwitch from '@/components/map/legend/item-types/switch';
import { LegendItemProps, LegendTypesProps, SettingsManager } from '@/components/map/legend/types';
import ContentLoader from '@/components/ui/loader';

type LEGEND_TYPES_T = {
  [key in LegendType]: React.FC<LegendTypesProps<key>>;
};

const LEGEND_TYPES: LEGEND_TYPES_T = {
  basic: LegendTypeBasic,
  choropleth: LegendTypeChoropleth,
  gradient: LegendTypeGradient,
  timeline: LegendTypeTimeline,
  switch: LegendTypeSwitch,
};

type MapLegendItemProps = LegendItemProps & {
  isFetching: boolean;
  isFetched: boolean;
  isError: boolean;
};

const getSettingsManager = (data: LayerTyped = {} as LayerTyped): SettingsManager => {
  const { params_config, legend_config, metadata } = data;

  if (!params_config?.length) return {};
  const p = params_config.reduce((acc: Record<string, boolean>, { key }) => {
    if (!key) return acc;
    return {
      ...acc,
      [`${key}`]: true,
    };
  }, {});

  return {
    ...p,
    info: !!metadata,
    expand: !!legend_config,
  };
};

const MapLegendItem = ({ id, layer, ...legendProps }: MapLegendItemProps) => {
  const layersSettings = useAtomValue(layersSettingsAtom);

  const legend_config = layer?.legend_config as LegendConfig;

  const params_config = layer?.params_config;
  const metadata = layer?.metadata;
  const settingsManager = getSettingsManager(layer as LayerTyped);

  const LEGEND_COMPONENT = useMemo(() => {
    const l = parseConfig<LegendConfig | ReactElement | null>({
      config: { ...legend_config, layerId: id, layerTitle: layer?.title },
      params_config,
      settings: layersSettings[id] ?? {},
    });

    if (!l) return;

    if (isValidElement(l)) {
      return l;
    }

    const { type, ...props } = l as LegendConfig;
    if (typeof type !== 'string' || !LEGEND_TYPE.includes(type as LegendType)) return;
    // TODO: Fix this type
    const LEGEND = LEGEND_TYPES[type as LegendType] as React.FC<any>;
    const LegendElement = createElement(LEGEND, props);
    if (!isValidElement(LegendElement)) return;
    if (props.displayControllers) {
      return (
        <LegendItem
          key={id}
          id={id}
          name={legend_config?.title || layer?.title}
          settingsManager={settingsManager}
          {...props}
          {...legendProps}
          InfoContent={!!metadata && <Metadata {...(layer as LayerTyped)} />}
        >
          {LegendElement}
        </LegendItem>
      );
    } else {
      return LegendElement;
    }
  }, [
    legend_config,
    id,
    layer,
    params_config,
    layersSettings,
    settingsManager,
    legendProps,
    metadata,
  ]);

  return (
    <ContentLoader
      skeletonClassName="h-10"
      data={layer}
      isFetching={legendProps.isFetching}
      isFetched={legendProps.isFetched}
      isPlaceholderData={false}
      isError={legendProps.isError}
    >
      {LEGEND_COMPONENT}
    </ContentLoader>
  );
};

export default MapLegendItem;
