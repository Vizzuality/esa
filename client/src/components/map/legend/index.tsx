import React, { useMemo, Children, isValidElement } from 'react';

import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import SortableList from './sortable/list';
import { LegendProps } from './types';

export const Legend: React.FC<LegendProps> = ({
  children,
  className = '',
  sortable,
  onChangeOrder,
}: LegendProps) => {
  const isChildren = useMemo(() => {
    return !!Children.count(Children.toArray(children).filter((c) => isValidElement(c)));
  }, [children]);

  return (
    isChildren && (
      <div
        className={cn({
          'bg-card-map relative flex-col space-y-2 rounded-lg p-4 backdrop-blur-sm': true,
          hidden: !isChildren,
          [className]: !!className,
        })}
      >
        {isChildren && (
          <div className="flex flex-col overflow-x-hidden">
            {!!sortable?.enabled && !!onChangeOrder ? (
              <SortableList sortable={sortable} onChangeOrder={onChangeOrder}>
                {children}
              </SortableList>
            ) : Array.isArray(children) && children.length > 1 ? (
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="font-open-sans group flex w-full items-center justify-between gap-2 text-sm font-semibold text-white">
                  Legend <ChevronDown className="w-5 group-data-[state=closed]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="flex flex-col overflow-x-hidden">
                  {children}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <div className="-mt-3">{children}</div>
            )}
          </div>
        )}
      </div>
    )
  );
};

export default Legend;
