# Deployment Guide

This guide provides comprehensive instructions for deploying the Crowd Management & Security System in various environments.

## 📋 Prerequisites

### System Requirements
- **CPU**: 4+ cores (8+ recommended for production)
- **RAM**: 8GB minimum (16GB+ recommended)
- **Storage**: 100GB+ SSD storage
- **Network**: Stable internet connection with sufficient bandwidth

### Software Dependencies
- **Docker** 20.10+ and Docker Compose 2.0+
- **Node.js** 18+ and npm 8+
- **Python** 3.8+ with pip
- **MongoDB** 5.0+ (local or Atlas)
- **Nginx** (for production load balancing)

## 🚀 Quick Deployment (Docker)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd TH11876
```

### 2. Environment Configuration
Create environment files for each service:

**Main Server (.env):**
```env
MONGO_URI=mongodb://mongodb:27017/
MONGODB_DATABASE=cctv_management
CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]
LOG_LEVEL=INFO
```

**Lost & Found Server (.env):**
```env
MONGODB_URI=mongodb://mongodb:27017/
DATABASE_NAME=lost_found_db
MODEL_PATH=./yolov11s-face.pt
FACE_CONFIDENCE_THRESHOLD=0.5
```

**CCTV Streaming Server (.env):**
```env
MONGODB_URI=mongodb://mongodb:27017/
DATABASE_NAME=cctv_management
STREAM_QUALITY=medium
MAX_CONCURRENT_STREAMS=50
```

### 3. Docker Compose Deployment
```bash
# Build and start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Access Applications
- **Admin Dashboard**: http://localhost:3000
- **Main API**: http://localhost:8000
- **Lost & Found API**: http://localhost:8001
- **CCTV Streaming**: http://localhost:8002
- **API Documentation**: http://localhost:8000/docs

## 🔧 Manual Deployment

### 1. Database Setup

#### MongoDB Local Installation
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Create databases
mongo
> use cctv_management
> use lost_found_db
```

#### MongoDB Atlas (Recommended for Production)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create new cluster
3. Configure network access (whitelist IPs)
4. Create database user
5. Get connection string

### 2. Backend Services Deployment

#### Main Server
```bash
cd "Main Server"

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export MONGO_URI="mongodb://localhost:27017/"
export MONGODB_DATABASE="cctv_management"

# Start server
python main.py
```

#### Lost & Found Server
```bash
cd "lost and found server"

# Setup virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download YOLOv11 model (if not included)
wget https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov11s-face.pt

# Start server
python app.py
```

#### CCTV Streaming Server
```bash
cd "CCTV STREAMING SERVER"

# Setup virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start server
python run.py
```

### 3. Frontend Deployment

#### Admin Dashboard
```bash
cd "Auth Dashboards"

# Install dependencies
npm install

# Build for production
npm run build

# Serve with static server
npm install -g serve
serve -s dist -l 3000
```

#### Mobile Application
```bash
cd "user Application"

# Install dependencies
npm install

# For development
npx expo start

# For production build
npx expo build:android  # Android
npx expo build:ios      # iOS
```

## ☁️ Cloud Deployment

### AWS Deployment

#### 1. Infrastructure Setup
```bash
# Create EC2 instances
aws ec2 run-instances \
  --image-id ami-0abcdef1234567890 \
  --count 3 \
  --instance-type t3.medium \
  --key-name your-key-pair \
  --security-group-ids sg-903004f8

# Setup Application Load Balancer
aws elbv2 create-load-balancer \
  --name crowd-management-alb \
  --subnets subnet-12345678 subnet-87654321 \
  --security-groups sg-903004f8
```

#### 2. ECS Deployment
```yaml
# docker-compose.yml for ECS
version: '3.8'
services:
  main-server:
    image: your-registry/main-server:latest
    ports:
      - "8000:8000"
    environment:
      - MONGO_URI=${MONGO_URI}
    deploy:
      replicas: 2
      
  lost-found-server:
    image: your-registry/lost-found-server:latest
    ports:
      - "8001:8001"
    deploy:
      replicas: 2
      
  cctv-streaming:
    image: your-registry/cctv-streaming:latest
    ports:
      - "8002:8002"
    deploy:
      replicas: 2
```

#### 3. RDS Setup for MongoDB
```bash
# Create DocumentDB cluster (MongoDB-compatible)
aws docdb create-db-cluster \
  --db-cluster-identifier crowd-management-cluster \
  --engine docdb \
  --master-username admin \
  --master-user-password your-password
```

### Google Cloud Platform

#### 1. GKE Deployment
```yaml
# kubernetes-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: main-server
spec:
  replicas: 3
  selector:
    matchLabels:
      app: main-server
  template:
    metadata:
      labels:
        app: main-server
    spec:
      containers:
      - name: main-server
        image: gcr.io/your-project/main-server:latest
        ports:
        - containerPort: 8000
        env:
        - name: MONGO_URI
          valueFrom:
            secretKeyRef:
              name: mongo-secret
              key: uri
```

```bash
# Deploy to GKE
kubectl apply -f kubernetes-deployment.yaml

# Create service
kubectl expose deployment main-server --type=LoadBalancer --port=8000
```

#### 2. Cloud Run Deployment
```bash
# Deploy each service to Cloud Run
gcloud run deploy main-server \
  --image gcr.io/your-project/main-server:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

gcloud run deploy lost-found-server \
  --image gcr.io/your-project/lost-found-server:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Azure Deployment

#### 1. Container Instances
```bash
# Create resource group
az group create --name crowd-management --location eastus

# Deploy container group
az container create \
  --resource-group crowd-management \
  --name main-server \
  --image your-registry/main-server:latest \
  --ports 8000 \
  --environment-variables MONGO_URI=your-mongo-uri
```

#### 2. App Service Deployment
```bash
# Create App Service plan
az appservice plan create \
  --name crowd-management-plan \
  --resource-group crowd-management \
  --sku B1 \
  --is-linux

# Create web apps
az webapp create \
  --resource-group crowd-management \
  --plan crowd-management-plan \
  --name main-server-app \
  --deployment-container-image-name your-registry/main-server:latest
```

## 🔒 Production Security Setup

### 1. SSL/TLS Configuration
```nginx
# /etc/nginx/sites-available/crowd-management
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /lost-found/ {
        proxy_pass http://localhost:8001/;
    }
    
    location /streaming/ {
        proxy_pass http://localhost:8002/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### 2. Firewall Configuration
```bash
# UFW (Ubuntu Firewall)
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny 8000/tcp  # Block direct API access
sudo ufw deny 8001/tcp
sudo ufw deny 8002/tcp
```

### 3. Environment Security
```bash
# Create secure environment file
sudo mkdir -p /etc/crowd-management
sudo chmod 700 /etc/crowd-management

# Store secrets securely
echo "MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db" | sudo tee /etc/crowd-management/.env
echo "JWT_SECRET=$(openssl rand -base64 32)" | sudo tee -a /etc/crowd-management/.env
sudo chmod 600 /etc/crowd-management/.env
```

## 📊 Monitoring Setup

### 1. Application Monitoring
```yaml
# docker-compose.monitoring.yml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-storage:/var/lib/grafana

volumes:
  grafana-storage:
```

### 2. Log Management
```yaml
# ELK Stack for log management
elasticsearch:
  image: docker.elastic.co/elasticsearch/elasticsearch:7.15.0
  environment:
    - discovery.type=single-node
    
logstash:
  image: docker.elastic.co/logstash/logstash:7.15.0
  volumes:
    - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    
kibana:
  image: docker.elastic.co/kibana/kibana:7.15.0
  ports:
    - "5601:5601"
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Build Docker images
      run: |
        docker build -t main-server ./Main\ Server/
        docker build -t lost-found-server ./lost\ and\ found\ server/
        docker build -t cctv-streaming ./CCTV\ STREAMING\ SERVER/
    
    - name: Push to registry
      run: |
        echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
        docker push your-registry/main-server:latest
        docker push your-registry/lost-found-server:latest
        docker push your-registry/cctv-streaming:latest
    
    - name: Deploy to production
      run: |
        ssh ${{ secrets.PRODUCTION_HOST }} "cd /opt/crowd-management && docker-compose pull && docker-compose up -d"
```

## 🧪 Testing Deployment

### 1. Health Checks
```bash
# Test all services
curl http://localhost:8000/health
curl http://localhost:8001/health
curl http://localhost:8002/

# Test database connectivity
curl http://localhost:8000/stats
```

### 2. Load Testing
```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test API endpoints
ab -n 1000 -c 10 http://localhost:8000/cctvs
ab -n 100 -c 5 http://localhost:8001/get_all_lost

# Test WebSocket connections
npm install -g wscat
wscat -c ws://localhost:8002/ws/test-stream
```

### 3. Integration Testing
```python
# test_deployment.py
import requests
import pytest

def test_main_server():
    response = requests.get("http://localhost:8000/")
    assert response.status_code == 200
    assert "CCTV Management API" in response.json()["message"]

def test_lost_found_server():
    response = requests.get("http://localhost:8001/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_cctv_streaming():
    response = requests.get("http://localhost:8002/")
    assert response.status_code == 200
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongodb

# Test connection
mongo --eval "db.adminCommand('ismaster')"

# Check network connectivity
telnet mongodb-host 27017
```

#### 2. Port Conflicts
```bash
# Check port usage
sudo netstat -tulpn | grep :8000
sudo lsof -i :8000

# Kill process using port
sudo kill -9 $(sudo lsof -t -i:8000)
```

#### 3. Memory Issues
```bash
# Check memory usage
free -h
docker stats

# Increase swap space
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

#### 4. Docker Issues
```bash
# Clean up Docker
docker system prune -a

# Restart Docker service
sudo systemctl restart docker

# Check Docker logs
docker logs container-name
```

## 📈 Performance Optimization

### 1. Database Optimization
```javascript
// MongoDB indexes for better performance
db.cctvs.createIndex({ "area": 1, "zone": 1 })
db.user_locations.createIndex({ "timestamp": -1 })
db.lost_people.createIndex({ "upload_time": -1 })
db.found_people.createIndex({ "upload_time": -1 })
```

### 2. Caching Strategy
```python
# Redis caching for frequently accessed data
import redis

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def get_cached_cctvs():
    cached = redis_client.get('cctvs_list')
    if cached:
        return json.loads(cached)
    
    cctvs = fetch_cctvs_from_db()
    redis_client.setex('cctvs_list', 300, json.dumps(cctvs))  # 5 min cache
    return cctvs
```

### 3. Load Balancing
```nginx
# Nginx load balancing configuration
upstream backend {
    server 127.0.0.1:8000 weight=3;
    server 127.0.0.1:8001 weight=2;
    server 127.0.0.1:8002 weight=1;
}

server {
    location / {
        proxy_pass http://backend;
    }
}
```

## 🔄 Backup and Recovery

### 1. Database Backup
```bash
# MongoDB backup
mongodump --host localhost:27017 --db cctv_management --out /backup/$(date +%Y%m%d)

# Automated backup script
#!/bin/bash
BACKUP_DIR="/backup/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
mongodump --host localhost:27017 --out $BACKUP_DIR/$DATE

# Keep only last 7 days of backups
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;
```

### 2. Application Backup
```bash
# Backup application files
tar -czf /backup/app_$(date +%Y%m%d).tar.gz /opt/crowd-management

# Backup configuration
cp -r /etc/crowd-management /backup/config_$(date +%Y%m%d)
```

### 3. Recovery Procedures
```bash
# Restore MongoDB
mongorestore --host localhost:27017 --drop /backup/20240115/

# Restore application
tar -xzf /backup/app_20240115.tar.gz -C /opt/

# Restart services
docker-compose restart
```

---

This deployment guide provides comprehensive instructions for deploying the system in various environments, from local development to production cloud deployments.