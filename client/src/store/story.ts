import { string } from '@recoiljs/refine';
import { atom } from 'recoil';
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
