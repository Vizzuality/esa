import { PropsWithChildren } from 'react';

import { InfoIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { ScrollArea } from '@/components/ui/scroll-area';

type CardProps = PropsWithChildren & {
  title?: string;
  info?: string;
  className?: string;
};

const Card = ({ children, title, info, className }: CardProps) => {
  return (
    <div
      className={cn(
        'animate-in slide-in-from-top-5 fade-in bg-background/30 flex h-full flex-col rounded border border-[#335E6F] pt-4 backdrop-blur-sm',
        className
      )}
    >
      {title && (
        <div className="mb-2 flex justify-between px-4">
          <p className="font-notes text-sm font-bold uppercase">{title}</p>
          {info && <InfoIcon className="h-4 w-4" />}
        </div>
      )}
      <ScrollArea
        type="always"
        className={cn('overflow-x-visible', !title ? 'h-[calc(100%-20px)]' : 'h-full')}
      >
        <div className="pb-4">{children}</div>
      </ScrollArea>
    </div>
  );
};

export default Card;
