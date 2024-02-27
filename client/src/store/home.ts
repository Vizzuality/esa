import { atom } from 'jotai';
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
