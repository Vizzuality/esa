import { PropsWithChildren } from 'react';

import { ChevronDownIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

type MapContentProps = PropsWithChildren & {
  showContent?: boolean;
  title?: string;
  titlePlaceholder?: string;
};

const MapContent = ({ showContent, title, titlePlaceholder, children }: MapContentProps) => {
  return (
    <Collapsible
      defaultOpen
      className={cn(
        'group pointer-events-auto w-full overflow-hidden rounded border-gray-800 p-2 transition-all duration-300 ease-in-out sm:border sm:bg-[#335e6f]/80 sm:backdrop-blur',
        showContent ? 'opacity-100' : 'sm:opacity-0'
      )}
    >
      <CollapsibleTrigger className="group hidden w-full justify-between gap-2 px-4 data-[state=open]:pt-2 sm:flex">
        <h2 className="font-notes group w-[calc(100%-32px)] flex-1 text-start text-xl font-bold ">
          {title ? (
            title
          ) : (
            <span className="block w-full truncate group-data-[state=open]:hidden">
              {titlePlaceholder}
            </span>
          )}
        </h2>
        <ChevronDownIcon className="h-6 w-6 shrink-0 group-data-[state=closed]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div
          className={cn('w-full space-y-2 px-2 pt-4 sm:px-4 sm:pb-4 sm:pt-0', title && 'sm:pt-2')}
        >
          <div className="font-open-sans space-y-4 text-sm">{children}</div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default MapContent;
