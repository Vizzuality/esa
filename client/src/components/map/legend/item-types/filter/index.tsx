import { useCallback, useMemo } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';

import { layersSettingsAtom } from '@/store/map';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { LegendTypeFilterProps } from '../../types';

const LegendTypeFilter = ({
  layerId,
  param,
  layerTitle,
  title,
  options,
  ...props
}: LegendTypeFilterProps) => {
  const layersSettings = useAtomValue(layersSettingsAtom);
  const value = useMemo(
    () => layersSettings[layerId]?.[param] as string | undefined,
    [layerId, layersSettings, param]
  );

  const setLayersSettings = useSetAtom(layersSettingsAtom);

  const handleChange = useCallback(
    (selected: string) => {
      setLayersSettings((prev) => ({
        ...prev,
        [layerId]: {
          ...prev[layerId],
          [param]: selected,
        },
      }));
    },
    [layerId, setLayersSettings, param]
  );

  return (
    <div style={props.style} className="mt-3 flex items-center gap-1.5">
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className="h-8 w-fit rounded-full border-white/20 bg-white/10 text-sm text-white focus:ring-0 focus:ring-offset-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {(title || layerTitle) && (
        <span className="text-sm font-semibold text-white">{title || layerTitle}</span>
      )}
    </div>
  );
};

export default LegendTypeFilter;
