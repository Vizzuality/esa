import { PropsWithChildren } from 'react';

import { InfoIcon } from 'lucide-react';

type CardProps = PropsWithChildren & {
  title?: string;
};

const Card = ({ children, title }: CardProps) => {
  return (
    <div className="animate-in slide-in-from-top-5 fade-in bg-card rounded border border-[#335E6F] p-4 backdrop-blur-sm">
      {title && (
        <div className="mb-2 flex justify-between">
          <p>{title}</p> <InfoIcon className="h-4 w-4" />
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
