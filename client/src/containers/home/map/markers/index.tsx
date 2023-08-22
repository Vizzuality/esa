import GEOSJON from '@/constants/markers.json';

import Marker from '@/components/map/layers/marker';

const Markers = () => {
  return (
    <>
      {GEOSJON.features.map((f, i) => {
        const { geometry, properties } = f;
        const { category } = properties;

        return (
          <Marker key={i} longitude={geometry.coordinates[0]} latitude={geometry.coordinates[1]}>
            <div className="flex flex-col">
              <div className="text-xs font-bold">{category}</div>
            </div>
          </Marker>
        );
      })}
    </>
  );
};

export default Markers;
