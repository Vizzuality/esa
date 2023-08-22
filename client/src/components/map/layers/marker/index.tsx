import { Marker as RMarker, MarkerProps as RMarkerProps } from 'react-map-gl';

const Marker = (props: RMarkerProps) => {
  return (
    <RMarker {...props}>
      <div className="flex h-3 w-3 rotate-45 items-center justify-center border border-[#FFE094]">
        <div className="h-1.5 w-1.5 bg-[#FFE094]"></div>
      </div>
    </RMarker>
  );
};

export default Marker;
