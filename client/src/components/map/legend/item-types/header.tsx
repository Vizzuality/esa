import { PopoverClose } from '@radix-ui/react-popover';
import { Info, X } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type LegendHeaderProps = {
  title?: string;
  info?: string;
};

const LegendHeader = ({ title, info }: LegendHeaderProps) => {
  return (
    <div className="font-open-sans mb-2 flex items-center justify-between gap-2 text-white">
      {!!title && <div className="text-sm font-semibold text-white">{title}</div>}
      {!!info && (
        <Popover>
          <PopoverTrigger>
            <Info className="h-4 w-4 stroke-white" />
          </PopoverTrigger>

          <PopoverContent className="border-none bg-[#003247] text-xs text-white">
            <div className="mb-2 flex justify-between text-sm font-semibold">
              {title}
              <PopoverClose>
                <X className="h-4 w-4 stroke-white" />
              </PopoverClose>
            </div>
            {info}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default LegendHeader;
