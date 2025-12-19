"""
This module contains a dataclass for SatelliteImageryData, which stores parameters for different
satellite imagery datasets from Google Earth Engine.
"""

import datetime
from dataclasses import dataclass

import ee
import numpy as np

NOW = datetime.datetime.now()


@dataclass
class SatelliteImageryData:
    """
    A dataclass for storing parameters for different satellite imagery datasets from
    Google Earth Engine.
    """

    dataset: str = None
    instrument: str = None

    @property
    def collections(self):
        """
        Returns the Earth Engine collection corresponding to the dataset.
        """
        return {
            "Sentinel-2-Top-of-Atmosphere-Reflectance": "COPERNICUS/S2_HARMONIZED",
            "Landsat-4-Surface-Reflectance": "LANDSAT/LT04/C01/T1_SR",
            "Landsat-5-Surface-Reflectance": "LANDSAT/LT05/C01/T1_SR",
            "Landsat-7-Surface-Reflectance": "LANDSAT/LE07/C01/T1_SR",
            "Landsat-8-Surface-Reflectance": "LANDSAT/LC08/C01/T1_SR",
            "Landsat-457-Surface-Reflectance": [
                "LANDSAT/LT04/C01/T1_SR",
                "LANDSAT/LT05/C01/T1_SR",
                "LANDSAT/LE07/C01/T1_SR",
            ],
        }[self.dataset]

    @property
    def bands(self):
        """
        Returns the list of bands for the given dataset.
        """
        return {
            "Sentinel-2-Top-of-Atmosphere-Reflectance": [
                "B1",
                "B2",
                "B3",
                "B4",
                "B5",
                "B6",
                "B7",
                "B8A",
                "B8",
                "B11",
                "B12",
                "NDVI",
                "NDWI",
            ],
            "Landsat-4-Surface-Reflectance": [
                "B1",
                "B2",
                "B3",
                "B4",
                "B5",
                "B6",
                "B7",
                "NDVI",
                "NDWI",
            ],
            "Landsat-5-Surface-Reflectance": [
                "B1",
                "B2",
                "B3",
                "B4",
                "B5",
                "B6",
                "B7",
                "NDVI",
                "NDWI",
            ],
            "Landsat-7-Surface-Reflectance": [
                "B1",
                "B2",
                "B3",
                "B4",
                "B5",
                "B6",
                "B7",
                "NDVI",
                "NDWI",
            ],
            "Landsat-457-Surface-Reflectance": [
                "B1",
                "B2",
                "B3",
                "B4",
                "B5",
                "B6",
                "B7",
                "NDVI",
                "NDWI",
            ],
            "Landsat-8-Surface-Reflectance": [
                "B1",
                "B2",
                "B3",
                "B4",
                "B5",
                "B6",
                "B7",
                "B10",
                "B11",
                "NDVI",
                "NDWI",
            ],
        }[self.dataset]

    @property
    def rgb_bands(self):
        """
        Returns the list of RGB bands for the given dataset.
        """
        return {
            "Sentinel-2-Top-of-Atmosphere-Reflectance": ["B4", "B3", "B2"],
            "Landsat-4-Surface-Reflectance": ["B3", "B2", "B1"],
            "Landsat-5-Surface-Reflectance": ["B3", "B2", "B1"],
            "Landsat-7-Surface-Reflectance": ["B3", "B2", "B1"],
            "Landsat-457-Surface-Reflectance": ["B3", "B2", "B1"],
            "Landsat-8-Surface-Reflectance": ["B4", "B3", "B2"],
        }[self.dataset]

    @property
    def band_names(self):
        """
        Returns the list of band names for the given dataset.
        """
        return {
            "Sentinel-2-Top-of-Atmosphere-Reflectance": ["RGB", "NDVI", "NDWI"],
            "Landsat-4-Surface-Reflectance": ["RGB", "NDVI", "NDWI"],
            "Landsat-5-Surface-Reflectance": ["RGB", "NDVI", "NDWI"],
            "Landsat-7-Surface-Reflectance": ["RGB", "NDVI", "NDWI"],
            "Landsat-457-Surface-Reflectance": ["RGB", "NDVI", "NDWI"],
            "Landsat-8-Surface-Reflectance": ["RGB", "NDVI", "NDWI"],
        }[self.dataset]

    @property
    def scale(self):
        """
        Returns the scale for the given dataset.
        """
        return {
            "Sentinel-2-Top-of-Atmosphere-Reflectance": 10,
            "Landsat-4-Surface-Reflectance": 30,
            "Landsat-5-Surface-Reflectance": 30,
            "Landsat-7-Surface-Reflectance": 30,
            "Landsat-457-Surface-Reflectance": 30,
            "Landsat-8-Surface-Reflectance": 30,
        }[self.dataset]

    @property
    def vizz_params_rgb(self):
        """
        Returns the visualization parameters for RGB bands for the given dataset.
        """
        return {
            "Sentinel-2-Top-of-Atmosphere-Reflectance": {
                "min": 0,
                "max": 0.3,
                "bands": ["B4", "B3", "B2"],
            },
            "Landsat-4-Surface-Reflectance": {
                "min": 0,
                "max": 3000,
                "gamma": 1.4,
                "bands": ["B3", "B2", "B1"],
            },
            "Landsat-5-Surface-Reflectance": {
                "min": 0,
                "max": 3000,
                "gamma": 1.4,
                "bands": ["B3", "B2", "B1"],
            },
            "Landsat-7-Surface-Reflectance": {
                "min": 0,
                "max": 3000,
                "gamma": 1.4,
                "bands": ["B3", "B2", "B1"],
            },
            "Landsat-457-Surface-Reflectance": {
                "min": 0,
                "max": 3000,
                "gamma": 1.4,
                "bands": ["B3", "B2", "B1"],
            },
            "Landsat-8-Surface-Reflectance": {
                "min": 0,
                "max": 3000,
                "gamma": 1.4,
                "bands": ["B4", "B3", "B2"],
            },
        }[self.dataset]

    @property
    def vizz_params(self):
        """
        Returns the visualization parameters for the given dataset.
        """
        return {
            "Sentinel-2-Top-of-Atmosphere-Reflectance": [
                {"min": 0, "max": 0.3, "bands": ["B4", "B3", "B2"]},
                {"min": -1, "max": 1, "bands": ["NDVI"]},
                {"min": -1, "max": 1, "bands": ["NDWI"]},
            ],
            "Landsat-4-Surface-Reflectance": [
                {"min": 0, "max": 3000, "gamma": 1.4, "bands": ["B3", "B2", "B1"]},
                {"min": -1, "max": 1, "gamma": 1.4, "bands": ["NDVI"]},
                {"min": -1, "max": 1, "gamma": 1.4, "bands": ["NDWI"]},
            ],
            "Landsat-5-Surface-Reflectance": [
                {"min": 0, "max": 3000, "gamma": 1.4, "bands": ["B3", "B2", "B1"]},
                {"min": -1, "max": 1, "gamma": 1.4, "bands": ["NDVI"]},
                {"min": -1, "max": 1, "gamma": 1.4, "bands": ["NDWI"]},
            ],
            "Landsat-7-Surface-Reflectance": [
                {"min": 0, "max": 3000, "gamma": 1.4, "bands": ["B3", "B2", "B1"]},
                {"min": -1, "max": 1, "gamma": 1.4, "bands": ["NDVI"]},
                {"min": -1, "max": 1, "gamma": 1.4, "bands": ["NDWI"]},
            ],
            "Landsat-457-Surface-Reflectance": [
                {"min": 0, "max": 3000, "gamma": 1.4, "bands": ["B3", "B2", "B1"]},
                {"min": -1, "max": 1, "gamma": 1.4, "bands": ["NDVI"]},
                {"min": -1, "max": 1, "gamma": 1.4, "bands": ["NDWI"]},
            ],
            "Landsat-8-Surface-Reflectance": [
                {"min": 0, "max": 3000, "gamma": 1.4, "bands": ["B4", "B3", "B2"]},
                {"min": -1, "max": 1, "gamma": 1.4, "bands": ["NDVI"]},
                {"min": -1, "max": 1, "gamma": 1.4, "bands": ["NDWI"]},
            ],
        }[self.dataset]

    @property
    def time_steps(self):
        """
        Returns the number of time steps for the given dataset.
        """
        return {
            "Sentinel-2-Top-of-Atmosphere-Reflectance": 1,
            "Landsat-457-Surface-Reflectance": 4,
            "Landsat-8-Surface-Reflectance": 1,
        }[self.dataset]

    @property
    def step_range(self):
        """
        Composite years time step ranges
        """
        return {
            "Sentinel-2-Top-of-Atmosphere-Reflectance": [-1, 0],
            "Landsat-457-Surface-Reflectance": [-2, 2],
            "Landsat-8-Surface-Reflectance": [-1, 0],
        }[self.dataset]

    @property
    def date_range(self):
        """
        Returns the date range for the given instrument.
        """
        return {
            "Landsat": {
                "Landsat-457-Surface-Reflectance": np.arange(1985, 2012 + 1),
                "Landsat-8-Surface-Reflectance": np.arange(2013, NOW.year),
            },
            "Sentinel": {"Sentinel-2-Top-of-Atmosphere-Reflectance": np.arange(2016, NOW.year)},
        }[self.instrument]

    @property
    def composite(self):
        """
        Returns the composite function for the given dataset.
        """
        return {
            "Sentinel-2-Top-of-Atmosphere-Reflectance": cloud_free_composite_s2,
            "Landsat-4-Surface-Reflectance": cloud_free_composite_l,
            "Landsat-5-Surface-Reflectance": cloud_free_composite_l,
            "Landsat-7-Surface-Reflectance": cloud_free_composite_l7,
            "Landsat-457-Surface-Reflectance": cloud_free_composite_l457,
            "Landsat-8-Surface-Reflectance": cloud_free_composite_l8,
        }[self.dataset]


## ------------------------- Filter datasets ------------------------- ##
## Lansat 4, 5 and 7 Cloud Free Composite
def cloud_mask_l457(image):
    """
    Masks out cloudy pixels in Landsat 4, 5, and 7 SR imagery using the pixel_qa band.
    """
    qa = image.select("pixel_qa")
    # If the cloud bit (5) is set and the cloud confidence (7) is high
    # or the cloud shadow bit is set (3), then it's a bad pixel.
    cloud = qa.bitwiseAnd(1 << 5).And(qa.bitwiseAnd(1 << 7)).Or(qa.bitwiseAnd(1 << 3))
    # Remove edge pixels that don't occur in all bands
    mask2 = image.mask().reduce(ee.Reducer.min())
    return image.updateMask(cloud.Not()).updateMask(mask2)


def cloud_free_composite_l(collection_id, start_date, stop_date):
    """
    Returns a cloud-free composite image from a given image collection.

    Args:
    collection_id (str): The ID of the image collection to use.
    start_date (str): The start date of the time range to filter by, in yyyy-mm-dd format.
    stop_date (str): The end date of the time range to filter by, in yyyy-mm-dd format.

    Returns:
    ee.Image: The cloud-free composite image.
    """
    ## Define your collection
    collection = ee.ImageCollection(collection_id)

    ## Filter
    collection = collection.filterDate(start_date, stop_date).map(cloud_mask_l457)

    ## Composite
    composite = collection.median()

    return composite


## Lansat 4 Cloud Free Composite
def cloud_free_composite_l4(start_date, stop_date):
    """
    Returns a cloud-free composite image from a given Landsat 4 image collection.

    Args:
    start_date (str): The start date of the time range to filter by, in yyyy-mm-dd format.
    stop_date (str): The end date of the time range to filter by, in yyyy-mm-dd format.

    Returns:
    ee.Image: The cloud-free composite image.
    """
    ## Define your collections
    collection_l4 = ee.ImageCollection("LANDSAT/LT04/C01/T1_SR")

    ## Filter
    collection_l4 = collection_l4.filterDate(start_date, stop_date).map(cloud_mask_l457)

    ## Composite
    composite = collection_l4.median()

    return composite


## Lansat 5 Cloud Free Composite
def cloud_free_composite_l5(start_date, stop_date):
    """
    Returns a cloud-free composite image from a given Landsat 5 image collection.

    Args:
    start_date (str): The start date of the time range to filter by, in yyyy-mm-dd format.
    stop_date (str): The end date of the time range to filter by, in yyyy-mm-dd format.

    Returns:
    ee.Image: The cloud-free composite image.
    """
    ## Define your collections
    collection_l5 = ee.ImageCollection("LANDSAT/LT05/C01/T1_SR")

    ## Filter
    collection_l5 = collection_l5.filterDate(start_date, stop_date).map(cloud_mask_l457)

    ## Composite
    composite = collection_l5.median()

    return composite


## Lansat 4 + 5 + 7 Cloud Free Composite
def cloud_free_composite_l457(start_date, stop_date):
    """
    Returns a cloud-free composite image from a given Landsat 4, 5, and 7 image collection.

    Args:
    start_date (str): The start date of the time range to filter by, in yyyy-mm-dd format.
    stop_date (str): The end date of the time range to filter by, in yyyy-mm-dd format.

    Returns:
    ee.Image: The cloud-free composite image.
    """
    ## Define your collections
    collection_l4 = ee.ImageCollection("LANDSAT/LT04/C01/T1_SR")
    collection_l5 = ee.ImageCollection("LANDSAT/LT05/C01/T1_SR")
    collection_l7 = ee.ImageCollection("LANDSAT/LE07/C01/T1_SR")

    ## Filter
    collection_l4 = collection_l4.filterDate(start_date, stop_date).map(cloud_mask_l457)
    collection_l5 = collection_l5.filterDate(start_date, stop_date).map(cloud_mask_l457)
    collection_l7 = collection_l7.filterDate(start_date, stop_date).map(cloud_mask_l457)

    ## merge collections
    collection = collection_l4.merge(collection_l5).merge(collection_l7)

    ## Composite
    composite = collection.median()

    return composite


## Lansat 7 Cloud Free Composite
def cloud_mask_l7sr(image):
    """
    Masks clouds and cloud shadows in a Landsat 7 SR image using the pixel_qa band.

    Args:
    image (ee.Image): The Landsat 7 SR image to mask.

    Returns:
    ee.Image: The masked image.
    """
    qa = image.select("pixel_qa")
    # If the cloud bit (5) is set and the cloud confidence (7) is high
    # or the cloud shadow bit is set (3), then it's a bad pixel.
    cloud = qa.bitwiseAnd(1 << 5).And(qa.bitwiseAnd(1 << 7)).Or(qa.bitwiseAnd(1 << 3))
    # Remove edge pixels that don't occur in all bands
    mask2 = image.mask().reduce(ee.Reducer.min())
    return image.updateMask(cloud.Not()).updateMask(mask2)


def cloud_free_composite_l7(start_date, stop_date):
    """
    Returns a cloud-free composite image from a given Landsat 7 image collection.

    Args:
    start_date (str): The start date of the time range to filter by, in yyyy-mm-dd format.
    stop_date (str): The end date of the time range to filter by, in yyyy-mm-dd format.

    Returns:
    ee.Image: The cloud-free composite image.
    """
    ## Define your collection
    collection = ee.ImageCollection("LANDSAT/LE07/C01/T1_SR")

    ## Filter
    collection = collection.filterDate(start_date, stop_date).map(cloud_mask_l7sr)

    ## Composite
    composite = collection.median()

    ## normDiff bands
    norm_diff_band_names = ["NDVI", "NDWI"]
    for n, norm_diff_band in enumerate([["B4", "B3"], ["B4", "B2"]]):
        image_nd = composite.normalizedDifference(norm_diff_band).rename(norm_diff_band_names[n])
        composite = ee.Image.cat([composite, image_nd])

    return composite


## Lansat 8 Cloud Free Composite
def cloud_mask_l8sr(image):
    """
    Masks clouds and cloud shadows in a Landsat 8 SR image using the pixel_qa band.

    Args:
    image (ee.Image): The Landsat 8 SR image to mask.

    Returns:
    ee.Image: The masked image.
    """
    optical_bands = ["B1", "B2", "B3", "B4", "B5", "B6", "B7"]

    cloud_shadow_bit_mask = ee.Number(2).pow(3).int()
    clouds_bit_mask = ee.Number(2).pow(5).int()
    qa = image.select("pixel_qa")
    mask1 = qa.bitwiseAnd(cloud_shadow_bit_mask).eq(0).And(qa.bitwiseAnd(clouds_bit_mask).eq(0))
    mask2 = image.mask().reduce("min")
    mask3 = (
        image.select(optical_bands).gt(0).And(image.select(optical_bands).lt(10000)).reduce("min")
    )
    mask = mask1.And(mask2).And(mask3)

    return image.updateMask(mask)


def cloud_free_composite_l8(start_date, stop_date):
    """
    Returns a cloud-free composite image from a given Landsat 8 image collection.

    Args:
    start_date (str): The start date of the time range to filter by, in yyyy-mm-dd format.
    stop_date (str): The end date of the time range to filter by, in yyyy-mm-dd format.

    Returns:
    ee.Image: The cloud-free composite image.
    """
    ## Define your collection
    collection = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR")

    ## Filter
    collection = collection.filterDate(start_date, stop_date).map(cloud_mask_l8sr)

    ## Composite
    composite = collection.median()

    ### normDiff bands
    # norm_diff_band_names = ['NDVI', 'NDWI']
    # for nb, norm_diff_band in enumerate([['B5','B4'], ['B5','B3']]):
    #    image_nd = composite.normalizedDifference(norm_diff_band).rename(norm_diff_band_names[nb])
    #    composite = ee.Image.cat([composite, image_nd])

    return composite


## Sentinel 2 Cloud Free Composite
def cloud_mask_s2(image):
    """
    Masks clouds and cirrus in a Sentinel-2 image using the QA60 band.

    Args:
    image (ee.Image): The Sentinel-2 image to mask.

    Returns:
    ee.Image: The masked image.
    """
    qa = image.select("QA60")

    # Bits 10 and 11 are clouds and cirrus, respectively.
    cloud_bit_mask = 1 << 10  # int(2**10)
    cirrus_bit_mask = 1 << 11  # int(2**11)

    # Both flags set to zero indicates clear conditions.
    mask = qa.bitwiseAnd(cloud_bit_mask).eq(0).And(qa.bitwiseAnd(cirrus_bit_mask).eq(0))

    return image.updateMask(mask).divide(10000)


def cloud_free_composite_s2(start_date, stop_date):
    """
    Generates a cloud-free composite image from a given Sentinel-2 image collection.

    Args:
    start_date (str): The start date of the time range to filter by, in 'YYYY-MM-DD' format.
    stop_date (str): The end date of the time range to filter by, in 'YYYY-MM-DD' format.

    Returns:
    ee.Image: The cloud-free composite image with added NDVI and NDWI bands.
    """
    ## Define your collection
    collection = ee.ImageCollection("COPERNICUS/S2_HARMONIZED")

    ## Filter
    collection = (
        collection.filterDate(start_date, stop_date)
        .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 20))
        .map(cloud_mask_s2)
    )

    ## Composite
    composite = collection.median()

    ## normDiff bands
    norm_diff_band_names = ["NDVI", "NDWI"]
    for nb, norm_diff_band in enumerate([["B8", "B4"], ["B8", "B3"]]):
        image_nd = composite.normalizedDifference(norm_diff_band).rename(norm_diff_band_names[nb])
        composite = ee.Image.cat([composite, image_nd])

    return composite
