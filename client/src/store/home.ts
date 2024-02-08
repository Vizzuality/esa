import { atom } from 'jotai';
import { parseAsArrayOf, useQueryStates, parseAsString, useQueryState } from 'nuqs';

export const useCategoryAtom = () => useQueryState('category', parseAsString);

export const filtersOpenAtom = atom<boolean>(false);

export const useFilters = () =>
  useQueryStates({
    tags: parseAsArrayOf(parseAsString),
    ifi: parseAsArrayOf(parseAsString),
    status: parseAsArrayOf(parseAsString),
  });
