import { useCallback, useMemo } from 'react';

import { useRecoilValue, useSetRecoilState } from 'recoil';

import { layersSettingsAtom } from '@/store';

import { Switch } from '@/components/ui/switch';

type LegendTypeSwitchProps = {
  layerId: number;
  param: string;
  layerTitle: string;
};

const LegendTypeSwitch = ({ layerId, param, layerTitle, ...rest }: LegendTypeSwitchProps) => {
  const layersSettings = useRecoilValue(layersSettingsAtom);
  const checked = useMemo(() => layersSettings[layerId]?.[param], [layerId, layersSettings, param]);

  const setLayersSettings = useSetRecoilState(layersSettingsAtom);

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
