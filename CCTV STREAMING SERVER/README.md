# CCTV Streaming Server

FastAPI server for streaming RTSP URLs from MongoDB Atlas.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Update MongoDB URI in `config.py` with your credentials

3. Run the server:
```bash
python run.py
```

## API Endpoints

- `GET /` - Server status
- `GET /streams` - Get all active CCTV streams
- `GET /stream/{stream_id}` - Get specific stream details
- `GET /video/{stream_id}` - Video stream endpoint
- `WebSocket /ws/{stream_id}` - WebSocket video stream

## Usage

Access video stream: `http://localhost:8000/video/68bd25bf103f15dc9997ef0e`

## MongoDB Document Structure

```json
{
  "_id": "68bd25bf103f15dc9997ef0e",
  "name": "rdtfhgj",
  "area": "1234567",
  "zone": "krgshbhagat",
  "location_type": "gate",
  "location_name": "1234567",
  "video_source": "rtsp://username:password@IP_address:port/server_URL",
  "source_type": "rtsp",
  "status": "active",
  "created_at": "2025-09-07T06:27:11.863+00:00"
}
```