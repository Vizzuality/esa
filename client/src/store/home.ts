import { atom } from 'jotai';

import { SatelliteMarkerId } from '@/containers/home/constants';

export const homeMarkerAtom = atom<SatelliteMarkerId | null>(null);
