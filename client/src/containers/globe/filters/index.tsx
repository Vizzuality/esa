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

import { useGetIfis } from '@/types/generated/ifi';
import { useGetTags } from '@/types/generated/tag';

import FilterItem from './item';

export const Filters = () => {
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
          { attributes: { name: 'In progress' }, id: 'in-progress' },
          { attributes: { name: 'Completed' }, id: 'completed' },
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
        <DialogTrigger className="bg-background flex items-center gap-2 rounded-sm border border-gray-800 px-4 py-2">
          <FilterIcon className="h-4 w-4" />
          Filters
        </DialogTrigger>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className="bg-card-foreground shadow-filters absolute left-0 top-0 z-50 h-screen w-[345px] overflow-hidden rounded-lg backdrop-blur-lg transition-all duration-500">
            <div className="">
              <DialogClose className="bg-map-background absolute right-4 top-4 rounded-full border border-gray-800 px-4 py-2 text-gray-200">
                <XIcon className="h-4 w-4 stroke-gray-200" />
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
