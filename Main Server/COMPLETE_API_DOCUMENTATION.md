# Complete CCTV Management API Documentation

## Base URL
```
http://127.0.0.1:8000
```

---

# Table of Contents
1. [Authentication](#authentication)
2. [CCTV Management](#cctv-management)
3. [Area Management](#area-management)
4. [Zone Management](#zone-management)
5. [Gate Management](#gate-management)
6. [Pole Management](#pole-management)
7. [Marker Management](#marker-management)
8. [User Location & Tracking](#user-location--tracking)
9. [Statistics & Analytics](#statistics--analytics)
10. [Bulk Operations](#bulk-operations)
11. [Hierarchical Structure](#hierarchical-structure)
12. [Video Streaming](#video-streaming-endpoints)
13. [Debug Endpoints](#debug-endpoints)
14. [Error Responses](#error-responses)

---

# Authentication
Currently, no authentication is required for API endpoints.

---

# CCTV Management

## 1. Create CCTV
### Endpoint
```
POST /cctvs
```

### Request Body
```json
{
  "name": "Main Gate Camera 1",
  "area": "Entrance Area",
  "zone": "Gate Zone A",
  "location_type": "gate",
  "location_name": "Main Entrance Gate",
  "video_source": "rtsp://admin:password@192.168.1.100:554/stream",
  "source_type": "rtsp",
  "status": "active"
}
```

### Response
```json
{
  "id": "64f1a2b3c4d5e6f7g8h9i0j1",
  "name": "Main Gate Camera 1",
  "area": "Entrance Area",
  "zone": "Gate Zone A",
  "location_type": "gate",
  "location_name": "Main Entrance Gate",
  "video_source": "rtsp://admin:password@192.168.1.100:554/stream",
  "source_type": "rtsp",
  "status": "active",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

## 2. Get All CCTVs
### Endpoint
```
GET /cctvs
```

### Response
```json
[
  {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Main Gate Camera 1",
    "area": "Entrance Area",
    "zone": "Gate Zone A",
    "location_type": "gate",
    "location_name": "Main Entrance Gate",
    "video_source": "rtsp://admin:password@192.168.1.100:554/stream",
    "source_type": "rtsp",
    "status": "active",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
]
```

## 3. Get CCTV by ID
### Endpoint
```
GET /cctvs/{cctv_id}
```

### Parameters
- `cctv_id` (path): CCTV unique identifier

### Response
```json
{
  "id": "64f1a2b3c4d5e6f7g8h9i0j1",
  "name": "Main Gate Camera 1",
  "area": "Entrance Area",
  "zone": "Gate Zone A",
  "location_type": "gate",
  "location_name": "Main Entrance Gate",
  "video_source": "rtsp://admin:password@192.168.1.100:554/stream",
  "source_type": "rtsp",
  "status": "active",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

## 4. Update CCTV
### Endpoint
```
PUT /cctvs/{cctv_id}
```

### Request Body
```json
{
  "name": "Updated Camera Name",
  "status": "maintenance"
}
```

### Response
```json
{
  "id": "64f1a2b3c4d5e6f7g8h9i0j1",
  "name": "Updated Camera Name",
  "area": "Entrance Area",
  "zone": "Gate Zone A",
  "location_type": "gate",
  "location_name": "Main Entrance Gate",
  "video_source": "rtsp://admin:password@192.168.1.100:554/stream",
  "source_type": "rtsp",
  "status": "maintenance",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

## 5. Delete CCTV
### Endpoint
```
DELETE /cctvs/{cctv_id}
```

### Response
```json
{
  "message": "CCTV deleted successfully"
}
```

## 6. Search CCTVs
### Endpoint
```
GET /cctvs/search
```

### Query Parameters
- `name` (optional): Search by camera name
- `area` (optional): Filter by area
- `zone` (optional): Filter by zone
- `location_type` (optional): Filter by location type (gate/pole)
- `location_name` (optional): Search by location name
- `status` (optional): Filter by status

### Example
```
GET /cctvs/search?name=gate&status=active&location_type=gate
```

### Response
```json
{
  "query": {
    "name": "gate",
    "status": "active",
    "location_type": "gate"
  },
  "count": 2,
  "results": [
    {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "Main Gate Camera 1",
      "area": "Entrance Area",
      "zone": "Gate Zone A",
      "location_type": "gate",
      "location_name": "Main Entrance Gate",
      "video_source": "rtsp://admin:password@192.168.1.100:554/stream",
      "source_type": "rtsp",
      "status": "active",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

## 7. Get CCTVs by Area
### Endpoint
```
GET /cctvs/by-area/{area_name}
```

### Response
```json
[
  {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Main Gate Camera 1",
    "area": "Entrance Area",
    "zone": "Gate Zone A",
    "location_type": "gate",
    "location_name": "Main Entrance Gate",
    "video_source": "rtsp://admin:password@192.168.1.100:554/stream",
    "source_type": "rtsp",
    "status": "active",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
]
```

## 8. Get CCTVs by Zone
### Endpoint
```
GET /cctvs/by-zone/{zone_name}
```

## 9. Get CCTVs by Location Type
### Endpoint
```
GET /cctvs/by-location-type/{location_type}
```

### Parameters
- `location_type` (path): "gate" or "pole"

## 10. Get CCTVs by Status
### Endpoint
```
GET /cctvs/by-status/{status}
```

### Parameters
- `status` (path): "active", "inactive", or "maintenance"

## 11. Get CCTVs by Area and Zone
### Endpoint
```
GET /cctvs/by-area-zone/{area_name}/{zone_name}
```

### Parameters
- `area_name` (path): Area name
- `zone_name` (path): Zone name

### Response
```json
[
  {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Main Gate Camera 1",
    "area": "Entrance Area",
    "zone": "Gate Zone A",
    "location_type": "gate",
    "location_name": "Main Entrance Gate",
    "video_source": "rtsp://admin:password@192.168.1.100:554/stream",
    "source_type": "rtsp",
    "status": "active",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
]
```

## 12. Update CCTV Status
### Endpoint
```
PATCH /cctvs/{cctv_id}/status
```

### Query Parameters
- `status`: New status value

### Example
```
PATCH /cctvs/64f1a2b3c4d5e6f7g8h9i0j1/status?status=maintenance
```

### Response
```json
{
  "message": "CCTV status updated to maintenance"
}
```

---

# Area Management

## 1. Create Area
### Endpoint
```
POST /areas
```

### Request Body
```json
{
  "name": "Main Campus Area",
  "description": "Primary campus area with main buildings",
  "polygon": [
    [28.6139, 77.2090],
    [28.6145, 77.2095],
    [28.6142, 77.2100],
    [28.6136, 77.2095]
  ]
}
```

### Response
```json
{
  "id": "64f1a2b3c4d5e6f7g8h9i0j2",
  "name": "Main Campus Area",
  "description": "Primary campus area with main buildings",
  "polygon": [
    [28.6139, 77.2090],
    [28.6145, 77.2095],
    [28.6142, 77.2100],
    [28.6136, 77.2095]
  ],
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

## 2. Get All Areas
### Endpoint
```
GET /areas
```

### Response
```json
[
  {
    "id": "64f1a2b3c4d5e6f7g8h9i0j2",
    "name": "Main Campus Area",
    "description": "Primary campus area with main buildings",
    "polygon": [
      [28.6139, 77.2090],
      [28.6145, 77.2095],
      [28.6142, 77.2100],
      [28.6136, 77.2095]
    ],
    "created_at": "2024-01-15T10:30:00.000Z"
  }
]
```

## 3. Update Area
### Endpoint
```
PUT /areas/{area_id}
```

### Request Body
```json
{
  "name": "Updated Area Name",
  "description": "Updated description"
}
```

## 4. Delete Area
### Endpoint
```
DELETE /areas/{area_id}
```

### Response
```json
{
  "message": "Area deleted successfully"
}
```

## 5. Create Area with Map Coordinates
### Endpoint
```
POST /areas/map
```

### Request Body
```json
{
  "name": "Campus Area with Coordinates",
  "description": "Area with specific map coordinates",
  "coordinates": [
    [28.6139, 77.2090],
    [28.6145, 77.2095],
    [28.6142, 77.2100],
    [28.6136, 77.2095]
  ]
}
```

### Response
```json
{
  "id": "64f1a2b3c4d5e6f7g8h9i0j2",
  "name": "Campus Area with Coordinates",
  "description": "Area with specific map coordinates",
  "coordinates": [
    [28.6139, 77.2090],
    [28.6145, 77.2095],
    [28.6142, 77.2100],
    [28.6136, 77.2095]
  ],
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

---

# Zone Management

## 1. Create Zone
### Endpoint
```
POST /zones
```

### Request Body
```json
{
  "name": "Security Zone A",
  "area_id": "64f1a2b3c4d5e6f7g8h9i0j2",
  "description": "High security zone near main entrance",
  "polygon": [
    [28.6140, 77.2091],
    [28.6143, 77.2094],
    [28.6141, 77.2097],
    [28.6138, 77.2094]
  ]
}
```

### Response
```json
{
  "id": "64f1a2b3c4d5e6f7g8h9i0j3",
  "name": "Security Zone A",
  "area_id": "64f1a2b3c4d5e6f7g8h9i0j2",
  "area_name": "Main Campus Area",
  "description": "High security zone near main entrance",
  "polygon": [
    [28.6140, 77.2091],
    [28.6143, 77.2094],
    [28.6141, 77.2097],
    [28.6138, 77.2094]
  ],
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

## 2. Get All Zones
### Endpoint
```
GET /zones
```

## 3. Get Zones by Area
### Endpoint
```
GET /zones/by-area/{area_id}
```

## 4. Update Zone
### Endpoint
```
PUT /zones/{zone_id}
```

## 5. Delete Zone
### Endpoint
```
DELETE /zones/{zone_id}
```

### Response
```json
{
  "message": "Zone deleted successfully"
}
```

## 6. Create Zone with Map Polygon
### Endpoint
```
POST /zones/map
```

### Request Body
```json
{
  "name": "Security Zone with Polygon",
  "area_id": "64f1a2b3c4d5e6f7g8h9i0j2",
  "description": "Zone with specific polygon coordinates",
  "polygon": [
    [28.6140, 77.2091],
    [28.6143, 77.2094],
    [28.6141, 77.2097],
    [28.6138, 77.2094]
  ]
}
```

### Response
```json
{
  "id": "64f1a2b3c4d5e6f7g8h9i0j3",
  "name": "Security Zone with Polygon",
  "area_id": "64f1a2b3c4d5e6f7g8h9i0j2",
  "area_name": "Main Campus Area",
  "description": "Zone with specific polygon coordinates",
  "polygon": [
    [28.6140, 77.2091],
    [28.6143, 77.2094],
    [28.6141, 77.2097],
    [28.6138, 77.2094]
  ],
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

---

# Gate Management

## 1. Create Gate
### Endpoint
```
POST /gates
```

### Request Body
```json
{
  "name": "Main Entrance Gate",
  "area_id": "64f1a2b3c4d5e6f7g8h9i0j2",
  "zone_id": "64f1a2b3c4d5e6f7g8h9i0j3",
  "description": "Primary entrance gate with security checkpoint"
}
```

### Response
```json
{
  "id": "64f1a2b3c4d5e6f7g8h9i0j4",
  "name": "Main Entrance Gate",
  "area_id": "64f1a2b3c4d5e6f7g8h9i0j2",
  "zone_id": "64f1a2b3c4d5e6f7g8h9i0j3",
  "area_name": "Main Campus Area",
  "zone_name": "Security Zone A",
  "description": "Primary entrance gate with security checkpoint",
  "created_at": "2024-01-15T10:30:00.000Z",
  "lat": null,
  "lng": null
}
```

## 2. Create Gate with Coordinates
### Endpoint
```
POST /gates/map
```

### Request Body
```json
{
  "name": "Main Entrance Gate",
  "area_id": "64f1a2b3c4d5e6f7g8h9i0j2",
  "zone_id": "64f1a2b3c4d5e6f7g8h9i0j3",
  "description": "Primary entrance gate with security checkpoint",
  "lat": 28.6141,
  "lng": 77.2092
}
```

## 3. Get All Gates
### Endpoint
```
GET /gates
```

## 4. Get Gates by Zone
### Endpoint
```
GET /gates/by-zone/{zone_id}
```

## 5. Get Gates by Area
### Endpoint
```
GET /gates/by-area/{area_id}
```

## 6. Update Gate Coordinates
### Endpoint
```
PUT /gates/{gate_id}/coordinates
```

### Query Parameters
- `lat`: Latitude
- `lng`: Longitude

### Example
```
PUT /gates/64f1a2b3c4d5e6f7g8h9i0j4/coordinates?lat=28.6141&lng=77.2092
```

## 7. Update Gate
### Endpoint
```
PUT /gates/{gate_id}
```

### Request Body
```json
{
  "name": "Updated Gate Name",
  "description": "Updated gate description"
}
```

### Response
```json
{
  "id": "64f1a2b3c4d5e6f7g8h9i0j4",
  "name": "Updated Gate Name",
  "area_id": "64f1a2b3c4d5e6f7g8h9i0j2",
  "zone_id": "64f1a2b3c4d5e6f7g8h9i0j3",
  "area_name": "Main Campus Area",
  "zone_name": "Security Zone A",
  "description": "Updated gate description",
  "created_at": "2024-01-15T10:30:00.000Z",
  "lat": 28.6141,
  "lng": 77.2092
}
```

## 8. Delete Gate
### Endpoint
```
DELETE /gates/{gate_id}
```

### Response
```json
{
  "message": "Gate deleted successfully"
}
```

---

# Pole Management

## 1. Create Pole
### Endpoint
```
POST /poles
```

### Request Body
```json
{
  "name": "Security Pole 1",
  "area_id": "64f1a2b3c4d5e6f7g8h9i0j2",
  "zone_id": "64f1a2b3c4d5e6f7g8h9i0j3",
  "description": "CCTV mounting pole near entrance"
}
```

### Response
```json
{
  "id": "64f1a2b3c4d5e6f7g8h9i0j5",
  "name": "Security Pole 1",
  "area_id": "64f1a2b3c4d5e6f7g8h9i0j2",
  "zone_id": "64f1a2b3c4d5e6f7g8h9i0j3",
  "area_name": "Main Campus Area",
  "zone_name": "Security Zone A",
  "description": "CCTV mounting pole near entrance",
  "created_at": "2024-01-15T10:30:00.000Z",
  "lat": null,
  "lng": null
}
```

## 2. Create Pole with Coordinates
### Endpoint
```
POST /poles/map
```

## 3. Get All Poles
### Endpoint
```
GET /poles
```

## 4. Get Poles by Zone
### Endpoint
```
GET /poles/by-zone/{zone_id}
```

## 5. Get Poles by Area
### Endpoint
```
GET /poles/by-area/{area_id}
```

## 6. Update Pole Coordinates
### Endpoint
```
PUT /poles/{pole_id}/coordinates
```

## 7. Update Pole
### Endpoint
```
PUT /poles/{pole_id}
```

### Request Body
```json
{
  "name": "Updated Pole Name",
  "description": "Updated pole description"
}
```

### Response
```json
{
  "id": "64f1a2b3c4d5e6f7g8h9i0j5",
  "name": "Updated Pole Name",
  "area_id": "64f1a2b3c4d5e6f7g8h9i0j2",
  "zone_id": "64f1a2b3c4d5e6f7g8h9i0j3",
  "area_name": "Main Campus Area",
  "zone_name": "Security Zone A",
  "description": "Updated pole description",
  "created_at": "2024-01-15T10:30:00.000Z",
  "lat": 28.6142,
  "lng": 77.2093
}
```

## 8. Delete Pole
### Endpoint
```
DELETE /poles/{pole_id}
```

### Response
```json
{
  "message": "Pole deleted successfully"
}
```

---

# Marker Management

## 1. Create Marker
### Endpoint
```
POST /create_marker
```

### Request Body
```json
{
  "type": "toilets",
  "name": "Public Restroom Block A",
  "lat": 28.6139,
  "lng": 77.2090,
  "description": "Clean public restrooms with wheelchair access",
  "area_id": "64f1a2b3c4d5e6f7g8h9i0j2",
  "zone_id": "64f1a2b3c4d5e6f7g8h9i0j3"
}
```

### Response
```json
{
  "id": "64f1a2b3c4d5e6f7g8h9i0j6",
  "type": "toilets",
  "name": "Public Restroom Block A",
  "lat": 28.6139,
  "lng": 77.2090,
  "description": "Clean public restrooms with wheelchair access",
  "icon": "🚻",
  "area_id": "64f1a2b3c4d5e6f7g8h9i0j2",
  "zone_id": "64f1a2b3c4d5e6f7g8h9i0j3",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

## 2. Edit Marker
### Endpoint
```
POST /edit
```

### Request Body
```json
{
  "id": "64f1a2b3c4d5e6f7g8h9i0j6",
  "type": "toilets",
  "name": "Updated Restroom Name",
  "lat": 28.6139,
  "lng": 77.2090,
  "description": "Updated description"
}
```

## 3. View All Markers
### Endpoint
```
GET /view
```

### Response
```json
[
  {
    "id": "64f1a2b3c4d5e6f7g8h9i0j6",
    "type": "toilets",
    "name": "Public Restroom Block A",
    "lat": 28.6139,
    "lng": 77.2090,
    "description": "Clean public restrooms with wheelchair access",
    "icon": "🚻",
    "area_id": "64f1a2b3c4d5e6f7g8h9i0j2",
    "zone_id": "64f1a2b3c4d5e6f7g8h9i0j3",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
]
```

## 4. Update Marker
### Endpoint
```
PUT /markers/{marker_id}
```

### Request Body
```json
{
  "type": "toilets",
  "name": "Updated Restroom Name",
  "lat": 28.6139,
  "lng": 77.2090,
  "description": "Updated description with new facilities"
}
```

### Response
```json
{
  "id": "64f1a2b3c4d5e6f7g8h9i0j6",
  "type": "toilets",
  "name": "Updated Restroom Name",
  "lat": 28.6139,
  "lng": 77.2090,
  "description": "Updated description with new facilities",
  "icon": "🚻",
  "area_id": "64f1a2b3c4d5e6f7g8h9i0j2",
  "zone_id": "64f1a2b3c4d5e6f7g8h9i0j3",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

## 5. Delete Marker
### Endpoint
```
DELETE /markers/{marker_id}
```

### Response
```json
{
  "message": "Marker deleted successfully"
}
```

## 6. Get Markers by Type
### Endpoint
```
GET /markers/by-type/{marker_type}
```

### Parameters
- `marker_type` (path): Type of marker (toilets, hospitals, etc.)

### Response
```json
[
  {
    "id": "64f1a2b3c4d5e6f7g8h9i0j6",
    "type": "toilets",
    "name": "Public Restroom Block A",
    "lat": 28.6139,
    "lng": 77.2090,
    "description": "Clean public restrooms with wheelchair access",
    "icon": "🚻",
    "area_id": "64f1a2b3c4d5e6f7g8h9i0j2",
    "zone_id": "64f1a2b3c4d5e6f7g8h9i0j3",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
]
```

## 7. Get Markers by Area
### Endpoint
```
GET /markers/by-area/{area_id}
```

### Parameters
- `area_id` (path): Area identifier

## 8. Get Markers by Zone
### Endpoint
```
GET /markers/by-zone/{zone_id}
```

### Parameters
- `zone_id` (path): Zone identifier

## Marker Types
Available marker types:
- `toilets` 🚻
- `drinking_water` 💧
- `food_distribution` 🍛
- `tent_areas` ⛺
- `dharamshalas` 🏨
- `hospitals` 🏥
- `first_aid` ⛑️
- `police_booths` 👮
- `fire_station` 🚒
- `lost_found` 📋
- `railway_station` 🚉
- `bus_stands` 🚌
- `parking_areas` 🅿️
- `pickup_dropoff` 🚖
- `mandir` 🛕

---

# User Location & Tracking

## 1. Get User Map Data
### Endpoint
```
GET /api/user-map-data
```

### Response
```json
{
  "markers": [
    {
      "id": "64f1a2b3c4d5e6f7g8h9i0j6",
      "type": "toilets",
      "name": "Public Restroom Block A",
      "lat": 28.6139,
      "lng": 77.2090,
      "description": "Clean public restrooms with wheelchair access",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total_markers": 1,
  "map_center": {
    "lat": 28.6139,
    "lng": 77.2090
  }
}
```

## 2. Submit Location Update
### Endpoint
```
POST /api/location-update
```

### Request Body
```json
{
  "user_id": "user_12345",
  "lat": 28.6139,
  "lng": 77.2090,
  "timestamp": "2024-01-15T12:30:00.000Z",
  "device_info": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)"
}
```

### Response
```json
{
  "message": "Location updated successfully",
  "id": "64f1a2b3c4d5e6f7g8h9i0j7",
  "timestamp": "2024-01-15T12:30:00.000Z"
}
```

## 3. Get Heatmap Data
### Endpoint
```
GET /api/heatmap-data
```

### Query Parameters
- `hours` (optional): Time range in hours (default: 24)

### Response
```json
{
  "heatmap_points": [
    {
      "lat": 28.6139,
      "lng": 77.2090,
      "intensity": 5
    },
    {
      "lat": 28.6145,
      "lng": 77.2095,
      "intensity": 3
    }
  ],
  "total_points": 156,
  "time_range_hours": 24,
  "last_updated": "2024-01-15T12:30:00.000Z"
}
```

## 4. Get User Location History
### Endpoint
```
GET /api/user-location-history/{user_id}
```

### Query Parameters
- `hours` (optional): Time range in hours (default: 24)

### Response
```json
{
  "user_id": "user_12345",
  "total_points": 48,
  "time_range_hours": 24,
  "locations": [
    {
      "lat": 28.6139,
      "lng": 77.2090,
      "timestamp": "2024-01-15T12:30:00.000Z",
      "device_info": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
      "accuracy": 5.0,
      "altitude": 210.5
    }
  ],
  "last_updated": "2024-01-15T12:30:00.000Z"
}
```

## 5. Clear Location Data
### Endpoint
```
DELETE /api/location-data
```

### Response
```json
{
  "message": "Cleared 1250 old location records",
  "cleared_before": "2024-01-08T12:30:00.000Z"
}
```

## 6. Create User Location
### Endpoint
```
POST /user-locations
```

### Request Body
```json
{
  "user_id": "user_12345",
  "device_id": "device_67890",
  "lat": 28.6139,
  "lng": 77.2090,
  "accuracy": 5.0,
  "session_id": "session_abc123"
}
```

### Response
```json
{
  "id": "64f1a2b3c4d5e6f7g8h9i0j7",
  "user_id": "user_12345",
  "device_id": "device_67890",
  "lat": 28.6139,
  "lng": 77.2090,
  "timestamp": "2024-01-15T12:30:00.000Z",
  "accuracy": 5.0,
  "session_id": "session_abc123"
}
```

## 7. Get All User Locations
### Endpoint
```
GET /user-locations
```

### Response
```json
[
  {
    "id": "64f1a2b3c4d5e6f7g8h9i0j7",
    "user_id": "user_12345",
    "device_id": "device_67890",
    "lat": 28.6139,
    "lng": 77.2090,
    "timestamp": "2024-01-15T12:30:00.000Z",
    "accuracy": 5.0,
    "session_id": "session_abc123"
  }
]
```

## 8. Get User Location by ID
### Endpoint
```
GET /user-locations/{location_id}
```

### Response
```json
{
  "id": "64f1a2b3c4d5e6f7g8h9i0j7",
  "user_id": "user_12345",
  "device_id": "device_67890",
  "lat": 28.6139,
  "lng": 77.2090,
  "timestamp": "2024-01-15T12:30:00.000Z",
  "accuracy": 5.0,
  "session_id": "session_abc123"
}
```

## 9. Update User Location
### Endpoint
```
PUT /user-locations/{location_id}
```

### Request Body
```json
{
  "lat": 28.6145,
  "lng": 77.2095,
  "accuracy": 3.0
}
```

## 10. Delete User Location
### Endpoint
```
DELETE /user-locations/{location_id}
```

### Response
```json
{
  "message": "User location deleted successfully"
}
```

---

# Statistics & Analytics

## 1. Get System Statistics
### Endpoint
```
GET /stats
```

### Response
```json
{
  "total_areas": 5,
  "total_zones": 12,
  "total_gates": 8,
  "total_poles": 15,
  "total_cctvs": 25,
  "active_cctvs": 20,
  "inactive_cctvs": 3,
  "maintenance_cctvs": 2,
  "gate_cctvs": 15,
  "pole_cctvs": 10,
  "total_markers": 45,
  "areas_with_coordinates": 4,
  "zones_with_polygons": 10,
  "gates_with_coordinates": 6,
  "poles_with_coordinates": 12,
  "toilets_markers": 8,
  "food_distribution_markers": 6,
  "hospitals_markers": 3,
  "database": "MongoDB"
}
```

## 2. Get CCTV Summary
### Endpoint
```
GET /cctvs/summary
```

### Response
```json
{
  "total_cctvs": 25,
  "by_status": {
    "active": 20,
    "inactive": 3,
    "maintenance": 2
  },
  "by_location_type": {
    "gate": 15,
    "pole": 10
  },
  "by_area": [
    {
      "_id": "Main Campus Area",
      "count": 12
    },
    {
      "_id": "Parking Area",
      "count": 8
    }
  ],
  "by_zone": [
    {
      "_id": "Security Zone A",
      "count": 6
    },
    {
      "_id": "Entrance Zone",
      "count": 5
    }
  ]
}
```

---

# Bulk Operations

## 1. Create Bulk CCTVs
### Endpoint
```
POST /cctvs/bulk
```

### Request Body
```json
[
  {
    "name": "Camera 1",
    "area": "Area 1",
    "zone": "Zone 1",
    "location_type": "gate",
    "location_name": "Gate 1",
    "video_source": "rtsp://192.168.1.101:554/stream",
    "source_type": "rtsp",
    "status": "active"
  },
  {
    "name": "Camera 2",
    "area": "Area 1",
    "zone": "Zone 2",
    "location_type": "pole",
    "location_name": "Pole 1",
    "video_source": "rtsp://192.168.1.102:554/stream",
    "source_type": "rtsp",
    "status": "active"
  }
]
```

### Response
```json
[
  {
    "id": "64f1a2b3c4d5e6f7g8h9i0j8",
    "name": "Camera 1",
    "area": "Area 1",
    "zone": "Zone 1",
    "location_type": "gate",
    "location_name": "Gate 1",
    "video_source": "rtsp://192.168.1.101:554/stream",
    "source_type": "rtsp",
    "status": "active",
    "created_at": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": "64f1a2b3c4d5e6f7g8h9i0j9",
    "name": "Camera 2",
    "area": "Area 1",
    "zone": "Zone 2",
    "location_type": "pole",
    "location_name": "Pole 1",
    "video_source": "rtsp://192.168.1.102:554/stream",
    "source_type": "rtsp",
    "status": "active",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
]
```

## 2. Bulk Update CCTV Status
### Endpoint
```
PUT /cctvs/bulk/status
```

### Request Body
```json
{
  "cctv_ids": [
    "64f1a2b3c4d5e6f7g8h9i0j8",
    "64f1a2b3c4d5e6f7g8h9i0j9"
  ],
  "status": "maintenance"
}
```

### Response
```json
{
  "message": "Updated 2 CCTV devices to status maintenance",
  "modified_count": 2
}
```

## 3. Bulk Delete CCTVs
### Endpoint
```
DELETE /cctvs/bulk
```

### Request Body
```json
{
  "cctv_ids": [
    "64f1a2b3c4d5e6f7g8h9i0j8",
    "64f1a2b3c4d5e6f7g8h9i0j9"
  ]
}
```

### Response
```json
{
  "message": "Deleted 2 CCTV devices",
  "deleted_count": 2
}
```

---

# Hierarchical Structure

## 1. Get Complete Hierarchy
### Endpoint
```
GET /hierarchy
```

### Response
```json
{
  "hierarchy": [
    {
      "id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Main Campus Area",
      "description": "Primary campus area",
      "created_at": "2024-01-15T10:30:00.000Z",
      "coordinates": [[28.6139, 77.2090]],
      "zones": [
        {
          "id": "64f1a2b3c4d5e6f7g8h9i0j3",
          "name": "Security Zone A",
          "description": "High security zone",
          "created_at": "2024-01-15T10:30:00.000Z",
          "polygon": [[28.6140, 77.2091]],
          "gates": [
            {
              "id": "64f1a2b3c4d5e6f7g8h9i0j4",
              "name": "Main Entrance Gate",
              "description": "Primary entrance",
              "created_at": "2024-01-15T10:30:00.000Z",
              "lat": 28.6141,
              "lng": 77.2092
            }
          ],
          "poles": [
            {
              "id": "64f1a2b3c4d5e6f7g8h9i0j5",
              "name": "Security Pole 1",
              "description": "CCTV mounting pole",
              "created_at": "2024-01-15T10:30:00.000Z",
              "lat": 28.6142,
              "lng": 77.2093
            }
          ]
        }
      ]
    }
  ]
}
```

## 2. Get Area Hierarchy
### Endpoint
```
GET /hierarchy/{area_id}
```

## 3. Display Hierarchy
### Endpoint
```
GET /hierarchy/display
```

### Response
```json
{
  "summary": {
    "total_areas": 5,
    "total_zones": 12,
    "total_gates": 8,
    "total_poles": 15
  },
  "structure": [
    {
      "area": {
        "id": "64f1a2b3c4d5e6f7g8h9i0j2",
        "name": "Main Campus Area",
        "description": "Primary campus area",
        "has_coordinates": true,
        "zone_count": 3,
        "gate_count": 2,
        "pole_count": 4
      },
      "zones": [
        {
          "id": "64f1a2b3c4d5e6f7g8h9i0j3",
          "name": "Security Zone A",
          "description": "High security zone",
          "has_polygon": true,
          "gate_count": 1,
          "pole_count": 2,
          "gates": [],
          "poles": []
        }
      ]
    }
  ],
  "detailed_breakdown": [
    {
      "area_name": "Main Campus Area",
      "zones": 3,
      "gates": 2,
      "poles": 4
    }
  ]
}
```

---

# Video Streaming Endpoints

## 1. Start Video Stream
### Endpoint
```
POST /stream/start/{cctv_id}
```

### Parameters
- `cctv_id` (path): CCTV device identifier

### Response
```json
{
  "message": "Stream started successfully",
  "cctv_id": "64f1a2b3c4d5e6f7g8h9i0j1",
  "stream_url": "/stream/video/64f1a2b3c4d5e6f7g8h9i0j1"
}
```

## 2. Stop Video Stream
### Endpoint
```
POST /stream/stop/{cctv_id}
```

### Parameters
- `cctv_id` (path): CCTV device identifier

### Response
```json
{
  "message": "Stream stopped successfully",
  "cctv_id": "64f1a2b3c4d5e6f7g8h9i0j1"
}
```

## 3. Get Video Stream
### Endpoint
```
GET /stream/video/{cctv_id}
```

### Parameters
- `cctv_id` (path): CCTV device identifier

### Response
Returns video stream (MJPEG format)

## 4. Get Current Frame
### Endpoint
```
GET /stream/frame/{cctv_id}
```

### Parameters
- `cctv_id` (path): CCTV device identifier

### Response
Returns current frame as JPEG image

## 5. Get Active Streams
### Endpoint
```
GET /stream/active
```

### Response
```json
{
  "active_streams": [
    {
      "cctv_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "Main Gate Camera 1",
      "status": "streaming",
      "started_at": "2024-01-15T12:30:00.000Z"
    }
  ],
  "total_active": 1
}
```

---

# Debug Endpoints

## 1. Debug Areas
### Endpoint
```
GET /debug/areas
```

### Response
```json
{
  "areas": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Main Campus Area",
      "description": "Primary campus area",
      "polygon": [[28.6139, 77.2090]],
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

## 2. Debug Single Area
### Endpoint
```
GET /debug/single-area/{area_id}
```

### Response
```json
{
  "raw_doc": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
    "name": "Main Campus Area",
    "description": "Primary campus area",
    "polygon": [[28.6139, 77.2090]],
    "created_at": "2024-01-15T10:30:00.000Z"
  },
  "polygon_field": [[28.6139, 77.2090]],
  "polygon_type": "list",
  "polygon_exists": true,
  "polygon_is_none": false
}
```

## 3. Root Endpoint
### Endpoint
```
GET /
```

### Response
```json
{
  "message": "CCTV Management API with Map Integration",
  "version": "1.0.0"
}
```

---

# Error Responses

## 400 Bad Request
```json
{
  "detail": "Invalid area ID"
}
```

## 404 Not Found
```json
{
  "detail": "CCTV not found"
}
```

## 422 Unprocessable Entity
```json
{
  "detail": [
    {
      "loc": ["body", "name"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

## 500 Internal Server Error
```json
{
  "detail": "Error creating CCTV: Database connection failed"
}
```

---

# Usage Examples

## JavaScript/Fetch API
```javascript
// Create a new CCTV
const createCCTV = async () => {
  const response = await fetch('http://127.0.0.1:8000/cctvs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'New Camera',
      area: 'Main Area',
      zone: 'Zone 1',
      location_type: 'gate',
      location_name: 'Main Gate',
      video_source: 'rtsp://192.168.1.100:554/stream',
      source_type: 'rtsp',
      status: 'active'
    })
  });
  
  const cctv = await response.json();
  console.log('Created CCTV:', cctv);
};

// Get all CCTVs
const getCCTVs = async () => {
  const response = await fetch('http://127.0.0.1:8000/cctvs');
  const cctvs = await response.json();
  console.log('All CCTVs:', cctvs);
};

// Search CCTVs
const searchCCTVs = async () => {
  const params = new URLSearchParams({
    status: 'active',
    location_type: 'gate'
  });
  
  const response = await fetch(`http://127.0.0.1:8000/cctvs/search?${params}`);
  const result = await response.json();
  console.log('Search results:', result);
};
```

## Python/Requests
```python
import requests
import json

BASE_URL = 'http://127.0.0.1:8000'

# Create a new CCTV
def create_cctv():
    data = {
        'name': 'New Camera',
        'area': 'Main Area',
        'zone': 'Zone 1',
        'location_type': 'gate',
        'location_name': 'Main Gate',
        'video_source': 'rtsp://192.168.1.100:554/stream',
        'source_type': 'rtsp',
        'status': 'active'
    }
    
    response = requests.post(f'{BASE_URL}/cctvs', json=data)
    if response.status_code == 200:
        cctv = response.json()
        print('Created CCTV:', cctv)
    else:
        print('Error:', response.json())

# Get all CCTVs
def get_cctvs():
    response = requests.get(f'{BASE_URL}/cctvs')
    cctvs = response.json()
    print('All CCTVs:', cctvs)

# Update location
def update_location():
    data = {
        'lat': 28.6139,
        'lng': 77.2090,
        'timestamp': '2024-01-15T12:30:00.000Z',
        'device_info': 'Python Client'
    }
    
    response = requests.post(f'{BASE_URL}/api/location-update', json=data)
    result = response.json()
    print('Location updated:', result)
```

## cURL Examples
```bash
# Create CCTV
curl -X POST http://127.0.0.1:8000/cctvs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Camera",
    "area": "Main Area", 
    "zone": "Zone 1",
    "location_type": "gate",
    "location_name": "Main Gate",
    "video_source": "rtsp://192.168.1.100:554/stream",
    "source_type": "rtsp",
    "status": "active"
  }'

# Get all CCTVs
curl http://127.0.0.1:8000/cctvs

# Search CCTVs
curl "http://127.0.0.1:8000/cctvs/search?status=active&location_type=gate"

# Update location
curl -X POST http://127.0.0.1:8000/api/location-update \
  -H "Content-Type: application/json" \
  -d '{
    "lat": 28.6139,
    "lng": 77.2090,
    "timestamp": "2024-01-15T12:30:00.000Z",
    "device_info": "cURL Client"
  }'

# Get heatmap data
curl "http://127.0.0.1:8000/api/heatmap-data?hours=12"
```

---

This documentation covers all 65+ available endpoints in the CCTV Management API with complete request/response examples and usage patterns.

## Complete Endpoint Summary

### CCTV Management (12 endpoints)
- POST /cctvs - Create CCTV
- GET /cctvs - Get all CCTVs
- GET /cctvs/{cctv_id} - Get CCTV by ID
- PUT /cctvs/{cctv_id} - Update CCTV
- DELETE /cctvs/{cctv_id} - Delete CCTV
- GET /cctvs/search - Search CCTVs
- GET /cctvs/summary - Get CCTV summary
- GET /cctvs/by-area/{area_name} - Get CCTVs by area
- GET /cctvs/by-zone/{zone_name} - Get CCTVs by zone
- GET /cctvs/by-area-zone/{area_name}/{zone_name} - Get CCTVs by area and zone
- GET /cctvs/by-location-type/{location_type} - Get CCTVs by location type
- GET /cctvs/by-status/{status} - Get CCTVs by status
- PATCH /cctvs/{cctv_id}/status - Update CCTV status

### Area Management (5 endpoints)
- POST /areas - Create area
- GET /areas - Get all areas
- PUT /areas/{area_id} - Update area
- DELETE /areas/{area_id} - Delete area
- POST /areas/map - Create area with coordinates

### Zone Management (6 endpoints)
- POST /zones - Create zone
- GET /zones - Get all zones
- GET /zones/by-area/{area_id} - Get zones by area
- PUT /zones/{zone_id} - Update zone
- DELETE /zones/{zone_id} - Delete zone
- POST /zones/map - Create zone with polygon

### Gate Management (8 endpoints)
- POST /gates - Create gate
- GET /gates - Get all gates
- GET /gates/by-zone/{zone_id} - Get gates by zone
- GET /gates/by-area/{area_id} - Get gates by area
- POST /gates/map - Create gate with coordinates
- PUT /gates/{gate_id} - Update gate
- PUT /gates/{gate_id}/coordinates - Update gate coordinates
- DELETE /gates/{gate_id} - Delete gate

### Pole Management (8 endpoints)
- POST /poles - Create pole
- GET /poles - Get all poles
- GET /poles/by-zone/{zone_id} - Get poles by zone
- GET /poles/by-area/{area_id} - Get poles by area
- POST /poles/map - Create pole with coordinates
- PUT /poles/{pole_id} - Update pole
- PUT /poles/{pole_id}/coordinates - Update pole coordinates
- DELETE /poles/{pole_id} - Delete pole

### Marker Management (8 endpoints)
- POST /create_marker - Create marker
- POST /edit - Edit marker
- GET /view - View all markers
- PUT /markers/{marker_id} - Update marker
- DELETE /markers/{marker_id} - Delete marker
- GET /markers/by-type/{marker_type} - Get markers by type
- GET /markers/by-area/{area_id} - Get markers by area
- GET /markers/by-zone/{zone_id} - Get markers by zone

### User Location & Tracking (10 endpoints)
- GET /api/user-map-data - Get user map data
- POST /api/location-update - Submit location update
- GET /api/heatmap-data - Get heatmap data
- GET /api/user-location-history/{user_id} - Get user location history
- DELETE /api/location-data - Clear location data
- POST /user-locations - Create user location
- GET /user-locations - Get all user locations
- GET /user-locations/{location_id} - Get user location by ID
- PUT /user-locations/{location_id} - Update user location
- DELETE /user-locations/{location_id} - Delete user location

### Statistics & Analytics (2 endpoints)
- GET /stats - Get system statistics
- GET /cctvs/summary - Get CCTV summary

### Bulk Operations (3 endpoints)
- POST /cctvs/bulk - Create bulk CCTVs
- PUT /cctvs/bulk/status - Bulk update CCTV status
- DELETE /cctvs/bulk - Bulk delete CCTVs

### Hierarchical Structure (3 endpoints)
- GET /hierarchy - Get complete hierarchy
- GET /hierarchy/{area_id} - Get area hierarchy
- GET /hierarchy/display - Display hierarchy

### Video Streaming (5 endpoints)
- POST /stream/start/{cctv_id} - Start video stream
- POST /stream/stop/{cctv_id} - Stop video stream
- GET /stream/video/{cctv_id} - Get video stream
- GET /stream/frame/{cctv_id} - Get current frame
- GET /stream/active - Get active streams

### Debug Endpoints (3 endpoints)
- GET / - Root endpoint
- GET /debug/areas - Debug areas
- GET /debug/single-area/{area_id} - Debug single area

**Total: 65+ endpoints covering complete CCTV management, infrastructure mapping, real-time location tracking, video streaming, and administrative functions.**