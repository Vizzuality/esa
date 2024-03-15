import { useCallback, useMemo } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';

import { layersSettingsAtom } from '@/store/map';

import { Switch } from '@/components/ui/switch';

import { LegendTypeSwitchProps } from '../../types';

const LegendTypeSwitch = ({ layerId, param, layerTitle }: LegendTypeSwitchProps) => {
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
    <div className="bg-card-map rounded-full px-2 backdrop-blur-sm">
      <Switch
        onCheckedChange={(c) => handleChangeVisibility(c)}
        value={layerId}
        checked={!!checked}
        defaultChecked={!!checked}
        id={`${layerId}-switch`}
      />
      <label className="ml-3 cursor-pointer text-white" htmlFor={`${layerId}-switch`}>
        {layerTitle}
      </label>
    </div>
  );
};

export default LegendTypeSwitch;
