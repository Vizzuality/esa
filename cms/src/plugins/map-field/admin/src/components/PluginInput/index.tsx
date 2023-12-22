/**
 *
 * PluginInput
 *
 */
import './index.css';
import React, { useCallback, useMemo, useState } from 'react';
import { MapProvider } from 'react-map-gl';

import { useIntl } from 'react-intl';

import {
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
import StaticMap from '../StaticMap';
import { initialLocation, map_location_inputs, id, map_marker_inputs } from '../../constants';

const PluginInput = ({ name, intlLabel, value, onChange, ...rest }: any) => {
  const { formatMessage } = useIntl();

  // Open the map in the story location if there is a story marker
  const CMEditViewDataManager = useCMEditViewDataManager();

  // Location type: if the map is setting the story marker in the globe (type === marker) or the location in map steps (type === map)
  const locationType = rest.attribute.options?.format || 'map';

  const lastLocation: LocationType | undefined = useMemo(() => {
    // If there is a value in the input, do not set the location
    if (value && JSON.parse(value)?.location) {
      return;
    }

    // Take the story marker location from marker
    if (locationType === 'marker' && value) {
      const marker = JSON.parse(value)?.markers?.[0];
      if (marker) {
        return {
          ...initialLocation,
          latitude: marker.lat,
          longitude: marker.lng,
        };
      }
    }

    // Take the last step location
    const storySteps = CMEditViewDataManager?.modifiedData?.steps;
    if (Array.isArray(storySteps) && storySteps?.length) {
      const lastStepMap = [...storySteps].reverse().find((step) => step?.map)?.map;
      if (lastStepMap) {
        const parsedData = JSON.parse(lastStepMap);
        if (parsedData?.location) return parsedData?.location;
      }
    }

    // Take the story marker location
    if (CMEditViewDataManager?.modifiedData?.marker) {
      const parsedData = JSON.parse(CMEditViewDataManager?.modifiedData?.marker);
      if (parsedData?.markers?.length) {
        const storyMarker = parsedData?.markers[0];
        return {
          ...initialLocation,
          latitude: storyMarker.lat,
          longitude: storyMarker.lng,
        };
      }
    }
  }, [CMEditViewDataManager?.modifiedData?.marker, value, locationType]);

  // Map modal
  const [open, setOpen] = useState(false);

  // Location
  const initialState = useMemo(() => {
    const parsedValue = value && JSON.parse(value);
    return {
      location: parsedValue?.location || lastLocation,
      markers: parsedValue?.markers || [],
    };
  }, []);

  const [location, setLocation] = useState<LocationType>(initialState?.location);

  const handleMoveEnd = useCallback((_location: LocationType) => {
    setLocation(_location);
  }, []);

  // Markers
  const [markers, setMarkers] = useState<MarkerType[]>(initialState?.markers);
  const [editingMarker, setEditingMarker] = useState<MarkerType | null>(null);

  const handleAddMarker = (e: mapboxgl.MapLayerMouseEvent) => {
    const markerId = Date.now();
    const newMarker = {
      ...e.lngLat,
      name: `New marker ${markerId}`,
      id: markerId,
      media: null,
    };
    // If the location type is marker, only one marker is allowed
    if (locationType === 'marker') {
      setMarkers([newMarker]);
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

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    // Avoid submitting the Story form
    e.stopPropagation();
    e.preventDefault();
    // Save input value
    onChange({ target: { name, value: JSON.stringify({ markers, location }), type: 'json' } });
    setOpen(false);
  };

  const isEditing = markers.find((marker) => marker.id === editingMarker?.id);

  /** Story marker. The first marker when the location type 'marker' */
  const storyMarker = useMemo(
    () => (locationType === 'marker' && markers.length ? markers[0] : undefined),
    [markers, locationType]
  );

  const handleCancel = () => {
    setOpen(false);
    setLocation(initialState?.location);
    setEditingMarker(null);
    setMarkers(initialState?.markers || []);
  };

  /** Inputs used when location type is 'map' */
  const locationInputs =
    location &&
    (Object.entries(location)
      .filter(([key]) => map_location_inputs.includes(key))
      .sort(([aKey], [bKey]) => (aKey > bKey ? 1 : -1)) as [string, number][]);

  return (
    <div>
      <Box marginBottom={1}>
        <Typography textColor="neutral800" as="label" variant="pi" fontWeight="bold">
          {formatMessage(intlLabel)} <span className="--required">*</span>
        </Typography>
      </Box>
      <Flex gap={4} align-center marginBottom={4}>
        <Box>
          {!open && <StaticMap locationType={locationType} location={location} markers={markers} />}
          <Box marginTop={1}>
            <Typography textColor="neutral800" as="p" variant="pi">
              This is an image of the selected location and may differ from the actual map.
            </Typography>
          </Box>
        </Box>
        <Box>
          <Button onClick={() => setOpen(true)}>
            {locationType === 'marker'
              ? `${markers.length ? 'Edit' : 'Add '}`
              : location?.latitude
              ? 'Edit'
              : 'Add'}
          </Button>
        </Box>
        {open && (
          <ModalLayout style={{ width: '60vw', maxHeight: '70vh' }} onClose={() => setOpen(false)}>
            <form onSubmit={handleSave}>
              <ModalHeader>
                <Typography textColor="neutral800" as="label" variant="pi">
                  {/* Explain that this map is for setting the location, zoom, rotation and tilt of the map. */}
                  <p>
                    Click on the map to add a marker. You can drag the marker to change its
                    location.
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
                    isStoryMarker={locationType === 'marker'}
                  />
                  {locationType !== 'marker' && location && (
                    <MapInputs
                      inputs={locationInputs}
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
              <ModalFooter
                endActions={
                  <>
                    <Button onClick={handleCancel} variant="tertiary">
                      Cancel
                    </Button>
                    <Button type="submit">Save</Button>
                  </>
                }
              />
            </form>
          </ModalLayout>
        )}
      </Flex>
    </div>
  );
};

export default PluginInput;
