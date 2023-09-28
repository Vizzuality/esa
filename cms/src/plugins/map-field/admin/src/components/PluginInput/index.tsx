/**
 *
 * PluginInput
 *
 */
import React, { useCallback, useEffect, useState } from 'react';
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

import 'mapbox-gl/dist/mapbox-gl.css';
import { MarkerDragEvent } from 'react-map-gl/dist/esm/types';
import Media from '../PluginMedia';
import Map from '../Map';
import { LocationType, MarkerType } from '../../types';

const id = 'default';

const PluginInput = ({ name, intlLabel, value, onChange }) => {
  const { formatMessage } = useIntl();

  // Location
  const initialState = (value && JSON.parse(value)) || null;
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

  const handleChangeMarker = (e) => {
    if (!editingMarker?.id) return;
    const { name, value } = e.target;
    setEditingMarker({ ...editingMarker, [name]: value });
  };

  const handleDeleteMarker = () => {
    setMarkers(markers.filter((marker) => marker.id !== editingMarker?.id));
    setEditingMarker(null);
  };

  const handleChangeMedia = (e) => {
    if (!editingMarker?.id) return;
    setEditingMarker({ ...editingMarker, media: e.target.value });
  };

  // Update input value
  useEffect(() => {
    onChange({ target: { name, value: JSON.stringify({ markers, location }), type: 'json' } });
  }, [markers, location]);

  const isEditing = markers.find((marker) => marker.id === editingMarker?.id);

  return (
    <Stack spacing={4}>
      <Typography textColor="neutral800" as="label" variant="pi" fontWeight="bold">
        {formatMessage(intlLabel)}
      </Typography>

      <Typography textColor="neutral800" as="label" variant="pi">
        {/* Explain that this map is for setting the location, zoom, rotation and tilt of the map. */}
        <p>
          This map is for setting the location, zoom and rotation of the map. You can use the
          controls in the top right to change the zoom and rotation.
        </p>
        <p>The same view you see here will be the same view your users will see.</p>
        <p>Click on the map to add a marker. You can drag the marker to change its location.</p>
      </Typography>

      <MapProvider>
        <Map
          id={id}
          initialState={initialState?.location}
          markers={markers}
          handleAddMarker={handleAddMarker}
          handleMoveEnd={handleMoveEnd}
          handleDragMarker={handleDragMarker}
          handleEditMarker={handleEditMarker}
        />
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
    </Stack>
  );
};

export default PluginInput;
