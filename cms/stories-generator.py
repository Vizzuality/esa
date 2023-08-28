import json
import random
import geopandas as gpd
from shapely.geometry import Point
from slugify import slugify
from faker import Faker
# Load land geometries from Natural Earth dataset (1:10m scale)
world = gpd.read_file(gpd.datasets.get_path('naturalearth_lowres'))

# Define latitude range to avoid poles (approximately ±80 degrees)
min_latitude = -60
max_latitude = 80

# Initialize Faker generator
fake = Faker()

# Function to generate random coordinates within land boundaries and latitude range
def generate_random_coordinates_within_land_and_range():
    while True:
        longitude = random.uniform(-180, 180)
        latitude = random.uniform(min_latitude, max_latitude)
        point = Point(longitude, latitude)
        if world.geometry.contains(point).any():
            return longitude, latitude

# Sample data for categories, IFIs, statuses, and tags
statuses = ['Completed', 'In progress']

# Generate 100 random features within land boundaries and excluding polar regions
features = []
for idx in range(100):
    coordinates = generate_random_coordinates_within_land_and_range()
    longitude, latitude = coordinates

    title = fake.catch_phrase()  # Generate a random title
    slug = slugify(title)
    status = random.choice(statuses)
    category_id = random.randint(1, 11)  # Generate random category ID from 1 to 11

    # Calculate bounding box with offsets
    bbox_offset = 0.1  # Adjust this offset as needed
    bbox = [
        longitude - bbox_offset,
        latitude - bbox_offset,
        longitude + bbox_offset,
        latitude + bbox_offset
    ]

    feature = {
        "title": title,
        "slug": slug,
        "status": status,
        "latitude": latitude,
        "longitude": longitude,
        "bbox": bbox,
        "category": category_id
    }

    features.append(feature)

# Write to the specified JSON array file
output_path = "client/src/constants/stories.json"
with open(output_path, "w") as f:
    json.dump(features, f, indent=2)
