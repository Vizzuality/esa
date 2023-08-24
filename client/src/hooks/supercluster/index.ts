import { useRef, useState } from 'react';

import { dequal } from 'dequal';
import Supercluster from 'supercluster';
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect';

import { Bbox } from '@/types/map';

export interface UseSuperclusterArgument<P, C> {
  points: Array<Supercluster.PointFeature<P>>;
  bounds?: Bbox;
  zoom: number;
  options?: Supercluster.Options<P, C>;
}

const useSupercluster = <
  P extends GeoJSON.GeoJsonProperties = Supercluster.AnyProps,
  C extends GeoJSON.GeoJsonProperties = Supercluster.AnyProps
>({
  points,
  bounds,
  zoom,
  options,
}: UseSuperclusterArgument<P, C>) => {
  const superclusterRef = useRef<Supercluster<P, C>>();
  const pointsRef = useRef<Array<Supercluster.PointFeature<P>>>();
  const [clusters, setClusters] = useState<
    Array<Supercluster.ClusterFeature<C> | Supercluster.PointFeature<P>>
  >([]);
  const zoomInt = Math.round(zoom);

  useDeepCompareEffectNoCheck(() => {
    if (
      !superclusterRef.current ||
      !dequal(pointsRef.current, points) ||
      !dequal(
        (
          superclusterRef.current as typeof superclusterRef.current & {
            options: typeof options;
          }
        ).options,
        options
      )
    ) {
      superclusterRef.current = new Supercluster(options);
      superclusterRef.current.load(points);
    }

    if (bounds) {
      setClusters(superclusterRef.current.getClusters(bounds, zoomInt));
    }

    pointsRef.current = points;
  }, [points, bounds, zoomInt, options]);

  return { clusters, supercluster: superclusterRef.current };
};

export default useSupercluster;
