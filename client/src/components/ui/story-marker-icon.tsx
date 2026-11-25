import { useId } from 'react';

import { cn } from '@/lib/classnames';

import {
  BORDER_WIDTH,
  SHADOW_BLUR,
  StoryMarkerType,
  getStoryMarkerShape,
} from '@/constants/story-marker';

type StoryMarkerIconProps = {
  type?: StoryMarkerType;
  className?: string;
};

const StoryMarkerIcon = ({ type = 'default', className }: StoryMarkerIconProps) => {
  const filterId = useId();
  const { width, height, color, borderColor, shadowPath, outerPath, innerPath } =
    getStoryMarkerShape(type, 'lg');

  return (
    <svg
      role="img"
      aria-label={type === 'enhanced' ? 'Enhanced story marker' : 'Story marker'}
      viewBox={`0 0 ${width} ${height}`}
      className={cn('inline-block h-7 w-7', className)}
    >
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={SHADOW_BLUR} />
        </filter>
      </defs>
      <path d={shadowPath} fill="#000" fillOpacity={0.45} filter={`url(#${filterId})`} />
      <path d={outerPath} fill={borderColor} stroke={color} strokeWidth={BORDER_WIDTH} />
      <path d={innerPath} fill={color} />
    </svg>
  );
};

export default StoryMarkerIcon;
