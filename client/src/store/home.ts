import { atom } from 'jotai';
<<<<<<< HEAD

import { SatelliteMarkerId } from '@/containers/home/constants';

export const homeMarkerAtom = atom<SatelliteMarkerId | null>(null);
=======
import { parseAsArrayOf, useQueryStates, parseAsString, useQueryState } from 'nuqs';

// NUQS SYNC STATE HOOKS

export const useSyncCategory = () => useQueryState('category', parseAsString);

export const useSyncFilters = () =>
  useQueryStates({
    tags: parseAsArrayOf(parseAsString),
    ifi: parseAsArrayOf(parseAsString),
    status: parseAsArrayOf(parseAsString),
  });

// JOTAI ATOMS

export const filtersOpenAtom = atom<boolean>(false);
>>>>>>> ebf3e15 (Update main (#52))
