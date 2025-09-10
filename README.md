# Crowd Management & Security System

A comprehensive crowd management and security system designed for large-scale events and public gatherings. The system provides real-time monitoring, lost & found services, CCTV management, and crowd analytics through multiple integrated platforms.

## 🏗️ System Architecture

The system consists of four main components:

1. **Admin Dashboard** - Web-based control panel for administrators
2. **Main Server** - Core API server for CCTV and infrastructure management
3. **Lost & Found Server** - AI-powered face recognition service
4. **CCTV Streaming Server** - Real-time video streaming service
5. **Mobile Application** - User-facing mobile app for reporting and navigation

## 📱 Components Overview

### 1. Admin Dashboard (`Auth Dashboards/`)
**Technology Stack:** React + Vite + TailwindCSS + Clerk Authentication

A comprehensive web dashboard providing:
- **Multi-role Authentication** (Admin, Super Admin, User, Volunteer)
- **Real-time CCTV Monitoring** with live video feeds
- **Interactive Map Management** with area/zone drawing capabilities
- **Crowd Analytics & Heatmaps** showing population density
- **Lost & Found Management** with face recognition integration
- **Alert System** for security incidents
- **Volunteer Task Management**
- **Report Generation** and analytics

**Key Features:**
- Role-based access control with Clerk authentication
- Real-time video streaming from multiple CCTV sources
- Interactive map editor for defining areas, zones, gates, and poles
- Crowd density visualization and analytics
- Alert management system
- Volunteer coordination tools

### 2. Main Server (`Main Server/`)
**Technology Stack:** FastAPI + MongoDB + OpenCV + YOLOv8

Core backend service providing:
- **CCTV Management** - Device registration, monitoring, and control
- **Infrastructure Management** - Areas, zones, gates, and poles
- **Map Integration** - Coordinate-based location services
- **User Location Tracking** - Real-time position monitoring
- **Heatmap Generation** - Crowd density analysis
- **Video Streaming** - Multi-source video processing
- **Marker Management** - Points of interest (toilets, food, medical)

**API Endpoints:** 65+ RESTful endpoints covering all system functionality

### 3. Lost & Found Server (`lost and found server/`)
**Technology Stack:** FastAPI + MongoDB + YOLOv11 Face Recognition

AI-powered service for missing person identification:
- **Face Detection & Recognition** using YOLOv11 model
- **Automatic Duplicate Detection** with 90%+ accuracy
- **Real-time Matching** between lost and found reports
- **CCTV Integration** - Automatic face extraction from live streams
- **Status Management** with automatic updates
- **Comprehensive Reporting** with detailed analytics

**Key Features:**
- Advanced face recognition with high accuracy
- Automatic duplicate removal
- Real-time matching notifications
- CCTV stream face detection and alerts
- Comprehensive search and filtering

### 4. CCTV Streaming Server (`CCTV STREAMING SERVER/`)
**Technology Stack:** FastAPI + OpenCV + WebSocket

Dedicated video streaming service:
- **Multi-source Support** (RTSP, HTTP, local files, YouTube)
- **Real-time Streaming** with WebSocket connections
- **Frame Processing** and optimization
- **Stream Management** with automatic failover

### 5. Mobile Application (`user Application/`)
**Technology Stack:** React Native + Expo + NativeWind

User-facing mobile application:
- **Lost Person Reporting** with photo upload
- **Interactive Map** with facility locations
- **Real-time Alerts** and notifications
- **Profile Management** and report history
- **Offline Capability** for critical functions

## 🚀 Quick Start

### Prerequisites
- Docker 20.10+ and Docker Compose 2.0+
- Node.js 18+ and npm (for manual setup)
- Python 3.8+ (for manual setup)
- MongoDB (local or Atlas)

### Option 1: Docker Deployment (Recommended)
```bash
# Clone repository
git clone <repository-url>
cd TH11876

# Start all services with Docker Compose
docker-compose up -d

# Check service status
docker-compose ps
```

**Access Applications:**
- Admin Dashboard: http://localhost:3000
- Main API: http://localhost:8000/docs
- Lost & Found API: http://localhost:8001/docs
- CCTV Streaming: http://localhost:8002
- Monitoring (Grafana): http://localhost:3001
- Logs (Kibana): http://localhost:5601

### Option 2: Manual Setup

#### 1. Database Setup
```bash
# Start MongoDB
sudo systemctl start mongodb
# Initialize with sample data
mongo < init-mongo.js
```

#### 2. Backend Services
```bash
# Main Server
cd "Main Server"
pip install -r requirements.txt
python main.py &

# Lost & Found Server
cd "lost and found server"
pip install -r requirements.txt
python app.py &

# CCTV Streaming Server
cd "CCTV STREAMING SERVER"
pip install -r requirements.txt
python run.py &
```

#### 3. Frontend
```bash
# Admin Dashboard
cd "Auth Dashboards"
npm install
npm run build
npm run preview

# Mobile App
cd "user Application"
npm install
npx expo start
```

## 🔧 Configuration

### Environment Variables

**Main Server (.env):**
```env
MONGO_URI=mongodb://admin:password123@mongodb:27017/cctv_management?authSource=admin
MONGODB_DATABASE=cctv_management
REDIS_URL=redis://redis:6379
CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]
LOG_LEVEL=INFO
```

**Lost & Found Server (.env):**
```env
MONGODB_URI=mongodb://admin:password123@mongodb:27017/lost_found_db?authSource=admin
DATABASE_NAME=lost_found_db
MODEL_PATH=./yolov11s-face.pt
FACE_CONFIDENCE_THRESHOLD=0.5
```

**CCTV Streaming Server (.env):**
```env
MONGODB_URI=mongodb://admin:password123@mongodb:27017/cctv_management?authSource=admin
DATABASE_NAME=cctv_management
STREAM_QUALITY=medium
MAX_CONCURRENT_STREAMS=50
```

**Admin Dashboard (.env):**
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_LOST_FOUND_API_URL=http://localhost:8001
REACT_APP_STREAMING_API_URL=http://localhost:8002
REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
```

### Database Setup
The system uses MongoDB with the following collections:
- `cctvs` - CCTV device information
- `areas` - Geographic areas with polygons
- `zones` - Sub-areas within regions
- `gates` - Entry/exit points
- `poles` - CCTV mounting locations
- `markers` - Points of interest
- `user_locations` - Real-time location tracking
- `lost_people` - Missing person reports
- `found_people` - Found person reports
- `matches` - Face recognition matches

## 🖼️ System Screenshots

### User Interactive Dashboard
![User Interactive Map](images/1.png)
*Interactive map showing user reports, alerts, and detailed information about found persons*

### Super Admin Analytics
![Platform Analytics](images/0.png)
![Analytics Dashboard](images/2.png)
![System Analytics](images/3.png)
*Comprehensive analytics dashboard for platform heads with system-wide insights*

### Map & Zone Management
![Map Management](images/4.png)
![Zone Drawing System](images/5.png)
*Interactive map editor for drawing areas, zones, and defining geographical boundaries*

### Lost & Found Management
![Lost & Found Records](images/6.png)
*Complete lost and found case management with open cases and status tracking*

### CCTV Management & Streaming
![CCTV Streaming](images/7.png)
*Live CCTV stream monitoring and camera management system*

### Crowd Analytics
![Crowd Analytics](images/8.png)
*Real-time crowd density analysis and trend monitoring*

### AI-Powered Alerts
![Crowd AI Alerts](images/9.png)
*Intelligent alerts generated by crowd analysis AI*

### Volunteer Management
![Volunteer System](images/10.png)
*Volunteer task assignment system with area and zone allocation*

### Lost & Found Analytics
![Lost Found Analytics](images/11.png)
*Detailed analytics and reporting for lost and found operations*

### Volunteer Dashboard
![Volunteer Dashboard](images/12.png)
*Volunteer interface for managing found and lost person reports*

### Lost Person Records
![Lost Person Records](images/13.png)
*Comprehensive database of all lost person reports*

### Volunteer Profile
![Volunteer Profile](images/14.png)
*Individual volunteer profile and activity management*

## 📊 Key Features

### Real-time Monitoring
- Live CCTV feeds from multiple sources
- Real-time crowd density heatmaps
- Instant alert notifications
- Location tracking and analytics

### AI-Powered Services
- Face recognition for lost & found with CCTV integration
- Automatic face extraction from live CCTV streams
- Real-time alerts when matches are found in CCTV feeds
- Automatic duplicate detection
- Crowd density analysis
- Intelligent alert generation

### Multi-Platform Access
- Web dashboard for administrators
- Mobile app for users and volunteers
- API access for third-party integrations
- Real-time WebSocket connections

### Scalable Architecture
- Microservices design
- Horizontal scaling capability
- Load balancing support
- Cloud deployment ready

## 🔐 Security Features

- **Authentication:** Clerk-based multi-role authentication
- **Authorization:** Role-based access control (RBAC)
- **Data Protection:** Encrypted data transmission
- **Privacy:** Anonymized location tracking
- **Audit Logging:** Complete activity tracking

## 📱 Mobile App Features

### For Users:
- Report lost persons with photos
- View facility locations on map
- Receive real-time alerts
- Track report status
- Access emergency contacts

### For Volunteers:
- Manage assigned tasks
- Report found persons
- Access restricted areas
- Coordinate with other volunteers
- Real-time communication

## 🎯 Use Cases

### Large Events
- Music festivals and concerts
- Sports events and marathons
- Religious gatherings
- Political rallies

### Public Spaces
- Airports and train stations
- Shopping malls
- Parks and recreational areas
- Educational institutions

### Emergency Situations
- Natural disaster response
- Evacuation management
- Search and rescue operations
- Crowd control during emergencies

## 📈 Analytics & Reporting

### Real-time Analytics
- Live crowd density monitoring
- Movement pattern analysis
- Alert frequency tracking
- Resource utilization metrics

### Historical Reports
- Crowd flow analysis
- Incident reports
- Lost & found statistics
- System performance metrics

### Predictive Analytics
- Crowd density forecasting
- Risk assessment
- Resource planning
- Capacity optimization

## 🔌 API Documentation

### Main Server API
- **Base URL:** `http://localhost:8000`
- **Endpoints:** 65+ RESTful endpoints
- **Documentation:** Available at `/docs` (Swagger UI)

### Lost & Found API
- **Base URL:** `http://localhost:8001`
- **Face Recognition:** YOLOv11-powered matching
- **Documentation:** See `COMPLETE_API_DOCUMENTATION.md`

### CCTV Streaming API
- **Base URL:** `http://localhost:8002`
- **WebSocket:** Real-time video streaming
- **Formats:** MJPEG, WebSocket streams

## 🛠️ Development

### Code Structure
```
TH11876/
├── Auth Dashboards/          # React admin dashboard
│   ├── Dockerfile           # Container configuration
│   └── nginx.conf           # Web server config
├── Main Server/              # FastAPI core server
│   ├── Dockerfile           # Container configuration
│   └── main.py              # Application entry point
├── lost and found server/    # AI face recognition service
│   ├── Dockerfile           # Container configuration
│   └── app.py               # Face recognition service
├── CCTV STREAMING SERVER/    # Video streaming service
│   ├── Dockerfile           # Container configuration
│   └── run.py               # Streaming server
├── user Application/         # React Native mobile app
├── docker-compose.yml        # Multi-service deployment
├── nginx.conf               # Load balancer config
├── init-mongo.js            # Database initialization
├── TECHNICAL_ARCHITECTURE.md # Technical documentation
├── DEPLOYMENT_GUIDE.md      # Deployment instructions
└── README.md                # This documentation
```

### Technology Stack
- **Frontend:** React, React Native, TailwindCSS
- **Backend:** FastAPI, Node.js
- **Database:** MongoDB
- **AI/ML:** YOLOv8, YOLOv11, OpenCV
- **Authentication:** Clerk
- **Maps:** Leaflet, React Native Maps
- **Streaming:** WebSocket, RTSP

## 🚀 Deployment

### Docker Deployment (Recommended)
```bash
# Production deployment
docker-compose up -d

# Scale services
docker-compose up -d --scale main-server=3 --scale lost-found-server=2

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Cloud Deployment

#### AWS (ECS/EKS)
```bash
# Deploy to ECS
aws ecs create-service --cluster crowd-management --service-name main-server

# Deploy to EKS
kubectl apply -f kubernetes-deployment.yaml
```

#### Google Cloud (Cloud Run/GKE)
```bash
# Deploy to Cloud Run
gcloud run deploy main-server --image gcr.io/project/main-server

# Deploy to GKE
kubectl apply -f gke-deployment.yaml
```

#### Azure (Container Instances/AKS)
```bash
# Deploy to Container Instances
az container create --resource-group crowd-management --name main-server
```

### Production Features
- **Load Balancing:** Nginx reverse proxy with health checks
- **Monitoring:** Prometheus + Grafana dashboards
- **Logging:** ELK Stack (Elasticsearch, Logstash, Kibana)
- **Security:** SSL/TLS, rate limiting, CORS protection
- **Caching:** Redis for improved performance
- **Backup:** Automated MongoDB backups
- **CI/CD:** GitHub Actions deployment pipeline

## 📊 Monitoring & Analytics

### Built-in Monitoring
- **Prometheus:** Metrics collection and alerting
- **Grafana:** Real-time dashboards and visualization
- **ELK Stack:** Centralized logging and analysis
- **Health Checks:** Automated service monitoring

### Key Metrics
- API response times and throughput
- Face recognition accuracy and processing time
- Video streaming quality and latency
- Database performance and connection pooling
- System resource utilization (CPU, memory, disk)

### Access Monitoring
- **Grafana Dashboard:** http://localhost:3001 (admin/admin123)
- **Prometheus Metrics:** http://localhost:9090
- **Kibana Logs:** http://localhost:5601
- **Nginx Status:** http://localhost/nginx_status

## 📞 Support & Maintenance

### Health Monitoring
```bash
# Check all services
curl http://localhost:8000/health
curl http://localhost:8001/health
curl http://localhost:8002/

# View service logs
docker-compose logs -f main-server
docker-compose logs -f lost-found-server
```

### Backup & Recovery
```bash
# Database backup
docker exec mongodb mongodump --out /backup/$(date +%Y%m%d)

# Application backup
docker-compose down
tar -czf backup_$(date +%Y%m%d).tar.gz .
```

### Troubleshooting
- **Port Conflicts:** Check `docker-compose ps` and `netstat -tulpn`
- **Memory Issues:** Monitor with `docker stats`
- **Database Issues:** Check MongoDB logs and connection strings
- **Performance:** Use Grafana dashboards for bottleneck analysis

## 📚 Documentation

- **[Technical Architecture](TECHNICAL_ARCHITECTURE.md)** - System design and architecture
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Comprehensive deployment instructions
- **[API Documentation](Main%20Server/COMPLETE_API_DOCUMENTATION.md)** - Complete API reference
- **[Lost & Found API](lost%20and%20found%20server/COMPLETE_API_DOCUMENTATION.md)** - Face recognition API

## 🔧 Development Setup

### Local Development
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Hot reload for frontend
cd "Auth Dashboards"
npm run dev

# Debug backend services
cd "Main Server"
python -m debugpy --listen 5678 main.py
```

### Testing
```bash
# Run API tests
curl -X GET http://localhost:8000/stats
curl -X POST http://localhost:8001/health

# Load testing
ab -n 1000 -c 10 http://localhost:8000/cctvs
```ity updates
- Database optimization
- Performance tuning
- Feature enhancements

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Development Guidelines
- Follow Docker best practices for containerization
- Use environment variables for configuration
- Implement proper error handling and logging
- Add health checks for all services
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **YOLOv8/YOLOv11** for advanced object detection and face recognition
- **OpenCV** for comprehensive computer vision capabilities
- **FastAPI** for high-performance, modern API development
- **React & React Native** for cross-platform user interfaces
- **MongoDB** for flexible, scalable data storage
- **Docker** for containerization and deployment
- **Nginx** for load balancing and reverse proxy
- **Prometheus & Grafana** for monitoring and observability
- **Clerk** for secure authentication services

## 🚀 Quick Commands

```bash
# Start entire system
docker-compose up -d

# View all services
docker-compose ps

# Check logs
docker-compose logs -f

# Stop system
docker-compose down

# Rebuild services
docker-compose build --no-cache

# Scale services
docker-compose up -d --scale main-server=3
```

---

**🎯 Built for crowd safety and security management at scale with enterprise-grade reliability and performance.**