import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/classnames';

import GradientLine from '@/components/ui/gradient-line';

import About from './about';

type HeaderProps = {
  pathname?: string;
  className?: string;
};

const Header = ({ pathname, className }: HeaderProps) => {
  const isHome = pathname?.includes('home');
  return (
    <header className={cn('pointer-events-auto z-50', className)}>
      <div className="flex items-center justify-between space-x-1.5 px-4 py-4 sm:px-0">
        <div className={cn('flex items-center space-x-3', !isHome && 'flex-1')}>
          <div className="flex shrink-0 items-center space-x-3">
            <a href="https://gda.esa.int/" target="_blank" rel="noreferrer">
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/logos/GDA-logo.png`}
                alt="Impact Sphere"
                width={48}
                height={48}
              />
            </a>
            <a href="https://www.esa.int/" target="_blank" rel="noreferrer">
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/logos/esa-logo.png`}
                alt="Impact Sphere"
                width={68}
                height={32}
              />
            </a>
          </div>
          <GradientLine className={cn('flex-1', isHome && 'hidden')} />
        </div>

        <div className={cn('py-2 sm:px-4', isHome && 'hidden')}>
          <p className="text-xs font-bold uppercase tracking-[2.4px] sm:text-base sm:font-normal sm:tracking-[6.4px]">
            <Link href="/home">Impact Sphere</Link>
          </p>
        </div>

        <div className={cn('flex flex-1 items-center space-x-3', !isHome && 'hidden sm:flex')}>
          <GradientLine className={cn('flex-1')} />
          <div className="text-sm font-bold uppercase tracking-widest">
            <About />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
