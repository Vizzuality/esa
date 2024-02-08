import { useFilters } from '@/store/home';

import { Button } from '@/components/ui/button';
import { CheckboxButton } from '@/components/ui/checkbox-button';

type FilterItemProps = {
  filter: {
    title: string;
    id: string;
    options: { name: string; id: string }[];
  };
};

const FilterItem = ({ filter: { id, options, title } }: FilterItemProps) => {
  const [filters, setFilters] = useFilters();

  const filter = filters[id as keyof typeof filters];

  const setFilter = (value: string[] | null) => setFilters({ ...filters, [id]: value });

  const handleChangeFilter = (id: string) => {
    if (!filter?.includes(id)) {
      setFilter([...(filter || []), id]);
    } else {
      setFilter(filter?.filter((item) => item !== id) || null);
    }
  };

  return (
    <div key={id} className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-200">{title}</h3>
        <Button size="sm" variant="link" onClick={() => setFilter(null)}>
          Unselect all
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map(({ id: optionId, name }) => {
          return (
            <CheckboxButton
              key={optionId}
              checked={filter?.includes(optionId)}
              value={id}
              onCheckedChange={() => handleChangeFilter(optionId)}
              label={name}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FilterItem;
