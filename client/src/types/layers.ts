import { CSSProperties } from 'react';

import { SourceProps as RMSSourceProps, LayerProps as RMLayerProps } from 'react-map-gl';

import { FormatProps } from '@/lib/utils/formats';

import type { Layer } from '@/types/generated/strapi.schemas';

import { LegendType } from './map';

export type Config = {
  source: RMSSourceProps;
  styles: RMLayerProps[];
};

export type ParamsConfigValue = {
  key: string;
  default: unknown;
};

export type ParamsConfig = ParamsConfigValue[];

export type LegendConfig = {
  displayControllers?: boolean;
  type: LegendType;
  style?: CSSProperties;
  items: {
    value: string;
    color: string;
  }[];
};

export type InteractionConfig = {
  enabled: boolean;
  events: {
    type: 'click' | 'hover';
    values: {
      key: string;
      label: string;
      format?: FormatProps;
    }[];
  }[];
};

export type LayerProps = {
  id?: string;
  zIndex?: number;
  onAdd?: (props: Config) => void;
  onRemove?: (props: Config) => void;
};

export type LayerTyped = Layer & {
  config: Config;
  params_config: ParamsConfig;
  legend_config: LegendConfig[];
  interaction_config: InteractionConfig;
  metadata: Record<string, unknown>;
};
