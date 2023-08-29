'use client';

import { PropsWithChildren, useCallback, useState } from 'react';

import { MapProvider } from 'react-map-gl';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';

import { RecoilURLSyncNext } from '@/lib/recoil';
import type { Deserialize, Serialize } from '@/lib/recoil';
import RecoilDevTools from '@/lib/recoil/devtools';

import { TooltipProvider } from '@/components/ui/tooltip';

import { notesESA, sans } from '@/styles/fonts';

export default function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());
  const serialize: Serialize = useCallback((x) => {
    return x === undefined ? '' : JSON.stringify(x);
  }, []);

  //Demo of custom deserialization
  const deserialize: Deserialize = useCallback((x: string) => {
    return JSON.parse(x);
  }, []);

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
          <MapProvider>
            <TooltipProvider>
              <RecoilURLSyncNext
                location={{ part: 'queryParams' }}
                serialize={serialize}
                deserialize={deserialize}
              >
                <RecoilDevTools />
                {children}
              </RecoilURLSyncNext>
            </TooltipProvider>
          </MapProvider>
        </RecoilRoot>
      </QueryClientProvider>
    </>
  );
}
