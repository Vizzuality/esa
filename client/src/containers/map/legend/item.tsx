'use-client';

import { ReactElement, createElement, isValidElement, useMemo } from 'react';

import { useRecoilValue } from 'recoil';

import { parseConfig } from '@/lib/json-converter';

import { layersSettingsAtom } from '@/store';

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

const MapLegendItem = ({ id, ...props }: MapLegendItemProps) => {
  const layersSettings = useRecoilValue(layersSettingsAtom);

  const { data, isError, isFetched, isFetching, isPlaceholderData } = useGetLayersId(id, {
    populate: 'metadata',
  });

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

      const { type, ...props } = l;
      if (typeof type !== 'string' || !LEGEND_TYPE.includes(type as LegendType)) return;
      // TODO: Fix this type
      const LEGEND = LEGEND_TYPES[type as LegendType] as React.FC<any>;

      legends.push(createElement(LEGEND, props));
    });

    return legends;
  }, [legend_config, id, attributes?.title, params_config, layersSettings]);

  return LEGEND_COMPONENTS?.map((LEGEND_COMPONENT, i) => {
    const useLegendItem = legend_config?.[i]?.displayControllers !== false;
    return (
      <ContentLoader
        skeletonClassName="h-10"
        data={data?.data}
        isFetching={isFetching}
        isFetched={isFetched}
        isPlaceholderData={isPlaceholderData}
        isError={isError}
        key={`${id}-${i}`}
      >
        {useLegendItem ? (
          <LegendItem
            id={id}
            name={attributes?.title}
            settingsManager={settingsManager}
            {...props}
            InfoContent={!!metadata && <Metadata {...attributes} />}
          >
            {LEGEND_COMPONENT}
          </LegendItem>
        ) : (
          LEGEND_COMPONENT
        )}
      </ContentLoader>
    );
  });
};

export default MapLegendItem;
