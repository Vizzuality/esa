import { atom } from 'jotai';
import { parseAsArrayOf, useQueryStates, parseAsString, useQueryState, parseAsInteger } from 'nuqs';

// NUQS SYNC STATE HOOKS

export const useSyncCategory = () => useQueryState('category', parseAsString);

export const useSyncSearch = () => useQueryState('search', parseAsString);

export const useSyncFilters = () =>
  useQueryStates({
    tags: parseAsArrayOf(parseAsInteger),
    ifis: parseAsArrayOf(parseAsInteger),
    status: parseAsArrayOf(parseAsString),
  });

// JOTAI ATOMS

export const filtersOpenAtom = atom<boolean>(false);
