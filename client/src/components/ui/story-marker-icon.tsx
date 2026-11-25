import { cn } from '@/lib/classnames';

import { StoryMarkerType, storyMarkerSvg } from '@/constants/story-marker';

type StoryMarkerIconProps = {
  type?: StoryMarkerType;
  className?: string;
};

const StoryMarkerIcon = ({ type = 'default', className }: StoryMarkerIconProps) => (
  <span
    role="img"
    aria-label={type === 'enhanced' ? 'Enhanced story marker' : 'Story marker'}
    className={cn('inline-block h-7 w-7 [&>svg]:h-full [&>svg]:w-full', className)}
    // Static, trusted SVG built from constants — same source as the map markers.
    dangerouslySetInnerHTML={{ __html: storyMarkerSvg(type, 'lg') }}
  />
);

export default StoryMarkerIcon;
