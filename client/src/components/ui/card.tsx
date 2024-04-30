import { PropsWithChildren } from 'react';

import { InfoIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';

type CardProps = PropsWithChildren & {
  title?: string;
  info?: string;
  className?: string;
};

const Card = ({ children, title, info, className }: CardProps) => {
  return (
    <div
      className={cn(
        'animate-in slide-in-from-top-5 fade-in bg-card rounded border border-[#335E6F] p-4 backdrop-blur-sm',
        className
      )}
    >
      {title && (
        <div className="mb-2 flex justify-between">
          <p>{title}</p>
          {info && <InfoIcon className="h-4 w-4" />}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
