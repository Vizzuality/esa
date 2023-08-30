'use client';

import { array, string } from '@recoiljs/refine';
import { atom, selectorFamily } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

export const categoryAtom = atom<string>({
  key: 'category',
  default: undefined,
  effects: [
    urlSyncEffect({
      refine: string(),
    }),
  ],
});

export const filtersOpenAtom = atom<boolean>({
  key: 'filtersOpen',
  default: false,
});

export const tagsAtom = atom({
  key: 'tags',
  default: [],
  effects: [
    urlSyncEffect({
      refine: array(string()),
    }),
  ],
});

export const ifiAtom = atom({
  key: 'ifi',
  default: [],
  effects: [
    urlSyncEffect({
      refine: array(string()),
    }),
  ],
});

export const statusAtom = atom({
  key: 'status',
  default: [],
  effects: [
    urlSyncEffect({
      refine: array(string()),
    }),
  ],
});

const filterAtoms = {
  tags: tagsAtom,
  ifi: ifiAtom,
  status: statusAtom,
};

export type FilterName = keyof typeof filterAtoms;

export const filterSelector = selectorFamily<readonly string[], FilterName>({
  key: 'filter',
  get:
    (name: FilterName) =>
      ({ get }) =>
        get(filterAtoms[name]),
  set:
    (name: FilterName) =>
      ({ set, reset }, newValue) =>
        Array.isArray(newValue) && !newValue.length
          ? reset(filterAtoms[name])
          : set(filterAtoms[name], newValue),
});
