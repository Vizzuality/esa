import { useMemo } from 'react';

import {
  DialogClose,
  DialogContent,
  DialogTrigger,
  Dialog,
  DialogPortal,
  DialogOverlay,
} from '@radix-ui/react-dialog';
import { FilterIcon, XIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { useGetIfis } from '@/types/generated/ifi';
import { useGetTags } from '@/types/generated/tag';

import FilterItem from './item';

type FiltersProps = {
  filtersActive: boolean;
};

const Filters = ({ filtersActive }: FiltersProps) => {
  const { data: tagsData } = useGetTags({ 'pagination[limit]': 1000 });
  const { data: ifisData } = useGetIfis({ 'pagination[limit]': 1000 });

  const filtersData = useMemo(() => {
    return [
      {
        title: 'IFIs',
        id: 'ifis',
        options: ifisData?.data || [],
      },
      {
        title: 'Status',
        id: 'status',
        options: [
          { attributes: { name: 'In progress' }, id: 'In progress' },
          { attributes: { name: 'Completed' }, id: 'Completed' },
        ],
      },
      {
        title: 'Tags',
        id: 'tags',
        options: tagsData?.data || [],
      },
    ];
  }, [ifisData?.data, tagsData?.data]);

  return (
    <div>
      <Dialog>
        <DialogTrigger className="bg-background hover:border-secondary hover:text-secondary flex items-center gap-2 rounded-sm border border-gray-800 px-4 py-2 text-gray-200">
          <div className="relative">
            <div
              className={cn(
                'bg-secondary absolute right-0 h-1.5 w-1.5 rounded-full transition-opacity duration-300',
                filtersActive ? 'opacity-100' : 'opacity-0'
              )}
            ></div>
            <FilterIcon className="h-4 w-4" />
          </div>
          Filters
        </DialogTrigger>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className="bg-card-foreground shadow-filters absolute left-0 top-0 z-50 h-screen w-[345px] overflow-hidden rounded-lg backdrop-blur-lg transition-all duration-500">
            <div className="">
              <DialogClose className="bg-map-background hover:border-secondary hover:text-secondary absolute right-4 top-4 rounded-full border border-gray-800 px-4  py-2 text-gray-200">
                <XIcon className="h-4 w-4" />
              </DialogClose>

              <div className="space-y-8 p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold uppercase tracking-[1.8px] text-white">
                      Filters
                    </h3>
                  </div>
                  <div>
                    <p className="font-open-sans text-sm text-gray-500">
                      Filter stories on the globe by
                    </p>
                  </div>
                </div>
                {filtersData.map((filter) =>
                  filter?.options?.length ? <FilterItem key={filter.id} filter={filter} /> : null
                )}
              </div>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
};

export default Filters;
