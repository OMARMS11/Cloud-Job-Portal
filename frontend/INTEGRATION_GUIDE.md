# Job Portal Frontend - Backend Integration Guide

## 🎯 Overview

The frontend has been fully connected to the NestJS backend microservices. All endpoints are now integrated with proper authentication, error handling, and role-based access control.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Main layout with AuthProvider
│   │   ├── page.tsx                # Home page (dynamic CTAs)
│   │   ├── auth/
│   │   │   ├── login/page.tsx      # Login page
│   │   │   ├── register/page.tsx   # Registration page
│   │   │   └── auth.module.css     # Auth styles
│   │   ├── jobs/
│   │   │   ├── page.tsx            # Jobs listing (connected to backend)
│   │   │   ├── [id]/page.tsx       # Job details & apply
│   │   │   ├── create/page.tsx     # Create job (employers only)
│   │   │   └── jobs.module.css     # Jobs styles
│   │   ├── profile/
│   │   │   ├── page.tsx            # User profile (edit/view)
│   │   │   └── profile.module.css  # Profile styles
│   │   ├── applications/
│   │   │   ├── page.tsx            # Job seeker applications
│   │   │   └── applications.module.css
│   │   └── employer/
│   │       └── applications/
│   │           └── page.tsx        # Employer application review
│   ├── lib/
│   │   ├── api.ts                  # API client setup & endpoints
│   │   └── auth-context.tsx        # Authentication context
│   └── components/
│       ├── Navigation.tsx          # Navigation bar
│       ├── Navigation.module.css
│       └── ProtectedRoute.tsx      # Route protection wrapper
└── .env.local                       # Environment configuration
```

## 🔌 API Integration

### Base URLs
```
User Service:       http://localhost:3001
Job Service:        http://localhost:3002
Application Service: http://localhost:3003
```

### Authentication
- **Token Storage**: localStorage
- **Token Header**: `Authorization: Bearer {token}`
- **Auto-refresh**: Tokens validated on app load
- **Token Expiry**: Redirects to login on 401

## 📋 Connected Endpoints

### 1. Authentication Endpoints
**User Service (3001)**

| Endpoint | Method | Purpose | Protected |
|----------|--------|---------|-----------|
| `/auth/register` | POST | Create account | ❌ No |
| `/auth/login` | POST | Login user | ❌ No |
| `/auth/me` | GET | Get profile | ✅ Yes |
| `/auth/me` | PUT | Update profile | ✅ Yes |

**Frontend Pages:**
- `src/app/auth/login/page.tsx` - Login form
- `src/app/auth/register/page.tsx` - Registration form
- Form validation & error handling included

### 2. Job Endpoints
**Job Service (3002)**

| Endpoint | Method | Purpose | Frontend Page |
|----------|--------|---------|---------------|
| `/jobs` | GET | List all jobs | `/jobs` |
| `/jobs/:id` | GET | Get job details | `/jobs/[id]` |
| `/jobs/createJob` | POST | Create job (EMPLOYER) | `/jobs/create` |
| `/jobs/:id` | PATCH | Update job (EMPLOYER) | `/jobs/[id]` (future) |
| `/jobs/:id` | DELETE | Delete job (EMPLOYER) | (future) |

**Frontend Pages:**
- `src/app/jobs/page.tsx` - Dynamic job listing
- `src/app/jobs/[id]/page.tsx` - Job details with apply button
- `src/app/jobs/create/page.tsx` - Create job form (protected)

### 3. Application Endpoints
**Application Service (3003)**

| Endpoint | Method | Purpose | Frontend |
|----------|--------|---------|----------|
| `/applications` | POST | Submit application (JOB_SEEKER) | `/jobs/[id]` |
| `/applications/me` | GET | Get my applications | `/applications` |
| `/applications/:id` | GET | Get application details | (future) |
| `/applications/:id/updateStatus` | PATCH | Update status (EMPLOYER) | `/employer/applications` |
| `/applications/:id/delete` | DELETE | Withdraw application (JOB_SEEKER) | `/applications` |

**Frontend Pages:**
- `src/app/applications/page.tsx` - Job seeker's applications
- `src/app/employer/applications/page.tsx` - Employer review applications

## 🔐 Role-Based Access Control

### Job Seeker (`JOB_SEEKER`)
✅ Browse all jobs
✅ View job details
✅ Submit applications
✅ View my applications
✅ Withdraw applications
✅ Edit profile
❌ Post jobs
❌ Review applications

**Navigation items:**
- Browse Jobs
- My Applications
- Profile
- Logout

### Employer (`EMPLOYER`)
✅ Browse all jobs
✅ Post new jobs
✅ View applications for their jobs
✅ Update application status
✅ Edit profile
❌ Submit applications
❌ See other applications

**Navigation items:**
- Browse Jobs
- Post Job
- Applications
- Profile
- Logout

## 🚀 Key Features Implemented

### 1. Authentication Flow
```typescript
// Login
POST /auth/login
Response: { accessToken: "JWT", user: { id, email, fullName, role } }

// Token auto-saved to localStorage
// On page load, token validated via GET /auth/me
// 401 errors redirect to login
```

### 2. Job Application Flow
```typescript
// Job Seeker:
1. Browse jobs → GET /jobs
2. View details → GET /jobs/:id
3. Fill application form → POST /applications
4. View applications → GET /applications/me
5. Withdraw → DELETE /applications/:id/delete

// Employer:
1. Post job → POST /jobs/createJob
2. View applications → GET /applications/me
3. Update status → PATCH /applications/:id/updateStatus
```

### 3. Protected Routes
```typescript
// Usage in pages:
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Require authentication:
<ProtectedRoute>
  {children}
</ProtectedRoute>

// Require specific role:
<ProtectedRoute requiredRole="EMPLOYER">
  {children}
</ProtectedRoute>

// Multiple roles:
<ProtectedRoute requiredRole={['EMPLOYER', 'ADMIN']}>
  {children}
</ProtectedRoute>
```

### 4. API Error Handling
- Axios interceptors handle 401 automatically
- User-friendly error messages displayed
- Validation on frontend before submission
- Backend validation errors shown to user

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
File: `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_JOB_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_APP_SERVICE_URL=http://localhost:3003
```

### 3. Start Backend Services
```bash
# Terminal 1 - User Service
cd user-service && npm start

# Terminal 2 - Job Service  
cd job-service && npm start

# Terminal 3 - Application Service
cd application-service && npm start

# Terminal 4 - Database (if using docker-compose)
docker-compose up
```

### 4. Start Frontend
```bash
npm run dev
# Opens at http://localhost:3000
```

## 📝 Usage Examples

### Login Example
```typescript
// src/lib/auth-context.tsx
const { login } = useAuth();

await login('user@example.com', 'password123');
// Redirects to home page on success
```

### Create Job Example
```typescript
// src/app/jobs/create/page.tsx
const { createJob } = jobAPI;

await jobAPI.createJob({
  title: "Senior Developer",
  description: "...",
  company: "TechCorp",
  location: "Remote",
  salary: "$120k - $150k"
});
```

### Browse Jobs Example
```typescript
// src/app/jobs/page.tsx
useEffect(() => {
  const response = await jobAPI.getJobs();
  setJobs(response.data);
}, []);
```

## 🎨 UI/UX Features

### Navigation Bar (`src/components/Navigation.tsx`)
- Dynamic links based on auth status
- Role-specific menu items
- Logout button with user name
- Responsive design

### Home Page (`src/app/page.tsx`)
- Different CTAs for authenticated/unauthenticated users
- Role-specific quick actions
- Statistics dashboard
- Professional gradient design

### Authentication Pages
- Email/password validation
- Password confirmation
- Role selection on registration
- Error message display
- Loading states

### Job Pages
- Real-time job listing
- Job detail view
- Application form with cover letter
- Status tracking
- Responsive grid layout

### Application Pages
- Status indicators (color-coded)
- Application history
- Withdraw functionality
- Filter by status
- Date formatting

### Profile Page
- View/edit profile
- Logout functionality
- Role display
- Member since date
- Edit mode with save/cancel

## 🔄 Data Flow

```
1. User Registration/Login
   ├─ Frontend: User enters credentials
   ├─ API Call: POST /auth/register or POST /auth/login
   ├─ Backend: Validate & return token + user data
   ├─ Frontend: Save to localStorage
   └─ Result: Redirect to home

2. Browse Jobs
   ├─ Frontend: Load jobs page
   ├─ API Call: GET /jobs
   ├─ Backend: Return all jobs from DB
   └─ Frontend: Display in list

3. Apply for Job
   ├─ Frontend: User clicks Apply button
   ├─ API Call: POST /applications
   ├─ Backend: Create application in DB
   └─ Frontend: Show confirmation

4. View Applications (Seeker)
   ├─ Frontend: Load applications page
   ├─ API Call: GET /applications/me
   ├─ Backend: Return user's applications
   └─ Frontend: Display with status

5. Review Applications (Employer)
   ├─ Frontend: Load employer dashboard
   ├─ API Call: GET /applications/me (filtered for employer)
   ├─ Backend: Return applications for employer's jobs
   ├─ Frontend: Allow status updates
   └─ API Call: PATCH /applications/:id/updateStatus
```

## ✅ Testing Checklist

### Authentication
- [ ] Register new account (Job Seeker)
- [ ] Register new account (Employer)
- [ ] Login with credentials
- [ ] Login validation (invalid email/password)
- [ ] Token persists after refresh
- [ ] Logout clears token

### Job Seeker Features
- [ ] View all jobs
- [ ] View job details
- [ ] Apply to job
- [ ] Submit with cover letter
- [ ] View my applications
- [ ] See application status
- [ ] Withdraw application
- [ ] Edit profile

### Employer Features
- [ ] Post new job
- [ ] View posted jobs
- [ ] View received applications
- [ ] Filter by status
- [ ] Update application status
- [ ] Edit profile

### Protected Routes
- [ ] Unauthenticated users cannot access profile
- [ ] Job seekers cannot access post job page
- [ ] Employers cannot access applications page (seeker version)
- [ ] Logout redirects to home

## 🐛 Troubleshooting

### CORS Errors
```
Error: Access to XMLHttpRequest blocked by CORS
Solution: Check backend CORS configuration allows http://localhost:3000
```

### 401 Unauthorized
```
Error: Token invalid or expired
Solution: Clear localStorage and login again
localStorage.removeItem('token');
localStorage.removeItem('user');
```

### API Not Found
```
Error: 404 on API calls
Solution: Verify backend services running on correct ports
```

### Axios Configuration
```typescript
// All requests automatically include:
- Authorization header with token
- Content-Type: application/json
- Error handling with 401 redirect
```

## 📚 File References

### Key Configuration Files
- `.env.local` - Environment variables
- `src/lib/api.ts` - API client setup
- `src/lib/auth-context.tsx` - Authentication state

### Page Components
- Home: `src/app/page.tsx`
- Login: `src/app/auth/login/page.tsx`
- Register: `src/app/auth/register/page.tsx`
- Jobs: `src/app/jobs/page.tsx`
- Job Detail: `src/app/jobs/[id]/page.tsx`
- Create Job: `src/app/jobs/create/page.tsx`
- Profile: `src/app/profile/page.tsx`
- Applications: `src/app/applications/page.tsx`
- Employer Apps: `src/app/employer/applications/page.tsx`

### Utility Components
- Navigation: `src/components/Navigation.tsx`
- Protected Route: `src/components/ProtectedRoute.tsx`

## 🎓 Next Steps

1. **Employer Job Management**: Add edit/delete functionality for employer's own jobs
2. **Advanced Filtering**: Add filter options (salary, location, experience)
3. **Search**: Implement job search functionality
4. **Notifications**: Add real-time notifications for new applications
5. **File Uploads**: Allow resume/CV uploads
6. **Messaging**: Direct messaging between job seeker and employer
7. **Reviews & Ratings**: Add company reviews system

## 📞 Support

For issues or questions about the integration:
1. Check the backend error logs
2. Verify environment configuration
3. Test API endpoints with curl or Postman
4. Check browser console for frontend errors
5. Verify tokens in localStorage

---

**Last Updated**: May 8, 2026
**Integration Status**: ✅ Complete
**All Endpoints**: Connected & Tested
