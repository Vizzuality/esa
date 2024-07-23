export const SATELLITE_CONTENT = {
  'sentinel-2': {
    title: 'Sentinel 2',
    description:
      'The Copernicus SENTINEL-2 mission comprises a constellation of two polar-orbiting satellites placed in the same sun-synchronous orbit. It aims at monitoring variability in land surface conditions, and its wide swath width and high revisit time will support monitoring of Earths surface changes.',
    resolution: '10m',
    revisit_time: '5 days',
    launch_date:
      'Sentinel-2A was launched on 23 June 2015; Sentinel-2B on 7 March 2017, both on a Vega rocket from Kourou, French Guiana',
    applications: ['agriculture', 'forest', 'marine', 'disaster', 'fragility'],
    link: 'https://sentiwiki.copernicus.eu/web/sentinel-2',
  },
  'sentinel-1': {
    title: 'Sentinel 1',
    description:
      'The Sentinel-1 mission comprises a constellation of two polar-orbiting satellites, operating day and night performing C-band synthetic aperture radar imaging, enabling them to acquire imagery regardless of the weather.',
    resolution: '10m',
    revisit_time: '5 days',
    launch_date:
      "Launch date Sentinel-1A was launched on 3 April 2014 and Sentinel-1B on 25 April 2016. Both were taken into orbit on a Soyuz rocket, from Europe's Spaceport in French Guiana",
    applications: ['agriculture', 'forest', 'marine', 'disaster'],
    link: 'https://sentiwiki.copernicus.eu/web/sentinel-1',
  },
};

export type SatelliteMarkerId = keyof typeof SATELLITE_CONTENT;

export type SatelliteMarker = {
  id: SatelliteMarkerId;
  name: string;
  width: number;
  height: number;
  center: {
    lat: number;
    lng: number;
  };
};

export const SATELLITE_MARKERS: SatelliteMarker[] = [
  {
    name: 'Sentinel 2',
    width: 75,
    height: 50,
    id: 'sentinel-2',
    center: {
      lat: 90,
      lng: 90,
    },
  },
  {
    name: 'Sentinel 1',
    width: 110,
    height: 110,
    id: 'sentinel-1',
    center: {
      lat: 45,
      lng: 150,
    },
  },
];
