'use client';

import { PropsWithChildren } from 'react';

import { MapProvider } from 'react-map-gl';

import { Provider } from 'jotai';

export default function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <MapProvider>
        <Provider>{children}</Provider>
      </MapProvider>
    </>
  );
}
