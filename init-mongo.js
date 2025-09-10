// MongoDB initialization script for Crowd Management System

// Switch to admin database for user creation
db = db.getSiblingDB('admin');

// Create application databases
db = db.getSiblingDB('cctv_management');
db = db.getSiblingDB('lost_found_db');

// Switch to cctv_management database
db = db.getSiblingDB('cctv_management');

// Create collections with validation
db.createCollection('cctvs', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'area', 'zone', 'location_type', 'video_source', 'source_type', 'status'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'CCTV name is required and must be a string'
        },
        area: {
          bsonType: 'string',
          description: 'Area is required and must be a string'
        },
        zone: {
          bsonType: 'string',
          description: 'Zone is required and must be a string'
        },
        location_type: {
          enum: ['gate', 'pole'],
          description: 'Location type must be either gate or pole'
        },
        video_source: {
          bsonType: 'string',
          description: 'Video source URL is required'
        },
        source_type: {
          enum: ['rtsp', 'http', 'file', 'youtube'],
          description: 'Source type must be rtsp, http, file, or youtube'
        },
        status: {
          enum: ['active', 'inactive', 'maintenance'],
          description: 'Status must be active, inactive, or maintenance'
        },
        created_at: {
          bsonType: 'date',
          description: 'Creation timestamp'
        }
      }
    }
  }
});

// Create indexes for better performance
db.cctvs.createIndex({ 'area': 1, 'zone': 1 });
db.cctvs.createIndex({ 'status': 1 });
db.cctvs.createIndex({ 'location_type': 1 });
db.cctvs.createIndex({ 'created_at': -1 });

// Areas collection
db.createCollection('areas');
db.areas.createIndex({ 'name': 1 }, { unique: true });
db.areas.createIndex({ 'created_at': -1 });

// Zones collection
db.createCollection('zones');
db.zones.createIndex({ 'area_id': 1 });
db.zones.createIndex({ 'name': 1, 'area_id': 1 }, { unique: true });
db.zones.createIndex({ 'created_at': -1 });

// Gates collection
db.createCollection('gates');
db.gates.createIndex({ 'area_id': 1, 'zone_id': 1 });
db.gates.createIndex({ 'lat': 1, 'lng': 1 });
db.gates.createIndex({ 'created_at': -1 });

// Poles collection
db.createCollection('poles');
db.poles.createIndex({ 'area_id': 1, 'zone_id': 1 });
db.poles.createIndex({ 'lat': 1, 'lng': 1 });
db.poles.createIndex({ 'created_at': -1 });

// Markers collection
db.createCollection('markers');
db.markers.createIndex({ 'type': 1 });
db.markers.createIndex({ 'lat': 1, 'lng': 1 });
db.markers.createIndex({ 'area_id': 1 });
db.markers.createIndex({ 'zone_id': 1 });
db.markers.createIndex({ 'created_at': -1 });

// User locations collection for heatmap
db.createCollection('user_locations');
db.user_locations.createIndex({ 'timestamp': -1 });
db.user_locations.createIndex({ 'user_id': 1, 'timestamp': -1 });
db.user_locations.createIndex({ 'lat': 1, 'lng': 1 });
db.user_locations.createIndex({ 'session_id': 1 });

// Create TTL index to automatically delete old location data after 7 days
db.user_locations.createIndex({ 'timestamp': 1 }, { expireAfterSeconds: 604800 });

// Insert sample data for testing
print('Inserting sample data...');

// Sample areas
var sampleAreas = [
  {
    name: 'Main Campus',
    description: 'Primary campus area with main buildings',
    polygon: [
      [28.6139, 77.2090],
      [28.6145, 77.2095],
      [28.6142, 77.2100],
      [28.6136, 77.2095]
    ],
    created_at: new Date()
  },
  {
    name: 'Parking Area',
    description: 'Vehicle parking and transportation hub',
    polygon: [
      [28.6130, 77.2080],
      [28.6135, 77.2085],
      [28.6132, 77.2090],
      [28.6127, 77.2085]
    ],
    created_at: new Date()
  }
];

db.areas.insertMany(sampleAreas);

// Get area IDs for zones
var mainCampusId = db.areas.findOne({ name: 'Main Campus' })._id;
var parkingAreaId = db.areas.findOne({ name: 'Parking Area' })._id;

// Sample zones
var sampleZones = [
  {
    name: 'Security Zone A',
    area_id: mainCampusId.toString(),
    description: 'High security zone near main entrance',
    polygon: [
      [28.6140, 77.2091],
      [28.6143, 77.2094],
      [28.6141, 77.2097],
      [28.6138, 77.2094]
    ],
    created_at: new Date()
  },
  {
    name: 'Entrance Zone',
    area_id: mainCampusId.toString(),
    description: 'Main entrance and reception area',
    polygon: [
      [28.6137, 77.2088],
      [28.6140, 77.2091],
      [28.6138, 77.2094],
      [28.6135, 77.2091]
    ],
    created_at: new Date()
  },
  {
    name: 'Vehicle Zone',
    area_id: parkingAreaId.toString(),
    description: 'Vehicle entry and exit monitoring',
    polygon: [
      [28.6131, 77.2081],
      [28.6134, 77.2084],
      [28.6132, 77.2087],
      [28.6129, 77.2084]
    ],
    created_at: new Date()
  }
];

db.zones.insertMany(sampleZones);

// Sample markers
var sampleMarkers = [
  {
    type: 'toilets',
    name: 'Public Restroom Block A',
    lat: 28.6139,
    lng: 77.2090,
    description: 'Clean public restrooms with wheelchair access',
    icon: '🚻',
    area_id: mainCampusId.toString(),
    created_at: new Date()
  },
  {
    type: 'hospitals',
    name: 'Medical Center',
    lat: 28.6141,
    lng: 77.2092,
    description: 'Emergency medical services and first aid',
    icon: '🏥',
    area_id: mainCampusId.toString(),
    created_at: new Date()
  },
  {
    type: 'food_distribution',
    name: 'Food Court',
    lat: 28.6138,
    lng: 77.2088,
    description: 'Food and beverage services',
    icon: '🍛',
    area_id: mainCampusId.toString(),
    created_at: new Date()
  },
  {
    type: 'parking_areas',
    name: 'Main Parking Lot',
    lat: 28.6132,
    lng: 77.2083,
    description: 'Vehicle parking with security',
    icon: '🅿️',
    area_id: parkingAreaId.toString(),
    created_at: new Date()
  }
];

db.markers.insertMany(sampleMarkers);

// Switch to lost_found_db database
db = db.getSiblingDB('lost_found_db');

// Create collections for lost and found system
db.createCollection('lost_people', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['face_id', 'name', 'gender', 'age', 'where_lost', 'reporter_name', 'user_id'],
      properties: {
        face_id: {
          bsonType: 'string',
          description: 'Unique face ID is required'
        },
        name: {
          bsonType: 'string',
          description: 'Person name is required'
        },
        gender: {
          bsonType: 'string',
          description: 'Gender is required'
        },
        age: {
          bsonType: 'int',
          minimum: 0,
          maximum: 150,
          description: 'Age must be between 0 and 150'
        },
        status: {
          enum: ['pending', 'found'],
          description: 'Status must be pending or found'
        }
      }
    }
  }
});

db.createCollection('found_people', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['face_id', 'name', 'gender', 'age', 'where_found', 'your_name', 'user_id'],
      properties: {
        face_id: {
          bsonType: 'string',
          description: 'Unique face ID is required'
        },
        status: {
          enum: ['pending', 'matched'],
          description: 'Status must be pending or matched'
        }
      }
    }
  }
});

db.createCollection('matches');

// Create indexes for lost and found system
db.lost_people.createIndex({ 'face_id': 1 }, { unique: true });
db.lost_people.createIndex({ 'upload_time': -1 });
db.lost_people.createIndex({ 'status': 1 });
db.lost_people.createIndex({ 'user_id': 1 });

db.found_people.createIndex({ 'face_id': 1 }, { unique: true });
db.found_people.createIndex({ 'upload_time': -1 });
db.found_people.createIndex({ 'status': 1 });
db.found_people.createIndex({ 'user_id': 1 });

db.matches.createIndex({ 'lost_face_id': 1 });
db.matches.createIndex({ 'found_face_id': 1 });
db.matches.createIndex({ 'match_time': -1 });
db.matches.createIndex({ 'match_status': 1 });

print('Database initialization completed successfully!');
print('Created databases: cctv_management, lost_found_db');
print('Created collections with indexes and sample data');
print('System is ready for use!');