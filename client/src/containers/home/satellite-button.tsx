import Image from 'next/image';

import env from '@/env.mjs';

import { cn } from '@/lib/classnames';

import { SatelliteMarker, SatelliteMarkerId } from './constants';

type SatelliteButtonProps = {
  handleSelectMarker: (id: SatelliteMarkerId) => void;
  satellite: SatelliteMarker;
  className?: string;
};

const SatelliteButton = ({ handleSelectMarker, satellite, className }: SatelliteButtonProps) => {
  return (
    <button
      className={cn(
        'pointer-events-auto absolute z-50 flex cursor-pointer items-center justify-center',
        className
      )}
      onClick={() => handleSelectMarker(satellite.id)}
    >
      <div className="absolute h-10 w-10 animate-pulse rounded-full bg-slate-200/50 blur-lg"></div>
      <Image
        src={`${env.NEXT_PUBLIC_BASE_PATH}/images/satellites/${satellite.id}-icon.png`}
        width={satellite.width}
        alt={satellite.name}
        height={satellite.height}
      />
    </button>
  );
};
export default SatelliteButton;
