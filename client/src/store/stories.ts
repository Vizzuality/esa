import { number } from '@recoiljs/refine';
import { atom } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

export const stepAtom = atom({
  key: 'step',
  default: 0,
  effects: [
    urlSyncEffect({
      refine: number(),
    }),
  ],
});

export const stepCountAtom = atom({
  key: 'step-count',
  default: 0,
});

export const lastStepAtom = atom({
  key: 'last-step',
  default: 0,
});
