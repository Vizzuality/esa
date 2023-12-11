/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Config } from 'react-player';

import { BaseReactPlayerProps } from 'react-player/base';
import ReactPlayer from 'react-player/lazy';

import { cn } from '@/lib/classnames';

interface VideoProps extends BaseReactPlayerProps {
  className?: string;
  config?: Config;
}

export const Video = ({
  className,
  config,
  loop = false,
  playing = false,
  muted = false,
  url,
  height,
  width,
}: VideoProps): JSX.Element => {
  return (
    <ReactPlayer
      className={cn({
        [`${className}`]: true,
      })}
      width={width}
      height={height}
      url={url}
      loop={loop}
      playing={playing}
      muted={muted}
      config={config}
      controls={false}
    />
  );
};

export default Video;
