'use client';

import { useMemo } from 'react';

import {
  DialogClose,
  DialogContent,
  DialogTrigger,
  Dialog,
  DialogPortal,
  DialogOverlay,
} from '@radix-ui/react-dialog';
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';
import { FilterIcon, XIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { useSyncCategory } from '@/store/globe';

import { useGetCategories } from '@/types/generated/category';
import { useGetIfis } from '@/types/generated/ifi';
import { useGetTags } from '@/types/generated/tag';

import { useIsMobile } from '@/hooks/screen-size';

import { Button } from '@/components/ui/button';
import { DialogHeader } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

import FilterItem from './item';

type FiltersProps = {
  filtersActive: boolean;
};

const Filters = ({ filtersActive }: FiltersProps) => {
  const isMobile = useIsMobile();

  const { data: tagsData } = useGetTags({ 'pagination[limit]': 1000 });
  const { data: ifisData } = useGetIfis({ 'pagination[limit]': 1000 });
  const { data: categoriesData } = useGetCategories(
    {
      sort: 'id:asc',
      populate: 'stories',
    },
    {
      query: {
        enabled: isMobile,
      },
    }
  );

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

  const [category, setCategory] = useSyncCategory();

  const handleClick = (slug: string) => {
    if (category === slug) {
      setCategory(null);
      return;
    }
    setCategory(slug);
  };

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
          <DialogContent className="bg-card-foreground shadow-filters absolute left-0 top-0 z-50 h-screen overflow-hidden backdrop-blur-[20px] transition-all duration-500 sm:w-[345px] sm:rounded-lg">
            <ScrollArea type="hover" className="h-full">
              <DialogHeader className="flex flex-row items-end justify-between px-8 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold uppercase leading-none tracking-[1.8px] text-white">
                    Filters
                  </h3>
                </div>
                <DialogClose className="bg-map-background hover:border-secondary hover:text-secondary w-min rounded-full border border-gray-800 px-4 py-2 text-gray-200">
                  <XIcon className="h-4 w-4" />
                </DialogClose>
              </DialogHeader>
              <div className="space-y-8 p-8">
                <div className="space-y-4">
                  <div>
                    <p className="font-open-sans text-sm text-gray-500">
                      Filter stories on the globe by
                    </p>
                  </div>
                </div>
                {filtersData.map((filter) =>
                  filter?.options?.length ? <FilterItem key={filter.id} filter={filter} /> : null
                )}

                <div className="sm:hidden">
                  <div className="flex items-center justify-between text-gray-200">
                    <h3 className="font-notes text-sm font-bold uppercase tracking-widest text-gray-700">
                      Category
                    </h3>
                    <Button
                      className="font-open-sans text-sm"
                      size="sm"
                      variant="link"
                      onClick={() => setCategory(null)}
                    >
                      {!!category && 'Unselect'}
                    </Button>
                  </div>
                  <div>
                    <RadioGroup className="inline-flex flex-wrap gap-2" value={category || ''}>
                      {categoriesData?.data?.map(({ attributes }) => {
                        if (attributes?.name && attributes?.slug) {
                          return (
                            <RadioGroupItem
                              className="data-[state=checked]:text-background data-[state=checked]:border-secondary data-[state=checked]:bg-secondary w-fit rounded-3xl border border-gray-200 px-6 py-2 text-sm text-gray-200 transition-all duration-300 disabled:opacity-50 data-[state=checked]:border data-[state=checked]:opacity-70 data-[state=checked]:hover:opacity-100"
                              value={attributes.slug}
                              key={attributes.slug}
                              disabled={!attributes.stories?.data?.length}
                              onClick={(e) => handleClick(e.currentTarget?.value)}
                            >
                              {attributes?.name}
                            </RadioGroupItem>
                          );
                        }
                        return null;
                      })}
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
};

export default Filters;
