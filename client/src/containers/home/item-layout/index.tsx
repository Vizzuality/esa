import { PropsWithChildren } from 'react';

import { InfoIcon } from 'lucide-react';

type ItemsLayoutProps = PropsWithChildren & {
  title?: string;
};

const ItemsLayout = ({ children, title }: ItemsLayoutProps) => {
  return (
    <div className="rounded border border-[#335E6F] bg-[#00324775] p-4 backdrop-blur-sm">
      {title && (
        <div className="mb-2 flex justify-between">
          <p>{title}</p> <InfoIcon className="h-4 w-4" />
        </div>
      )}
      {children}
    </div>
  );
};

export default ItemsLayout;
