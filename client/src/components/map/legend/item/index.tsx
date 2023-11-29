'use client';

import React, { Children, PropsWithChildren, isValidElement, useMemo } from 'react';

import { GripVertical } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { LegendItemProps } from '@/components/map/legend/types';
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion';
import Card from '@/components/ui/card';

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
  const { expand } = settings || {};

  const validChildren = useMemo(() => {
    const chldn = Children.map(children, (Child) => {
      return isValidElement(Child);
    });
    return chldn && chldn.some((c) => !!c);
  }, [children]);

  const acordionState = expand ? `${id}` : undefined;

  return (
    <Accordion type="single" value={acordionState} asChild>
      <AccordionItem value={`${id}`}>
        <Card
          className={cn({
            'mb-1 w-full border-none p-0': true,
            [className]: !!className,
          })}
        >
          <header className="sticky top-0 z-20 flex items-start justify-between space-x-8  px-2.5 py-2">
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
                  'font-notes mt-px text-sm text-white': true,
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
            />
          </header>

          {validChildren && (
            <AccordionContent className="grow px-2.5 transition-all">
              <div>{children}</div>
            </AccordionContent>
          )}
        </Card>
      </AccordionItem>
    </Accordion>
  );
};

export default LegendItem;
