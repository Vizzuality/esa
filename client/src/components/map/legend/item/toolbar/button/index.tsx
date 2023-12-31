import { cn } from '@/lib/classnames';

import { LegendItemButtonProps } from '@/components/map/legend/types';

export const LegendItemButton = ({
  Icon,
  className = '',
  selected = false,
  value,
}: LegendItemButtonProps) => {
  return (
    <div
      className={cn({
        'group relative': true,
        [className]: !!className,
      })}
    >
      <Icon
        className={cn({
          'text-primary relative z-10 flex h-5 w-5 items-center justify-center rounded-full transition-colors':
            true,
          'group-active:text-slate-500': true,
          'fill-primary': selected,
        })}
        style={{ fillOpacity: selected ? value : 1 }}
      />
      <span
        className={cn({
          'absolute left-1/2 top-1/2 z-0 h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full border border-transparent transition-all':
            true,
          'group-active:scale-100 ': true,
        })}
      />
    </div>
  );
};

export default LegendItemButton;
