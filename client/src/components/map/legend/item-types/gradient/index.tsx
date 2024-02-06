import React from 'react';

import { cn } from '@/lib/classnames';

import { LegendTypeProps } from '../../types';

export const LegendTypeGradient: React.FC<LegendTypeProps> = ({ className = '', items }) => {
  return (
    <div
      className={cn({
        [className || '']: !!className,
      })}
    >
      <div
        className="flex h-3 w-72"
        style={{
          backgroundImage: `linear-gradient(to right, ${items.map((i) => i.color).join(',')})`,
        }}
      />

      <ul className="mt-1 flex w-full justify-between">
        {items
          .filter(({ value }) => typeof value !== 'undefined' && value !== null)
          .map(({ value }) => (
            <li
              key={`${value}`}
              className={cn({
                'flex-shrink-0 text-sm text-white': true,
              })}
            >
              {value}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default LegendTypeGradient;
