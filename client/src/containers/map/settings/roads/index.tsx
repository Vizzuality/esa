import { useCallback } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';

import { mapSettingsAtom } from '@/store/map';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const Roads = () => {
  const { roads } = useAtomValue(mapSettingsAtom);
  const setMapSettings = useSetAtom(mapSettingsAtom);

  const handleChange = useCallback(
    (v: boolean) => {
      setMapSettings((prev) => ({
        ...prev,
        roads: v,
      }));
    },
    [setMapSettings]
  );

  return (
    <div className="group flex grow items-center space-x-2">
      <Checkbox id="roads-checkbox" checked={roads} onCheckedChange={handleChange} />

      <Label
        className="cursor-pointer font-light transition-colors group-hover:text-slate-400"
        htmlFor="roads-checkbox"
      >
        Roads
      </Label>
    </div>
  );
};

export default Roads;
