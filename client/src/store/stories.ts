'use client';
import { parseAsInteger, useQueryState } from 'nuqs';

const DEFAULT_STEP = 1;

export const useSyncStep = () => {
  const [step, setStep] = useQueryState('step', parseAsInteger.withDefault(DEFAULT_STEP));
  const removeStep = () => setStep(null);
  return { step, setStep, removeStep };
};
