# Quick Reference - Backend Endpoints

## USER SERVICE (localhost:3001)

### POST /auth/register
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "role": "JOB_SEEKER"
  }'

# Response: { access_token: "jwt_token..." }
```

### POST /auth/login
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Response: { access_token: "jwt_token..." }
```

### GET /auth/me (Protected)
```bash
curl -X GET http://localhost:3001/auth/me \
  -H "Authorization: Bearer {token}"

# Response: { sub, email, role }
```

### PUT /auth/me (Protected)
```bash
curl -X PUT http://localhost:3001/auth/me \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{ "field": "value" }'
```

### DELETE /auth/me (Protected)
```bash
curl -X DELETE http://localhost:3001/auth/me \
  -H "Authorization: Bearer {token}"
```

### GET /users
```bash
curl -X GET http://localhost:3001/users

# Response: [ { id, email, role, ... }, ... ]
```

---

## JOB SERVICE (localhost:3002)

### GET /jobs (Public)
```bash
curl -X GET http://localhost:3002/jobs

# Response: [ { id, title, description, companyName, createdBy, createdAt }, ... ]
```

### GET /jobs/:id (Public)
```bash
curl -X GET http://localhost:3002/jobs/1

# Response: { id, title, description, companyName, createdBy, createdAt }
```

### POST /jobs/createJob (Protected, EMPLOYER only)
```bash
curl -X POST http://localhost:3002/jobs/createJob \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Developer",
    "description": "Looking for experienced developer with 5+ years",
    "companyName": "TechCorp"
  }'

# Response: { id, title, description, companyName, createdBy, createdAt }
```

### PATCH /jobs/:id (Protected, EMPLOYER only - owner check)
```bash
curl -X PATCH http://localhost:3002/jobs/1 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "description": "Updated description"
  }'
```

---

## APPLICATION SERVICE (localhost:3003)

### POST /applications (Protected, JOB_SEEKER only)
```bash
curl -X POST http://localhost:3003/applications \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{ "jobId": 1 }'

# Response: { id, jobId, userId, status, createdAt }
```

### GET /applications/me (Protected)
```bash
curl -X GET http://localhost:3003/applications/me \
  -H "Authorization: Bearer {token}"

# Response: [ { id, jobId, userId, status, createdAt }, ... ]
```

### DELETE /applications/:id/delete (Protected)
```bash
curl -X DELETE http://localhost:3003/applications/1/delete \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{ "id": 1 }'
```

### PATCH /applications/:id/updateStatus (Protected, EMPLOYER only)
```bash
curl -X PATCH http://localhost:3003/applications/1/updateStatus \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "status": "ACCEPTED"
  }'

# Valid statuses: PENDING, ACCEPTED, REJECTED
```

---

## Frontend Pages (localhost:3005)

### Current Implementation
| Page | Route | Status | Issue |
|------|-------|--------|-------|
| Home | / | ✅ Built | ❌ No API calls |
| Jobs | /jobs | ✅ Built | ❌ Hardcoded data |
| Profile | /profile | ✅ Built | ❌ Hardcoded data |

### Pages That Need to be Created
- [ ] Login page - should call POST /auth/login
- [ ] Register page - should call POST /auth/register
- [ ] Job details page - should call GET /jobs/:id
- [ ] My applications page - should call GET /applications/me
- [ ] Employer dashboard - for managing jobs and applications
- [ ] Job creation form - should call POST /jobs/createJob

---

## Role-Based Access Control

### JOB_SEEKER Permissions
- ✅ Register/Login
- ✅ View profile (GET /auth/me)
- ✅ Update profile (PUT /auth/me)
- ✅ Delete account (DELETE /auth/me)
- ✅ View all jobs (GET /jobs)
- ✅ View specific job (GET /jobs/:id)
- ✅ Submit applications (POST /applications)
- ✅ View own applications (GET /applications/me)
- ✅ Delete own applications (DELETE /applications/:id/delete)
- ❌ Create jobs
- ❌ Update jobs
- ❌ Update application status

### EMPLOYER Permissions
- ✅ Register/Login
- ✅ View profile (GET /auth/me)
- ✅ Update profile (PUT /auth/me)
- ✅ Delete account (DELETE /auth/me)
- ✅ View all jobs (GET /jobs)
- ✅ View specific job (GET /jobs/:id)
- ✅ Create jobs (POST /jobs/createJob)
- ✅ Update own jobs (PATCH /jobs/:id)
- ✅ Update application status (PATCH /applications/:id/updateStatus)
- ❌ Submit applications (blocked)
- ❌ Delete applications (unless they're the applicant)

---

## Service Ports & URLs

```
Frontend:            http://localhost:3005  (exposed from http://localhost:3000)
User Service:        http://localhost:3001
Job Service:         http://localhost:3002
Application Service: http://localhost:3003
PostgreSQL:          localhost:5432
```

---

## Common Integration Pattern (TypeScript/React)

```typescript
// Example: Fetch jobs and display in React component
import { useEffect, useState } from 'react';

export function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:3002/jobs');
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {jobs.map(job => (
        <div key={job.id}>
          <h3>{job.title}</h3>
          <p>{job.companyName}</p>
          <p>{job.description}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## Notes

1. **Authentication**: All protected endpoints require JWT token in `Authorization: Bearer {token}` header
2. **Inter-service calls**: Application Service calls Job Service to validate job existence
3. **Role validation**: Each service independently checks user role from JWT payload
4. **Database**: All services share single PostgreSQL instance
5. **CORS**: Ensure proper CORS headers are set if frontend and backend are on different origins

---

## Frontend Integration Needed

The following tasks need to be completed to connect frontend to backend:

1. **API Client Setup**
   - Create HTTP client with base URL configuration
   - Setup automatic token injection in headers
   - Create error handling wrapper

2. **Authentication Service**
   - Implement login/register logic
   - Handle token storage/retrieval
   - Create login/register pages

3. **Data Fetching**
   - Replace hardcoded data with API calls
   - Add loading/error states
   - Implement pagination if needed

4. **Form Handling**
   - Job creation form
   - Job application form
   - Profile edit form
   - Search/filter jobs form
