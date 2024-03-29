'use client';

import Image from 'next/image';

import { useAtom } from 'jotai';
import { FilterIcon } from 'lucide-react';

import { filtersOpenAtom } from '@/store/home';

import { Button } from '@/components/ui/button';
import GradientLine from '@/components/ui/gradient-line';

const Header = () => {
  const [open, setOpen] = useAtom(filtersOpenAtom);

  const handleClickFilters = () => {
    setOpen(!open);
  };

  return (
    <header className="z-10">
      <div className="flex items-center justify-between space-x-1.5 py-4">
        <div className="flex flex-1 items-center space-x-3">
          <Button onClick={handleClickFilters} variant="icon" size="icon">
            <FilterIcon className="h-6 w-6" />
          </Button>
          <div className="flex-1">
            <GradientLine />
          </div>
        </div>
        <div className="px-4 py-2">
          <h1 className="font-normal uppercase tracking-[6.4px]">Impact Sphere</h1>
        </div>
        <div className="flex flex-1 items-center space-x-3">
          <div className="flex-1">
            <GradientLine />
          </div>
          <div className="flex items-center space-x-3">
            <a href="https://gda.esa.int/" target="_blank" rel="noreferrer">
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/logos/GDA-logo.png`}
                alt="Impact Sphere"
                width={50}
                height={50}
              />
            </a>
            <a href="https://www.esa.int/" target="_blank" rel="noreferrer">
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/logos/esa-logo.png`}
                alt="Impact Sphere"
                width={69}
                height={32}
              />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
