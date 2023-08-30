import { useRecoilState, useResetRecoilState } from 'recoil';

import { FilterName, filterSelector } from '@/store/home';

import { Button } from '@/components/ui/button';
import { CheckboxButton } from '@/components/ui/checkbox-button';

type FilterItemProps = {
  filter: {
    title: string;
    id: FilterName;
    options: { name: string; id: string }[];
  };
};

const FilterItem = ({ filter: { id, options, title } }: FilterItemProps) => {
  const [filter, setFilter] = useRecoilState(filterSelector(id));
  const resetFilter = useResetRecoilState(filterSelector(id));

  const handleChangeFilter = (id: string, checked: boolean) => {
    if (filter.length === 1 && !checked) {
      resetFilter();
      return;
    }
    setFilter((prev) => {
      if (checked) {
        return [...prev, id];
      }
      return prev.filter((item) => item !== id);
    });
  };

  return (
    <div key={id} className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-200">{title}</h3>
        <Button size="sm" variant="link" onClick={resetFilter}>
          Unselect all
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map(({ id: optionId, name }) => {
          return (
            <CheckboxButton
              key={optionId}
              checked={filter.includes(optionId)}
              value={id}
              onCheckedChange={(checked: boolean) => handleChangeFilter(optionId, checked)}
              label={name}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FilterItem;
