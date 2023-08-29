'use client';

import { PropsWithChildren, useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';

import { TooltipProvider } from '@/components/ui/tooltip';

import { notesESA, sans } from '@/styles/fonts';

export default function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <style jsx global>{`
        :root {
          --font-inter: ${sans.style.fontFamily};
          --font-esa-notes: ${notesESA.style.fontFamily};
        }
      `}</style>

      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <TooltipProvider>{children}</TooltipProvider>
        </RecoilRoot>
      </QueryClientProvider>
    </>
  );
}
