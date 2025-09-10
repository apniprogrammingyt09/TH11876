import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB Configuration
MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = "cctv_management"
COLLECTION_NAME = "cctvs"

# Server Configuration
HOST = "0.0.0.0"
PORT = 8000

# Streaming Configuration
FRAME_RATE = 10
JPEG_QUALITY = 80