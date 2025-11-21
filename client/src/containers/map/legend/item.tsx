'use-client';

import { ReactElement, createElement, isValidElement, useMemo } from 'react';

import { useAtomValue } from 'jotai';

import { parseConfig } from '@/lib/json-converter';

import { layersSettingsAtom } from '@/store/map';

import { LegendConfig } from '@/types/layers';
import { LEGEND_TYPE, LegendType } from '@/types/map';

import {
  LegendTypeBasic,
  LegendTypeCategorical,
  LegendTypeChoropleth,
  LegendTypeGradient,
  LegendTypeTimeline,
} from '@/components/map/legend/item-types';
import LegendTypeSwitch from '@/components/map/legend/item-types/switch';
import { LegendItemProps, LegendTypesProps } from '@/components/map/legend/types';
import ContentLoader from '@/components/ui/loader';

type LEGEND_TYPES_T = {
  [key in LegendType]: React.FC<LegendTypesProps<key>>;
};

const LEGEND_TYPES: LEGEND_TYPES_T = {
  basic: LegendTypeBasic,
  categorical: LegendTypeCategorical,
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

const MapLegendItem = ({ id, layer, ...legendProps }: MapLegendItemProps) => {
  const layersSettings = useAtomValue(layersSettingsAtom);

  const legend_config = layer?.legend_config as LegendTypesProps<any>;
  const legendType = legend_config?.type;

  const params_config = layer?.params_config;

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

    const { type, ...props } = l as LegendTypesProps<typeof legendType>;
    if (typeof type !== 'string' || !LEGEND_TYPE.includes(type as LegendType)) return;
    // TODO: Fix this type
    const LEGEND = LEGEND_TYPES[type as LegendType] as React.FC<any>;
    const elementProps = {
      ...props,
      title: props.title || layer?.title,
      info: props.info || layer?.metadata?.description,
    };
    const LegendElement = createElement(LEGEND, elementProps);
    if (!isValidElement(LegendElement)) return;

    return LegendElement;
  }, [legend_config, id, layer, params_config, layersSettings]);

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
