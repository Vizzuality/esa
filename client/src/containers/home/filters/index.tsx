import { useAtom } from 'jotai';
import { XIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { filtersOpenAtom } from '@/store/home';

import { Button } from '@/components/ui/button';

import FilterItem from './item';

const filtersData: {
  title: string;
  id: string;
  options: { name: string; id: string }[];
}[] = [
  {
    title: 'IFI',
    id: 'ifi',
    options: [
      { name: 'World Bank', id: 'world-bank' },
      { name: 'ADB', id: 'adb' },
      { name: 'IFAD', id: 'ifad' },
    ],
  },
  {
    title: 'Status',
    id: 'status',
    options: [
      { name: 'In progress', id: 'in-progress' },
      { name: 'Completed', id: 'completed' },
    ],
  },
  {
    title: 'Tags',
    id: 'tags',
    options: [
      { name: 'Tag 1', id: 'tag-1' },
      { name: 'Tag 2', id: 'tag-2' },
      { name: 'Tag 3', id: 'tag-3' },
      { name: 'Tag 4', id: 'tag-4' },
      { name: 'Tag 5', id: 'tag-5' },
      { name: 'Tag 6', id: 'tag-6' },
      { name: 'Tag 7', id: 'tag-7' },
      { name: 'Tag 8', id: 'tag-8' },
    ],
  },
];

export const Filters = () => {
  const [isOpen, setIsOpen] = useAtom(filtersOpenAtom);

  return (
    <div
      className={cn(
        'bg-card-foreground shadow-filters absolute left-0 top-0 z-20 h-screen w-[345px] overflow-hidden rounded-lg backdrop-blur-lg transition-all duration-500',
        {
          'translate-x-0 opacity-100': isOpen,
          '-translate-x-full opacity-0': !isOpen,
        }
      )}
    >
      <div className="space-y-8 p-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg uppercase tracking-widest">Filters</h3>
            <Button
              onClick={() => setIsOpen(false)}
              variant="icon"
              className="rounded-4xl bg-background hover:text-enlight-yellow-400 hover:border-enlight-yellow-400 border-2 border-gray-800 px-4 py-2"
            >
              <XIcon className="h-7 w-7" />
            </Button>
          </div>
          <div>
            <p className="font-open-sans text-sm text-gray-500">Filter stories on the globe by</p>
          </div>
        </div>
        {filtersData.map((filter) => (
          <FilterItem key={filter.id} filter={filter} />
        ))}
      </div>
    </div>
  );
};
