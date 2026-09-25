'use client';
import { parseAsInteger, useQueryState } from 'nuqs';

const DEFAULT_STEP = 1;

// Shared, synchronously-mutable flag used to suspend scroll-driven step syncing
// while the outro is navigating back to the globe. Set just before `push('/globe')`
// so the scroll-reset that happens during the route transition can't recompute the
// active step (and bounce the user back to step one). Reset when a story mounts.
export const storyNavigation = { isLeaving: false };

export const useSyncStep = () => {
  const [step, setStep] = useQueryState('step', parseAsInteger.withDefault(DEFAULT_STEP));
  const removeStep = () => setStep(null);
  return { step, setStep, removeStep };
};
