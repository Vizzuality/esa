/**
 *
 * PluginInput
 *
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MapProvider } from 'react-map-gl';

import { useIntl } from 'react-intl';

import {
  Stack,
  Typography,
  Button,
  TextInput,
  Flex,
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Box,
} from '@strapi/design-system';

import { MediaLibraryInput } from '@strapi/plugin-upload/admin/src/components/MediaLibraryInput';
import { useCMEditViewDataManager } from '@strapi/helper-plugin';

import 'mapbox-gl/dist/mapbox-gl.css';
import { MarkerDragEvent } from 'react-map-gl/dist/esm/types';
import Media from '../PluginMedia';
import Map from '../Map';
import { LocationType, MarkerType } from '../../types';
import MapInputs from '../MapInputs';

const id = 'default';

const map_location_inputs = ['longitude', 'latitude', 'zoom', 'bearing', 'pitch'];
const map_marker_inputs = ['lat', 'lng'];

const PluginInput = ({ name, intlLabel, value, onChange, ...rest }) => {
  const { formatMessage } = useIntl();

  // Open the map in the story location if there is a story marker
  const CMEditViewDataManager = useCMEditViewDataManager();
  const storyMarkerLocation: LocationType | undefined = useMemo(() => {
    if (CMEditViewDataManager?.modifiedData?.marker) {
      const parsedData = JSON.parse(CMEditViewDataManager?.modifiedData?.marker);
      if (parsedData?.markers?.length) {
        const storyMarker = parsedData?.markers[0];
        return {
          latitude: storyMarker.lat,
          longitude: storyMarker.lng,
          zoom: parsedData?.location?.zoom,
          bearing: parsedData?.location?.bearing,
          pitch: parsedData?.location?.pitch,
          padding: parsedData?.location?.padding,
          bbox: parsedData?.location?.bbox,
        };
      }
    }
  }, [CMEditViewDataManager?.modifiedData?.marker]);

  // Location type: if the map is setting the story marker in the globe (type === marker) or the location in map steps (type === map)
  const locationType = rest.attribute.options?.format || 'map';

  // Map modal
  const [open, setOpen] = useState(false);

  // Location
  const initialState = (value && JSON.parse(value)) || { location: storyMarkerLocation };
  const [location, setLocation] = useState<LocationType>(initialState?.location);

  const handleMoveEnd = useCallback((_location: LocationType) => {
    setLocation(_location);
  }, []);

  // Markers
  const [markers, setMarkers] = useState<MarkerType[]>(initialState?.markers || []);
  const [editingMarker, setEditingMarker] = useState<MarkerType | null>(null);

  const handleAddMarker = (e: mapboxgl.MapLayerMouseEvent) => {
    const markerId = Date.now();
    const newMarker = {
      ...e.lngLat,
      name: `New marker ${markerId}`,
      id: markerId,
      media: null,
    };
    if (locationType === 'marker') {
      setMarkers([{ ...newMarker, isStoryMarker: true }]);
      setEditingMarker(null);
      return;
    }
    setEditingMarker(newMarker);
  };

  const handleEditMarker = (marker: MarkerType) => {
    setEditingMarker(marker);
  };

  const handleDragMarker = (e: MarkerDragEvent<mapboxgl.Marker>, marker: MarkerType) => {
    const editMarker = {
      ...marker,
      ...e.lngLat,
    };
    setMarkers(markers.map((_marker) => (_marker.id === marker.id ? editMarker : _marker)));
  };

  const handleSaveMarker = async () => {
    if (!editingMarker?.id) return;

    if (!markers.find((marker) => marker.id === editingMarker?.id)) {
      setMarkers([...markers, editingMarker]);
    } else {
      setMarkers(
        markers.map((marker) => {
          if (!!editingMarker?.id && marker.id === editingMarker?.id) {
            return editingMarker;
          }
          return marker;
        })
      );
    }
    setEditingMarker(null);
  };

  const handleChangeMarker = (e: any) => {
    if (!editingMarker?.id) return;
    const { name, value } = e.target;
    setEditingMarker({ ...editingMarker, [name]: value });
  };

  const handleDeleteMarker = () => {
    setMarkers(markers.filter((marker) => marker.id !== editingMarker?.id));
    setEditingMarker(null);
  };

  const handleChangeMedia = (e: any) => {
    if (!editingMarker?.id) return;
    setEditingMarker({ ...editingMarker, media: e.target.value });
  };

  // Update input value
  useEffect(() => {
    onChange({ target: { name, value: JSON.stringify({ markers, location }), type: 'json' } });
  }, [markers, location]);

  const isEditing = markers.find((marker) => marker.id === editingMarker?.id);

  const storyMarker = useMemo(
    () => (locationType === 'marker' && markers.length ? markers[0] : undefined),
    [markers, locationType]
  );

  return (
    <Flex gap={4} align-center>
      <Box>
        <Typography textColor="neutral800" as="label" variant="pi" fontWeight="bold">
          {formatMessage(intlLabel)}
        </Typography>
      </Box>
      <Box>
        <Button onClick={() => setOpen(true)}>
          {locationType === 'marker'
            ? `${markers.length ? 'Edit' : 'Add '} story marker`
            : location?.latitude
            ? 'Edit location'
            : 'Add location'}
        </Button>
      </Box>
      {open && (
        <ModalLayout onClose={() => setOpen(false)}>
          <ModalHeader>
            <Typography textColor="neutral800" as="label" variant="pi">
              {/* Explain that this map is for setting the location, zoom, rotation and tilt of the map. */}
              <p>
                Click on the map to add a marker. You can drag the marker to change its location.
              </p>
            </Typography>
          </ModalHeader>
          <ModalBody>
            <MapProvider>
              <Map
                id={id}
                initialState={initialState?.location}
                markers={markers}
                handleAddMarker={handleAddMarker}
                handleMoveEnd={handleMoveEnd}
                handleDragMarker={handleDragMarker}
                handleEditMarker={handleEditMarker}
                location={location}
              />
              {locationType !== 'marker' && location && (
                <MapInputs
                  inputs={[
                    ...Object.entries(location).filter(([key]) =>
                      map_location_inputs.includes(key)
                    ),
                  ]}
                  locationType="map"
                  handleChange={(k, v) => setLocation((_l) => ({ ..._l, [k]: v }))}
                />
              )}
            </MapProvider>
            <div>
              {editingMarker?.id && (
                <ModalLayout onClose={() => setEditingMarker(null)} labelledBy="title">
                  <ModalHeader>
                    <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
                      {isEditing ? 'Edit' : 'Add'} marker
                    </Typography>
                  </ModalHeader>
                  <ModalBody>
                    <TextInput
                      onChange={handleChangeMarker}
                      name="name"
                      label="Name"
                      value={editingMarker.name}
                    />
                    <Box marginTop={6}>
                      <Typography
                        marginBotton={6}
                        htmlFor="media"
                        textColor="neutral800"
                        as="label"
                        id="title"
                      >
                        Media
                      </Typography>
                      <Flex gap={10} marginTop={2}>
                        <Box>
                          <MediaLibraryInput
                            intlLabel={{ id: 'add-marker', defaultMessage: 'Add marker' }}
                            onChange={handleChangeMedia}
                            name="media"
                            id="media"
                            attribute={{
                              allowedTypes: ['videos', 'images', 'audios'],
                            }}
                          />
                        </Box>
                        <Box>
                          {editingMarker?.media?.url && (
                            <Media
                              width="150px"
                              height="150px"
                              name={editingMarker?.name}
                              media={editingMarker?.media}
                            />
                          )}
                        </Box>
                      </Flex>
                    </Box>
                  </ModalBody>
                  <ModalFooter
                    startActions={
                      isEditing ? (
                        <Button onClick={handleDeleteMarker} variant="danger">
                          Delete
                        </Button>
                      ) : null
                    }
                    endActions={
                      <>
                        <Button onClick={() => setEditingMarker(null)} variant="tertiary">
                          Cancel
                        </Button>
                        <Button onClick={handleSaveMarker}>Save</Button>
                      </>
                    }
                  />
                </ModalLayout>
              )}
            </div>
            {locationType === 'marker'
              ? !!storyMarker && (
                  <MapInputs
                    inputs={Object.entries(storyMarker).filter(([key]) =>
                      map_marker_inputs.includes(key)
                    )}
                    handleChange={(k, v) => setMarkers((_m) => [{ ..._m[0], [k]: v }])}
                  />
                )
              : null}
          </ModalBody>
        </ModalLayout>
      )}
    </Flex>
  );
};

export default PluginInput;
