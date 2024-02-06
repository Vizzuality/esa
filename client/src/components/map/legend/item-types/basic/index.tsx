import React from 'react';

import { cn } from '@/lib/classnames';

import { LegendTypeProps } from '../../types';

export const LegendTypeBasic: React.FC<LegendTypeProps> = ({ className = '', items = [] }) => {
  return (
    <div
      className={cn({
        [className]: !!className,
      })}
    >
      <ul className="flex w-full flex-wrap items-center gap-3">
        {items.map(({ value, color }) => (
          <li
            key={`${value}`}
            className="font-notes flex items-center gap-x-1 font-bold text-white"
          >
            <div
              className="shadow-xs h-4 w-4 flex-shrink-0 rounded-sm"
              style={{
                backgroundColor: color,
              }}
            />
            <div>{value}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LegendTypeBasic;
