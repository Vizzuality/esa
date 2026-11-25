// Story markers are drawn from this SVG instead of PNG assets so the color can be changed here.
// The same SVG is used by the Mapbox symbol layers (see `useMapSvgImage`) and the map legend.

export const STORY_MARKER_COLORS = {
  default: '#FFE094',
  enhanced: '#7FE0D4',
} as const;

export type StoryMarkerType = keyof typeof STORY_MARKER_COLORS;

export type StoryMarkerVariant = 'lg' | 'sm';

const BORDER_COLOR = '#003247';

const VARIANTS: Record<
  StoryMarkerVariant,
  { width: number; height: number; outer: number; inner: number }
> = {
  // Static marker
  lg: { width: 59, height: 59, outer: 14, inner: 6 },
  // Pulsing marker drawn on top of `lg`
  sm: { width: 59, height: 59, outer: 12, inner: 6 },
};

const diamond = (cx: number, cy: number, r: number) =>
  `M${cx} ${cy - r}L${cx + r} ${cy}L${cx} ${cy + r}L${cx - r} ${cy}Z`;

export const SHADOW_BLUR = 5;
export const BORDER_WIDTH = 1.5;

// Shared geometry: rendered as JSX by `StoryMarkerIcon` and as a string by `storyMarkerSvg`.
export const getStoryMarkerShape = (type: StoryMarkerType, variant: StoryMarkerVariant = 'lg') => {
  const { width, height, outer, inner } = VARIANTS[variant];
  const cx = width / 2;
  const cy = height / 2;

  return {
    width,
    height,
    color: STORY_MARKER_COLORS[type],
    borderColor: BORDER_COLOR,
    shadowPath: diamond(cx, cy, outer + 2),
    outerPath: diamond(cx, cy, outer),
    innerPath: diamond(cx, cy, inner),
  };
};

// Mapbox needs an image, so the map markers use this string version.
export const storyMarkerSvg = (type: StoryMarkerType, variant: StoryMarkerVariant = 'lg') => {
  const { width, height, color, borderColor, shadowPath, outerPath, innerPath } =
    getStoryMarkerShape(type, variant);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs><filter id="shadow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${SHADOW_BLUR}"/></filter></defs><path d="${shadowPath}" fill="#000" fill-opacity="0.45" filter="url(#shadow)"/><path d="${outerPath}" fill="${borderColor}" stroke="${color}" stroke-width="${BORDER_WIDTH}"/><path d="${innerPath}" fill="${color}"/></svg>`;
};

// Mapbox image names → marker definition
export const STORY_MARKER_IMAGES: Record<
  string,
  { type: StoryMarkerType; variant: StoryMarkerVariant }
> = {
  'story-marker-lg': { type: 'default', variant: 'lg' },
  'story-marker': { type: 'default', variant: 'sm' },
  'story-marker-enhanced-lg': { type: 'enhanced', variant: 'lg' },
  'story-marker-enhanced': { type: 'enhanced', variant: 'sm' },
};
