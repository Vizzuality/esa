import { string } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

export const categoryAtom = atom({
  key: 'category',
  default: 'all',
  effects: [
    urlSyncEffect({
      refine: string(),
    }),
  ],
});

export const selectedStoryAtom = atom<string | null>({
  key: 'selected-story',
  default: null,
});
