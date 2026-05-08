# Job Portal Application - Architecture & Integration Analysis

## Executive Summary

The Job Portal is a microservices-based job platform with three independent backend services and a Next.js frontend. The backend services are fully functional with all endpoints implemented, but the frontend is currently a static UI with **no API integration**. This document provides a complete mapping of available endpoints and identifies what integration work is needed.

---

## 📊 Backend Services Overview

### Service Architecture
| Service | Port | Purpose | Authentication | Key Dependencies |
|---------|------|---------|-----------------|------------------|
| User Service | 3001 | Auth & Profile Mgmt | JWT | PostgreSQL |
| Job Service | 3002 | Job Postings | JWT | PostgreSQL |
| Application Service | 3003 | Job Applications | JWT | PostgreSQL + Job Service |

All services share the same PostgreSQL database and use JWT tokens for authentication.

---

## 🔌 Backend API Endpoints

### 1. USER SERVICE (Port 3001)

#### Authentication Endpoints (`/auth`)
| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|----------------|--------------|
| POST | `/auth/register` | Register new user | ❌ | `{ email, password, role }` |
| POST | `/auth/login` | User login | ❌ | `{ email, password }` |
| GET | `/auth/me` | Get current user profile | ✅ JWT | - |
| PUT | `/auth/me` | Update user profile | ✅ JWT | `{ ...fields to update }` |
| DELETE | `/auth/me` | Delete user account | ✅ JWT | - |

**Request Examples:**
```json
// Register (choose role: "EMPLOYER" or "JOB_SEEKER")
POST /auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "role": "JOB_SEEKER"
}

// Login
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### User Management Endpoints (`/users`)
| Method | Endpoint | Description | Auth Required | Notes |
|--------|----------|-------------|----------------|-------|
| GET | `/users` | Get all users | ❌ | Currently no auth required |

---

### 2. JOB SERVICE (Port 3002)

#### Job Management Endpoints (`/jobs`)
| Method | Endpoint | Description | Auth Required | Role Restriction |
|--------|----------|-------------|----------------|-----------------|
| POST | `/jobs/createJob` | Create new job posting | ✅ JWT | EMPLOYER only |
| GET | `/jobs` | Get all job postings | ❌ | - |
| GET | `/jobs/:id` | Get specific job by ID | ❌ | - |
| PATCH | `/jobs/:id` | Update job posting | ✅ JWT | EMPLOYER (owner only) |

**Request Examples:**
```json
// Create Job (EMPLOYER only)
POST /jobs/createJob
Authorization: Bearer {token}
{
  "title": "Senior Software Engineer",
  "description": "We are looking for an experienced engineer...",
  "companyName": "TechCorp Inc."
}

// Update Job
PATCH /jobs/123
Authorization: Bearer {token}
{
  "title": "Updated Title",
  "description": "Updated description",
  "companyName": "Updated Company"
}
```

**Business Rules:**
- Only users with `EMPLOYER` role can create/update jobs
- Job ownership is tracked by `createdBy` field (user ID)
- Employers can only update jobs they created (ownership validation)

---

### 3. APPLICATION SERVICE (Port 3003)

#### Application Management Endpoints (`/applications`)
| Method | Endpoint | Description | Auth Required | Role Restriction |
|--------|----------|-------------|----------------|-----------------|
| POST | `/applications` | Submit job application | ✅ JWT | JOB_SEEKER only |
| GET | `/applications/me` | Get my applications | ✅ JWT | - |
| DELETE | `/applications/:id/delete` | Delete application | ✅ JWT | - |
| PATCH | `/applications/:id/updateStatus` | Update application status | ✅ JWT | EMPLOYER only |

**Request Examples:**
```json
// Submit Application (JOB_SEEKER only)
POST /applications
Authorization: Bearer {token}
{
  "jobId": 123
}

// Update Application Status (EMPLOYER only)
PATCH /applications/456/updateStatus
Authorization: Bearer {token}
{
  "status": "ACCEPTED"  // or REJECTED, PENDING
}

// Delete Application
DELETE /applications/456/delete
Authorization: Bearer {token}
{
  "id": 456
}
```

**Business Rules:**
- Only users with `JOB_SEEKER` role can apply
- Duplicate applications prevented (one application per user per job)
- Application Service validates job exists by calling Job Service: `GET http://job-service:3002/jobs/{jobId}`
- Only EMPLOYER role can update application status
- Application status enum: `PENDING`, `ACCEPTED`, `REJECTED`

---

## 🎨 Frontend Pages & Components

### Current Frontend Structure

#### Pages Implemented
| Page | Route | Components | Status | API Integration |
|------|-------|-----------|--------|-----------------|
| Home | `/` | Hero with CTAs | ✅ Complete | ❌ None |
| Jobs Listing | `/jobs` | Job cards (placeholder) | ✅ Static | ❌ None |
| User Profile | `/profile` | Profile display | ✅ Static | ❌ None |

### Page Details

#### 1. Home Page (`src/app/page.tsx`)
- **Purpose**: Landing page with value proposition
- **Components**:
  - Hero headline: "Find Your Next Dream Career"
  - CTA buttons: "Explore Jobs" (links to /jobs) and "Create Profile" (links to /profile)
  - Statistics display: Active Jobs, Companies, Success Hires, New Daily
- **Current State**: Static UI, no API calls
- **Styling**: Glassmorphism design with animated gradient text

#### 2. Jobs Page (`src/app/jobs/page.tsx`)
- **Purpose**: Display available jobs
- **Components**:
  - Header with "Explore Jobs" title and back button
  - Job cards (grid layout) - 4 placeholder jobs hardcoded
  - Each card shows: Job title, company, salary range, description snippet
- **Current State**: 
  - Shows static placeholder data: "Senior Software Engineer" from TechCorp Inc.
  - No dynamic data fetching
  - No filters or search functionality
- **Missing Integration**: 
  - Should fetch jobs from `GET /jobs` endpoint
  - Should handle loading/error states

#### 3. Profile Page (`src/app/profile/page.tsx`)
- **Purpose**: Display and manage user profile
- **Components**:
  - User avatar with initials (hardcoded "JD")
  - Profile information display: name, role, email, location, experience
  - "Edit Profile" button
- **Current State**: 
  - Shows hardcoded data: "John Doe", "Software Developer", etc.
  - No actual user data or API calls
  - Edit button is non-functional
- **Missing Integration**:
  - Should fetch user profile from `GET /auth/me` endpoint
  - Should have login/auth check to populate profile
  - Edit button should open a form and call `PUT /auth/me`

#### 4. Layout (`src/app/layout.tsx`)
- Root layout with global styles
- Imports Geist fonts
- Currently has placeholder metadata

---

## 🔗 API Integration Points - Current Status

### ✅ What's Working
- **Backend Endpoints**: All three services have fully implemented controllers and services
- **Database Integration**: All services connected to PostgreSQL
- **JWT Authentication**: JWT guards and strategies implemented
- **Inter-service Communication**: Application Service can call Job Service for validation
- **Role-based Access Control**: EMPLOYER vs JOB_SEEKER role checks in place

### ❌ What's Missing

#### Frontend API Integration
1. **No API Configuration**
   - No API base URL configuration file
   - No HTTP client setup (no fetch wrapper, axios config, etc.)
   - No environment-based endpoint URLs

2. **No API Service Layer**
   - No API client/service for each backend
   - No auth token management (storage, injection in headers)
   - No error handling utilities

3. **No Authentication Flow**
   - No login/registration forms
   - No token storage/persistence (localStorage/cookies)
   - No auth context/provider for React
   - No protected route implementation

4. **No Data Fetching in Components**
   - Home page: No integration
   - Jobs page: Hardcoded placeholder data instead of fetching from `/jobs`
   - Profile page: Hardcoded user data instead of fetching from `/auth/me`
   - No loading states, error handling, or fallbacks

5. **No State Management**
   - No global state for auth (user, token, login status)
   - No data cache or state management library configured

---

## 📋 Integration Checklist

### Immediate Next Steps

- [ ] Create API client configuration (base URLs, environment handling)
- [ ] Implement auth service (login, register, token management)
- [ ] Create auth context/provider for global state
- [ ] Implement protected routes (redirect to login if not authenticated)
- [ ] Add login/register pages
- [ ] Fetch and display jobs on Jobs page from `/jobs` endpoint
- [ ] Fetch and display user profile on Profile page from `/auth/me`
- [ ] Implement job application submission from Jobs page
- [ ] Implement profile edit functionality

### Data Flow Examples Needed

**User Registration Flow:**
1. User fills registration form (email, password, role)
2. POST to `http://localhost:3001/auth/register`
3. Receive JWT token in response
4. Store token in localStorage/cookies
5. Redirect to home/jobs page

**Jobs Display Flow:**
1. User navigates to /jobs page
2. Fetch `http://localhost:3002/jobs`
3. Parse JSON response and display job cards
4. User clicks on job → show details or application form
5. User submits application → POST to `http://localhost:3003/applications`

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js:3005)                  │
│                                                              │
│  Pages: Home, Jobs, Profile                                 │
│  ❌ Currently: No API integration, static content           │
│  ✅ Ready: Basic UI structure, routing                      │
└────────┬──────────────┬───────────────────┬──────────────────┘
         │              │                   │
   HTTP Calls (TODO)    │                   │
         │              │                   │
    ┌────▼─────┐   ┌───▼────┐   ┌─────────▼──────┐
    │   USER   │   │  JOB   │   │  APPLICATION   │
    │ SERVICE  │   │SERVICE │   │    SERVICE     │
    │  :3001   │   │ :3002  │   │     :3003      │
    │   ✅     │   │  ✅    │   │      ✅        │
    └────┬─────┘   └───┬────┘   └────────┬───────┘
         │              │                 │
         │   HTTP Call  │                 │
         │ (inter-svc)  │                 │
         └──────┬───────┴─────────────────┘
                │
         ┌──────▼──────────┐
         │  PostgreSQL DB  │
         │      :5432      │
         │      ✅         │
         └─────────────────┘
```

---

## 🔐 Authentication Flow

### JWT Token Generation
```
User registers/logins → 
Backend validates credentials → 
Creates JWT payload: { sub: userId, email, role } → 
Signs with SECRET_KEY → 
Returns { access_token: "eyJhbGc..." }
```

### Token Usage
```
All protected endpoints require:
Authorization: Bearer <jwt_token>

Token is extracted from Authorization header and validated
by JWT Guard in each service
```

### Implementation Note
All services use the same `SECRET_KEY` environment variable for JWT validation, ensuring tokens are valid across services.

---

## 📝 Data Models

### User Entity
```typescript
{
  id: string (UUID)
  email: string (unique)
  password: string (hashed with bcrypt)
  role: "EMPLOYER" | "JOB_SEEKER"
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Job Entity
```typescript
{
  id: number (auto-increment)
  title: string
  description: string
  companyName: string
  createdBy: string (user ID)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Application Entity
```typescript
{
  id: number (auto-increment)
  jobId: number
  userId: string
  status: "PENDING" | "ACCEPTED" | "REJECTED"
  createdAt: timestamp
  updatedAt: timestamp
}
```

---

## 🚀 Environment Configuration

### Service Port Mapping
```
Frontend:          localhost:3005 → http://localhost:3000
User Service:      localhost:3001
Job Service:       localhost:3002
Application Service: localhost:3003
PostgreSQL:        localhost:5432
```

### Database Shared Configuration
All services connect to same PostgreSQL instance with environment variables:
- `DB_HOST`
- `DB_PORT`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_NAME`

### JWT Configuration
- `SECRET_KEY`: Used for signing/verifying JWT tokens (shared across services)

---

## 💡 Summary

**✅ Backend Status**: Production-ready with all endpoints implemented, role-based access control, and inter-service communication working.

**❌ Frontend Status**: Basic UI shell only - requires:
1. API client setup
2. Authentication implementation
3. Dynamic data fetching
4. Form handling and validation
5. Error/loading state management

**🎯 Next Priority**: Set up frontend API client and authentication layer to connect the existing UI to working backend endpoints.
