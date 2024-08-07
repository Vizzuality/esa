import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/classnames';

import GradientLine from '@/components/ui/gradient-line';

import About from './about';

type HeaderProps = {
  pathname?: string;
};

const Header = ({ pathname }: HeaderProps) => {
  const isHome = pathname?.includes('home');
  return (
    <header className="pointer-events-auto z-50">
      <div className="flex items-center justify-between space-x-1.5 py-4">
        <div className="flex flex-1 items-center space-x-3">
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
          <GradientLine className="flex-1" />
        </div>

        <div className={cn('px-4 py-2', isHome && 'hidden')}>
          <h1 className="font-normal uppercase tracking-[6.4px]">
            <Link href="/home">Impact Sphere</Link>
          </h1>
        </div>
        <div className={cn('flex items-center space-x-3', !isHome && 'flex-1')}>
          <GradientLine className={cn('flex-1', isHome && 'hidden')} />
          <div className="text-sm font-bold uppercase tracking-widest">
            <About />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
