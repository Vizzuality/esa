import GEOSJON from '@/constants/markers.json';

import MarkerItem from './item';

const Markers = () => {
  const FeatureCollection = GEOSJON as unknown as GeoJSON.FeatureCollection<
    GeoJSON.Point,
    {
      category: string;
    }
  >;

  return (
    <>
      {FeatureCollection.features.map((f) => {
        const { id } = f;

        return <MarkerItem key={id} {...f} />;
      })}
    </>
  );
};

export default Markers;
