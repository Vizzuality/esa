import {
  addMonths,
  eachDayOfInterval,
  eachHourOfInterval,
  eachMinuteOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
  format as dateFnsFormat,
  isValid,
  parseISO,
  startOfMonth,
} from 'date-fns';

export type TimelineDateType = 'year' | 'month' | 'dekad' | 'day' | 'hour' | 'minute' | 'second';

export type TimelineItem = { value: number; label: string };

const DEFAULT_FORMATS: Record<TimelineDateType, string> = {
  year: 'yyyy',
  month: 'MMM yyyy',
  dekad: 'dd MMM yyyy',
  day: 'dd MMM yyyy',
  hour: 'HH:mm dd',
  minute: 'HH:mm',
  second: 'yyyy', // falls back to yearly steps, see getTimelineDates
};

// Dekads start on the 1st, 11th and 21st of each month (the 3rd one runs to month end)
const DEKAD_START_DAYS = [1, 11, 21];

/**
 * Parses config dates as local time ("2014" -> 1 Jan 2014 00:00 local), so labels never
 * shift a day/year in timezones west of UTC like `new Date("2014")` does.
 */
export const parseTimelineDate = (value: string | number | undefined): Date | null => {
  if (value === undefined || value === null || value === '') return null;
  const parsed = parseISO(String(value));
  if (isValid(parsed)) return parsed;
  const fallback = new Date(String(value));
  return isValid(fallback) ? fallback : null;
};

const dekadStart = (date: Date): Date => {
  const day = date.getDate();
  const startDay = day >= 21 ? 21 : day >= 11 ? 11 : 1;
  return new Date(date.getFullYear(), date.getMonth(), startDay);
};

export const eachDekadOfInterval = (
  { start, end }: { start: Date; end: Date },
  { step = 1 }: { step?: number } = {}
): Date[] => {
  if (start > end) return [];

  const first = dekadStart(start);
  const result: Date[] = [];
  let month = startOfMonth(first);
  let index = 0;

  while (month <= end) {
    for (const day of DEKAD_START_DAYS) {
      const d = new Date(month.getFullYear(), month.getMonth(), day);
      if (d < first || d > end) continue;
      if (index % step === 0) result.push(d);
      index += 1;
    }
    month = addMonths(month, 1);
  }

  return result;
};

const STEP_FUNCTIONS: Record<
  Exclude<TimelineDateType, 'dekad' | 'second'>,
  (interval: { start: Date; end: Date }, options: { step: number }) => Date[]
> = {
  year: eachYearOfInterval,
  month: eachMonthOfInterval,
  day: eachDayOfInterval,
  hour: eachHourOfInterval,
  minute: eachMinuteOfInterval,
};

export const getTimelineDates = ({
  start,
  end,
  dateType = 'year',
  interval = 1,
}: {
  start?: string;
  end?: string;
  dateType?: TimelineDateType;
  interval?: number;
}): Date[] => {
  const startDate = parseTimelineDate(start);
  const endDate = parseTimelineDate(end);
  if (!startDate || !endDate || startDate > endDate) return [];

  const step = Math.max(1, Math.floor(interval));

  if (dateType === 'dekad') {
    return eachDekadOfInterval({ start: startDate, end: endDate }, { step });
  }

  // 'second' has no date-fns "each" helper; keep the historical fallback to years
  const stepFn = dateType === 'second' ? eachYearOfInterval : STEP_FUNCTIONS[dateType];
  return (stepFn ?? eachYearOfInterval)({ start: startDate, end: endDate }, { step });
};

export const getTimelineItems = ({
  start,
  end,
  dateType,
  interval,
  format,
  labels,
}: {
  start?: string;
  end?: string;
  dateType?: TimelineDateType;
  interval?: number;
  format?: string;
  labels?: string[];
}): TimelineItem[] => {
  const timelineDates = getTimelineDates({ start, end, dateType, interval });

  const useConfigLabels = !!labels?.length && labels.length === timelineDates.length;
  if (labels?.length && !useConfigLabels && process.env.NODE_ENV !== 'production') {
    console.warn(
      `[legend timeline] ${labels.length} labels for ${timelineDates.length} steps; using generated labels`
    );
  }

  const labelFormat = format || DEFAULT_FORMATS[dateType ?? 'year'];

  return timelineDates.map((d, index) => ({
    value: index,
    label: (useConfigLabels && labels?.[index]) || dateFnsFormat(d, labelFormat),
  }));
};
