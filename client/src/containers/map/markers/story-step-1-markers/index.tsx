'use client';

import { Marker } from 'react-map-gl';

import { MapPinIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';

type MarkersProps = {
  lat: number;
  lng: number;
  name: string;
}[];

const MARKER = ({ name }: { name: string }) => (
  <div className="relative flex w-full items-center">
    <div
      className={cn(
        'relative z-50 hidden -translate-x-1/2 cursor-pointer items-center justify-center sm:flex'
      )}
    >
      <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-8 w-8 origin-bottom animate-bounce fill-gray-800 stroke-gray-400 stroke-[1.5]"
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
          <circle cx="12" cy="9" r="2" className="fill-gray-200" />
        </svg>

        <div className="font-notes absolute left-1/2 top-full mt-1 -translate-x-1/2 rounded border border-gray-400 bg-gray-800 p-1 text-xs font-semibold uppercase tracking-wide text-gray-200">
          {name}
        </div>
      </div>
    </div>
  </div>
);
export default function Step1Markers({ markers }: { markers: MarkersProps }) {
  return markers?.map(({ lat, lng, name }) => (
    <Marker key={name} anchor="left" latitude={lat} longitude={lng}>
      <MARKER name={name} />
    </Marker>
  ));
}
