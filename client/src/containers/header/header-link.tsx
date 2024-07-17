'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const HeaderLink = () => {
  const pathname = usePathname();

  const link = pathname.includes('/landing')
    ? { name: 'About', href: '/about' }
    : { name: 'About', href: '/about' };

  return (
    <Link href={link.href} className="text-sm font-bold uppercase tracking-widest">
      {link.name}
    </Link>
  );
};

export default HeaderLink;
