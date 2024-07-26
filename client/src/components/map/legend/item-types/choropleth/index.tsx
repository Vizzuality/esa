import React from 'react';

import { cn } from '@/lib/classnames';

import { LegendTypeProps } from '../../types';
import LegendHeader from '../header';

export const LegendTypeChoropleth: React.FC<LegendTypeProps> = ({
  className = '',
  items,
  title,
  info,
}) => {
  return (
    <div
      className={cn('font-open mt-3', {
        [className]: !!className,
      })}
    >
      <LegendHeader title={title} info={info} />
      <ul className="flex w-full">
        {items.map(({ color, value }) => (
          <li
            key={`${color}-${value}`}
            className="h-2 flex-shrink-0"
            style={{
              width: `${100 / items.length}%`,
              backgroundColor: color,
            }}
          />
        ))}
      </ul>

      <ul className="mt-1 flex w-full">
        {items.map(({ color, value }) => (
          <li
            key={`${color}-${value}`}
            className="font-open-sans flex-shrink-0 text-center text-sm text-white"
            style={{
              width: `${100 / items.length}%`,
            }}
          >
            {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LegendTypeChoropleth;
