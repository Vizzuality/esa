import { CSSProperties, PropsWithChildren, ReactNode } from 'react';

import { DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListeners } from '@dnd-kit/core/dist/hooks/utilities';
import { LucideIcon } from 'lucide-react';

import { Layer } from '@/types/generated/strapi.schemas';
import { LegendType } from '@/types/map';

type Sortable = {
  enabled: boolean;
  handle?: boolean;
  handleIcon?: React.ReactNode;
};

type OnChangeOrder = (id: string[]) => void;
type OnChangeOpacity = (opacity: number) => void;
type OnChangeVisibility = (visibility: boolean) => void;
type OnChangeExpand = (expand: boolean) => void;
type OnChangeColumn = (column: string) => void;

export type Settings = Record<string, unknown> & {
  opacity?: number;
  visibility?: boolean;
  expand?: boolean;
};

export type SettingsManager = {
  opacity?: boolean;
  visibility?: boolean;
  expand?: boolean;
  info?: boolean;
};

export type LegendItemEvents = {
  onChangeOpacity?: OnChangeOpacity;
  onChangeVisibility?: OnChangeVisibility;
  onChangeExpand?: OnChangeExpand;
  onChangeColumn?: OnChangeColumn;
};
/*
 * Legend
 */
export interface LegendProps extends PropsWithChildren {
  className?: string;
  sortable: Sortable;
  onChangeOrder?: OnChangeOrder;
}

export interface LegendItemProps extends LegendItemEvents {
  id: number;
  name?: string;
  className?: string;

  // components
  InfoContent?: ReactNode;

  // sortable
  sortable?: Sortable;
  listeners?: SyntheticListeners;
  attributes?: DraggableAttributes;
  displayControllers?: boolean;

  // settings
  // I extends Dataset['id'] so you can get the correct setting depending on the dataset id
  settings?: Settings;
  settingsManager?: SettingsManager;

  layer?: Layer;
}

export interface LegendItemToolbarProps extends LegendItemEvents {
  className?: string;
  // components
  InfoContent?: ReactNode;
  // settings
  settings?: Settings;
  settingsManager?: SettingsManager;
}

export interface LegendItemButtonProps {
  Icon: LucideIcon;
  selected?: boolean;
  className?: string;
  value?: number;
}

/*
 * Sortable
 */
export interface SortableListProps extends PropsWithChildren {
  className?: string;
  sortable: Sortable;
  onChangeOrder: OnChangeOrder;
}

export interface SortableItemProps extends PropsWithChildren {
  id: string;
  sortable: Sortable;
}

export interface Legend {
  className?: string;
  title?: string;
  style?: CSSProperties;
  info?: string;
  type: LegendType;
}

export interface LegendTypeProps extends Legend {
  items: Array<{
    value: string;
    color: string;
  }>;
  title?: string;
}

export interface LegendTypeTimelineProps extends Legend {
  description?: string;
  id: number;
  layerId: number;
  interval?: number;
  start: string;
  end: string;
  dateType?: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second';
  format?: string;
  animationInterval?: number;
  labels?: string[];
}

export interface LegendMatrixIntersectionsProps extends Legend {
  intersections: Array<{
    id: number;
    color: string;
  }>;
}

export interface LegendTypeSwitchProps extends Legend {
  layerId: number;
  param: string;
  layerTitle: string;
  color?: string;
  title?: string;
}

type ItemLegends = Extract<LegendType, 'basic' | 'choropleth' | 'gradient'>;

export type LegendTypesProps<T> = T extends ItemLegends
  ? LegendTypeProps
  : T extends 'basic' | 'choropleth' | 'gradient'
  ? LegendTypeProps
  : T extends 'timeline'
  ? LegendTypeTimelineProps
  : T extends 'switch'
  ? LegendTypeSwitchProps
  : T extends 'matrix'
  ? LegendMatrixIntersectionsProps
  : never;
