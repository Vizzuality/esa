'use-client';

import { ReactElement, createElement, isValidElement, useMemo } from 'react';

import { useAtomValue } from 'jotai';

import { parseConfig } from '@/lib/json-converter';

import { layersSettingsAtom } from '@/store/map';

import { useGetLayersId } from '@/types/generated/layer';
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

type MapLegendItemProps = LegendItemProps;

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

const MapLegendItem = ({ id, ...legendProps }: MapLegendItemProps) => {
  const { data, isError, isFetched, isFetching, isPlaceholderData } = useGetLayersId(id, {
    populate: 'metadata',
  });

  const layersSettings = useAtomValue(layersSettingsAtom);

  const attributes = data?.data?.attributes as LayerTyped;

  const legend_config = useMemo(() => {
    if (!attributes?.legend_config) return [];
    return Array.isArray(attributes?.legend_config)
      ? attributes.legend_config
      : [attributes.legend_config];
  }, [attributes?.legend_config]);

  const params_config = attributes?.params_config;
  const metadata = attributes?.metadata;
  const settingsManager = getSettingsManager(attributes);

  const LEGEND_COMPONENTS = useMemo(() => {
    const legends: ReactElement[] = [];
    legend_config?.forEach((lc: LegendConfig) => {
      const l = parseConfig<LegendConfig | ReactElement | null>({
        config: { ...lc, layerId: id, layerTitle: attributes?.title },
        params_config,
        settings: layersSettings[id] ?? {},
      });

      if (!l) return;

      if (isValidElement(l)) {
        legends.push(l);
      }

      const { type, ...props } = l as LegendConfig;
      if (typeof type !== 'string' || !LEGEND_TYPE.includes(type as LegendType)) return;
      // TODO: Fix this type
      const LEGEND = LEGEND_TYPES[type as LegendType] as React.FC<any>;
      const LegendElement = createElement(LEGEND, props);
      if (!isValidElement(LegendElement)) return;
      if (props.displayControllers) {
        legends.push(
          <LegendItem
            id={id}
            name={attributes?.title}
            settingsManager={settingsManager}
            {...props}
            {...legendProps}
            InfoContent={!!metadata && <Metadata {...attributes} />}
          >
            {LegendElement}
          </LegendItem>
        );
        return;
      }
      legends.push(LegendElement);
    });

    return legends;
  }, [
    legend_config,
    id,
    attributes,
    params_config,
    layersSettings,
    settingsManager,
    legendProps,
    metadata,
  ]);

  return (
    <ContentLoader
      skeletonClassName="h-10"
      data={data?.data}
      isFetching={isFetching}
      isFetched={isFetched}
      isPlaceholderData={isPlaceholderData}
      isError={isError}
    >
      {LEGEND_COMPONENTS}
    </ContentLoader>
  );
};

export default MapLegendItem;
