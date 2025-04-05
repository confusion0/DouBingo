import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_TOKEN = os.getenv("HUGGING_FACE_API")

# model to use
API_URL = "https://api-inference.huggingface.co/models/microsoft/resnet-50"

animals = [
    "Squirrel",
    "Raccoon",
    "White-tailed Deer",
    "Coyote",
    "Canada Goose",
    "Rabbit",
    "Skunk",
    "Chipmunk",
    "Groundhog",
    "Red Fox",
    "Black Bear",
    "Beaver",
    "Moose",
    "Bald Eagle",
    "Crow",
    "Seagull"
]

# image to classify
with open("squirrel.png", "rb") as f:
    image_bytes = f.read()

response = requests.post(
    API_URL,
    headers={"Authorization": f"Bearer {API_TOKEN}"},
    data=image_bytes
)

if response.status_code == 200:
    try:
        predictions = response.json()
        for item in predictions:
            label = item["label"]
            score = item["score"]
            print(f"{label}: {score:.2%}")
    except Exception as e:
        print("Could not parse response as JSON:", e)
        print("Response text:", response.text)
else:
    print(f"Request failed with status code {response.status_code}:")
    print(response.text)
