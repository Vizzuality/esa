import { useSyncFilters } from '@/store/globe';

import { IfiListResponseDataItem, TagListResponseDataItem } from '@/types/generated/strapi.schemas';

import { Button } from '@/components/ui/button';
import { CheckboxButton } from '@/components/ui/checkbox-button';

type StatusOptions = {
  attributes: { name: string };
  id: string;
};

type FilterItemProps = {
  filter: {
    title: string;
    id: string;
    options: (IfiListResponseDataItem | TagListResponseDataItem | StatusOptions)[];
  };
};

const FilterItem = ({ filter: { id, options, title } }: FilterItemProps) => {
  const [filters, setFilters] = useSyncFilters();

  const filter: (string | number)[] | null = filters[id as keyof typeof filters];

  const setFilter = (value: (string | number)[] | null) => setFilters({ ...filters, [id]: value });

  const handleChangeFilter = (optionId: string | number) => {
    if (!filter?.includes(optionId)) {
      setFilter([...(filter || []), optionId]);
    } else {
      setFilter(filter?.filter((item) => item !== optionId) || null);
    }
  };

  const isMoreThanOneSelected = !!filter && filter.length > 1;

  const handleSelectAll = () => {
    if (isMoreThanOneSelected) {
      setFilter([]);
    } else {
      setFilter(
        options.reduce<(string | number)[]>((acc, { id }) => (!!id ? [...acc, id] : acc), [])
      );
    }
  };

  return (
    <div key={id} className="space-y-4">
      <div className="flex items-center justify-between text-gray-200">
        <h3 className="font-notes text-sm font-bold uppercase tracking-widest text-gray-700">
          {title}
        </h3>
        <Button
          className="font-open-sans text-sm"
          size="sm"
          variant="link"
          onClick={handleSelectAll}
        >
          {isMoreThanOneSelected ? 'Unselect all' : 'Select all'}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map(({ id: optionId, attributes }) => {
          if (!optionId) return null;
          return (
            <CheckboxButton
              key={optionId}
              checked={filter?.includes(optionId)}
              className="border-gray-200 text-gray-200"
              value={id}
              onCheckedChange={() => handleChangeFilter(optionId)}
              label={attributes?.name || ''}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FilterItem;
