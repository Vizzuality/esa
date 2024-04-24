import { useCallback, useMemo } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';

import { layersSettingsAtom } from '@/store/map';

import { Switch } from '@/components/ui/switch';

import { LegendTypeSwitchProps } from '../../types';

const LegendTypeSwitch = ({
  layerId,
  param,
  layerTitle,
  title,
  ...props
}: LegendTypeSwitchProps) => {
  const layersSettings = useAtomValue(layersSettingsAtom);
  const checked = useMemo(() => layersSettings[layerId]?.[param], [layerId, layersSettings, param]);

  const setLayersSettings = useSetAtom(layersSettingsAtom);

  const handleChangeVisibility = useCallback(
    (checked: boolean) => {
      setLayersSettings((prev) => ({
        ...prev,
        [layerId]: {
          ...prev[layerId],
          [param]: checked,
        },
      }));
    },
    [layerId, setLayersSettings, param]
  );

  return (
    <div style={props.style} className="flex items-center justify-between gap-2">
      <div className="flex">
        <label
          className="font-open-sans cursor-pointer text-sm text-white"
          htmlFor={`${layerId}-switch`}
        >
          {props.color && (
            <span
              className="mr-2 inline-block h-3 w-3 rounded-sm"
              style={{ backgroundColor: props.color }}
            />
          )}
          {title || layerTitle}
        </label>
      </div>
      <Switch
        onCheckedChange={(c) => handleChangeVisibility(c)}
        value={layerId}
        checked={!!checked}
        defaultChecked={!!checked}
        id={`${layerId}-switch`}
      />
    </div>
  );
};

export default LegendTypeSwitch;
