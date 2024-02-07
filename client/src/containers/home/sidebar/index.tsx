'use client';

import { PropsWithChildren } from 'react';

import { useRecoilValue } from 'recoil';

import { cn } from '@/lib/classnames';

import { sidebarOpenAtom } from '@/store';

export default function Sidebar({ children }: PropsWithChildren) {
  const open = useRecoilValue(sidebarOpenAtom);

  return (
    <div
      className={cn({
        'pointer-events-none h-full max-w-[400px]  flex-col transition-transform duration-500':
          true,
        'translate-x-0': open,
        '-translate-x-full': !open,
      })}
    >
      <div className="pointer-events-auto flex grow flex-col overflow-y-auto">{children}</div>
    </div>
  );
}
