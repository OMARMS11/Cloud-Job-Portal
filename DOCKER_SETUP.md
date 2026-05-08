# Docker Setup Guide for Job Portal

## Overview

The Job Portal application is fully containerized with Docker Compose. All services can be started with a single command.

## Services

- **Frontend** (Next.js) - Port 3000 (dev/test/prod)
- **User Service** (NestJS) - Port 3001
- **Job Service** (NestJS) - Port 3002
- **Application Service** (NestJS) - Port 3003
- **PostgreSQL Database** - Port 5432
- **Elasticsearch** (dev only) - Port 9200
- **Kibana** (dev only) - Port 5601

## Environment Files

### Development Environment
```bash
docker-compose -f docker-compose.dev.yml up --build
```

### Production Environment
Create a `.env` file in the root directory:
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
USER_SERVICE_SECRET_KEY=your_secret_key
JOB_SERVICE_SECRET_KEY=your_secret_key
APP_SERVICE_SECRET_KEY=your_secret_key
```

Then start:
```bash
docker-compose -f docker-compose.prod.yml up --build
```

### Test Environment
```bash
docker-compose -f docker-compose.test.yml up --build
```

## Quick Start

### Development Setup (Recommended)
```bash
# Clone the repository
cd Job-Portal

# Start all services
docker-compose -f docker-compose.dev.yml up --build

# In another terminal, check service health
docker-compose -f docker-compose.dev.yml ps

# Access the application
# Frontend: http://localhost:3000
# Kibana: http://localhost:5601
# API: http://localhost:3001 (user), 3002 (job), 3003 (application)
```

### Viewing Logs
```bash
# All services
docker-compose -f docker-compose.dev.yml logs -f

# Specific service
docker-compose -f docker-compose.dev.yml logs -f frontend
docker-compose -f docker-compose.dev.yml logs -f user-service
```

### Stop Services
```bash
# Stop all services (keeps data)
docker-compose -f docker-compose.dev.yml down

# Stop all services and remove data
docker-compose -f docker-compose.dev.yml down -v

# Stop specific service
docker-compose -f docker-compose.dev.yml stop frontend
```

### Rebuild Services
```bash
# Rebuild all services
docker-compose -f docker-compose.dev.yml up --build

# Rebuild specific service
docker-compose -f docker-compose.dev.yml up --build frontend
```

## Docker Networking

### Development Network
Services communicate via Docker network:
```
Frontend can reach services at:
- http://user-service:3000
- http://job-service:3000
- http://application-service:3000
```

The frontend environment variables in docker-compose use these internal hostnames.

## Port Mapping

### Development
| Service | Container Port | Host Port | Access |
|---------|---|---|---|
| Frontend | 3000 | 3000 | http://localhost:3000 |
| User Service | 3000 | 3001 | http://localhost:3001 |
| Job Service | 3000 | 3002 | http://localhost:3002 |
| Application Service | 3000 | 3003 | http://localhost:3003 |
| PostgreSQL | 5432 | 5432 | localhost:5432 |
| Elasticsearch | 9200 | 9200 | http://localhost:9200 |
| Kibana | 5601 | 5601 | http://localhost:5601 |

### Test
| Service | Container Port | Host Port |
|---------|---|---|
| Frontend | 3000 | 3010 |
| User Service | 3000 | 3011 |
| Job Service | 3000 | 3012 |
| Application Service | 3000 | 3013 |
| PostgreSQL | 5432 | 5433 |

### Production
| Service | Container Port | Host Port |
|---------|---|---|
| Frontend | 3000 | 3000 |
| User Service | 3000 | 3001 |
| Job Service | 3000 | 3002 |
| Application Service | 3000 | 3003 |
| PostgreSQL | 5432 | 5432 |

## Environment Variables

### Frontend Environment (docker-compose)
```yaml
NEXT_PUBLIC_API_URL: http://user-service:3000
NEXT_PUBLIC_JOB_SERVICE_URL: http://job-service:3000
NEXT_PUBLIC_APP_SERVICE_URL: http://application-service:3000
```

These are internal Docker network URLs. When accessing from browser on localhost, use `http://localhost:3001`, etc.

For local development (not Docker), update `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_JOB_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_APP_SERVICE_URL=http://localhost:3003
```

## Database Management

### Accessing PostgreSQL
```bash
# From host machine
psql -h localhost -U postgres -d postgres

# From inside container
docker-compose -f docker-compose.dev.yml exec postgres psql -U postgres -d postgres
```

### Database Backup
```bash
# Backup all databases
docker-compose -f docker-compose.dev.yml exec postgres pg_dump -U postgres > backup.sql

# Restore from backup
docker-compose -f docker-compose.dev.yml exec -T postgres psql -U postgres < backup.sql
```

### View Database Files
```bash
# Postgres data volume
docker volume inspect job-portal_postgres_data
```

## Health Checks

### Check Service Health
```bash
# Docker Compose health status
docker-compose -f docker-compose.dev.yml ps

# Manual health check
curl http://localhost:3001/health  # User Service
curl http://localhost:3002/jobs    # Job Service
curl http://localhost:3003/applications  # App Service
curl http://localhost:3000/       # Frontend
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Services Not Starting
```bash
# Check logs
docker-compose -f docker-compose.dev.yml logs

# Check specific service
docker-compose -f docker-compose.dev.yml logs frontend

# Rebuild without cache
docker-compose -f docker-compose.dev.yml build --no-cache
```

### Database Connection Issues
```bash
# Verify database is healthy
docker-compose -f docker-compose.dev.yml exec postgres pg_isready

# Check database existence
docker-compose -f docker-compose.dev.yml exec postgres psql -U postgres -l
```

### Frontend Can't Connect to Backend
1. Check if services are running: `docker-compose ps`
2. Check logs: `docker-compose logs frontend`
3. Verify environment variables: `docker-compose config | grep NEXT_PUBLIC`
4. Test connectivity from frontend container:
   ```bash
   docker-compose exec frontend curl http://user-service:3000/health
   ```

### CORS Issues
Ensure backend CORS is configured to accept requests from frontend container network.

## Performance Optimization

### Resource Limits
To set resource limits in docker-compose, add:
```yaml
services:
  frontend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

### Volume Optimization
- Use named volumes for data persistence
- Use bind mounts for development
- Avoid large files in COPY steps

### Build Optimization
```bash
# Build with specific target
docker build --target runner -t job-portal:latest ./frontend

# Use BuildKit
DOCKER_BUILDKIT=1 docker build -t job-portal:latest ./frontend
```

## Production Deployment

### Using docker-compose.prod.yml
```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services with environment file
docker-compose -f docker-compose.prod.yml --env-file .env up -d

# Monitor logs
docker-compose -f docker-compose.prod.yml logs -f

# Update services
docker-compose -f docker-compose.prod.yml up -d --pull always
```

### Security Considerations
- Use environment variables for secrets (`.env` file)
- Never commit `.env` to version control
- Run services as non-root users (already configured)
- Use read-only file systems where possible
- Regular security updates: `docker pull node:18-alpine`

## Docker Compose File Structure

```
docker-compose.yml          # Base configuration (already has frontend)
docker-compose.dev.yml      # Development (added frontend)
docker-compose.prod.yml     # Production (added frontend)
docker-compose.test.yml     # Testing (added frontend)
```

Each file includes:
- All backend services
- Frontend service
- Database service
- Volumes and networks
- Environment-specific configurations

## Useful Commands

```bash
# View compose file
docker-compose config

# Services status
docker-compose ps

# Container logs
docker-compose logs -f [service-name]

# Execute command in container
docker-compose exec [service-name] [command]

# Stop and remove everything
docker-compose down -v

# Rebuild and restart
docker-compose up -d --build

# View resource usage
docker stats
```

## Documentation Files

- **QUICK_START.md** - Quick start guide for manual setup
- **INTEGRATION_GUIDE.md** - API integration details
- **SETUP_SUMMARY.md** - Frontend setup summary
- **DOCKER_SETUP.md** - This file

---

For more information, refer to the individual service README files or the main project documentation.
