import Image from 'next/image';

import { ExternalLinkIcon } from 'lucide-react';

import { env } from '@/env.mjs';

import CategoryIcon from '@/components/ui/category-icon';
import { ScrollArea } from '@/components/ui/scroll-area';

import { SATELLITE_CONTENT, SatelliteMarkerId } from './constants';

type SatelliteContentProps = {
  id: SatelliteMarkerId | null;
  handleSelectSatellite: (id: SatelliteMarkerId) => void;
};

const SatelliteContent = ({ id, handleSelectSatellite }: SatelliteContentProps) => {
  const content = id && SATELLITE_CONTENT[id];
  const otherSatellite = Object.keys(SATELLITE_CONTENT).find(
    (key) => key !== id
  ) as keyof typeof SATELLITE_CONTENT;
  const otherSatelliteName = otherSatellite && SATELLITE_CONTENT[otherSatellite]?.title;

  return (
    content?.title && (
      <div>
        <div className="absolute right-0 top-0 z-50 -translate-y-1/3 translate-x-1/3">
          <Image
            alt={content?.title}
            src={`${env.NEXT_PUBLIC_BASE_PATH}/images/satellites/${id}.png`}
            width={264}
            height={169}
          />
        </div>
        <ScrollArea type="always" className="flex h-[calc(90vh-133px)] px-10 2xl:h-fit">
          <div className="my-10 space-y-5">
            <button
              className="text-primary font-bold opacity-40"
              onClick={() => handleSelectSatellite(otherSatellite)}
            >
              {otherSatelliteName}
            </button>
            <h1 className="text-2xl font-bold">{content?.title}</h1>
            <p className="font-open-sans">{content?.description}</p>
            <div className="flex pt-4">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-bold uppercase text-gray-400">Resolution</p>
                <p className="font-open-sans">{content?.resolution}</p>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-bold uppercase text-gray-400">Revisit Time</p>
                <p className="font-open-sans">{content?.revisit_time}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-bold uppercase text-gray-400">Launch Date</p>
              <p className="font-open-sans">{content?.launch_date}</p>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-bold uppercase text-gray-400">Applications</p>
              <div className="flex gap-4">
                {Array.isArray(content?.applications) &&
                  content?.applications.map((a) => (
                    <CategoryIcon key={a} slug={a} className="fill-white" />
                  ))}
              </div>
            </div>
            <div className="flex justify-end">
              <a
                className="font-open-sans mt-4 flex gap-2 text-sm text-yellow-500"
                href={content?.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Find out more <ExternalLinkIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </ScrollArea>
      </div>
    )
  );
};

export default SatelliteContent;
