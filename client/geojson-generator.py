import geojson
import random
import geopandas as gpd
from shapely.geometry import Point

# Load land geometries from Natural Earth dataset (1:10m scale)
world = gpd.read_file(gpd.datasets.get_path('naturalearth_lowres'))

# Define latitude range to avoid poles (approximately ±70 degrees)
min_latitude = -50
max_latitude = 70

# Function to generate random coordinates within land boundaries and latitude range
def generate_random_coordinates_within_land_and_range():
    while True:
        longitude = random.uniform(-180, 180)
        latitude = random.uniform(min_latitude, max_latitude)
        point = Point(longitude, latitude)
        if world.geometry.contains(point).any():
            return longitude, latitude

# Sample data for categories, IFIs, statuses, and tags
categories = ['farm', 'urban', 'mountain']
ifis = ['World bank', 'ADB', 'IFAD']
statuses = ['completed', 'in progress']
tags = ['agriculture', 'rural', 'city', 'development', 'nature', 'scenic']

# Generate 100 random features within land boundaries and excluding polar regions
features = []
for idx in range(100):
    coordinates = generate_random_coordinates_within_land_and_range()
    properties = {
        "category": random.choice(categories),
        "ifi": random.choice(ifis),
        "status": random.choice(statuses),
        "tags": random.sample(tags, random.randint(1, 3))
    }
    point = geojson.Point(coordinates)
    feature = geojson.Feature(geometry=point, properties=properties, id=idx + 1)
    features.append(feature)

# Create FeatureCollection
feature_collection = geojson.FeatureCollection(features)

# Write to the specified GeoJSON file
output_path = "client/src/constants/markers.json"
with open(output_path, "w") as f:
    geojson.dump(feature_collection, f)
