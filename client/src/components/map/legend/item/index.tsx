'use client';

import React, { Children, PropsWithChildren, isValidElement, useMemo } from 'react';

import { ChevronDown, GripVertical } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { LegendItemProps } from '@/components/map/legend/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import LegendItemToolbar from './toolbar';

export const LegendItem: React.FC<PropsWithChildren & LegendItemProps> = ({
  id,
  children,
  name,
  className = '',
  // sortable
  sortable,
  // attributes,
  listeners,
  // settings
  settingsManager,
  settings,
  // components
  InfoContent,
  // events
  onChangeOpacity,
  onChangeVisibility,
  onChangeExpand,
}) => {
  const validChildren = useMemo(() => {
    const chldn = Children.map(children, (Child) => {
      return isValidElement(Child);
    });
    return chldn && chldn.some((c) => !!c);
  }, [children]);

  return (
    <Collapsible defaultOpen asChild>
      <div
        className={cn({
          'space-y-2': true,
          [className]: !!className,
        })}
      >
        <header className="sticky top-0 z-20 flex items-start justify-between">
          <div
            className={cn({
              'relative flex items-start space-x-0.5': true,
              '-ml-1': sortable?.handle,
            })}
          >
            {sortable?.handle && (
              <button
                aria-label="drag"
                type="button"
                className=" mt-0.5 cursor-pointer transition-colors hover:text-slate-800/50"
                {...listeners}
              >
                <GripVertical className="h-5 w-5" />
              </button>
            )}

            <div
              className={cn({
                'font-open-sans mt-px text-sm font-semibold text-white': true,
              })}
            >
              {name}
            </div>
          </div>

          {/* TOOLBAR */}
          <LegendItemToolbar
            settings={settings}
            settingsManager={settingsManager}
            onChangeOpacity={onChangeOpacity}
            onChangeVisibility={onChangeVisibility}
            onChangeExpand={onChangeExpand}
            InfoContent={InfoContent}
            className="px-2"
          />
          <CollapsibleTrigger className="group">
            <ChevronDown className="w-5 stroke-white group-data-[state=closed]:rotate-180" />
          </CollapsibleTrigger>
        </header>

        {validChildren && (
          <CollapsibleContent className="grow transition-all">
            <div>{children}</div>
          </CollapsibleContent>
        )}
      </div>
    </Collapsible>
  );
};

export default LegendItem;
