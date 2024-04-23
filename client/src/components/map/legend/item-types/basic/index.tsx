import React from 'react';

import { cn } from '@/lib/classnames';

import { LegendTypeProps } from '../../types';

export const LegendTypeBasic: React.FC<LegendTypeProps> = ({
  className = '',
  items = [],
  title,
}) => {
  return (
    <div
      className={cn({
        [className]: !!className,
      })}
    >
      {title && <p className="mb-2 text-sm text-white">{title}</p>}
      <ul className="flex w-full flex-wrap items-center gap-3">
        {items.map(({ value, color }) => (
          <li key={`${value}`} className="flex items-center gap-x-1 text-white">
            <div
              className="shadow-xs h-4 w-4 flex-shrink-0 rounded-sm"
              style={{
                backgroundColor: color,
              }}
            />
            <div className="font-open-sans text-sm">{value}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LegendTypeBasic;
