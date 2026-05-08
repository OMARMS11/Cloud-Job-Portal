# Job Portal - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js (v18+) installed
- npm or yarn
- All backend services running

### Step 1: Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Step 2: Configure Environment
Create/verify `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_JOB_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_APP_SERVICE_URL=http://localhost:3003
```

### Step 3: Start Backend Services
Open separate terminal windows:

**Terminal 1 - User Service**
```bash
cd user-service
npm install
npm start
# Runs on http://localhost:3001
```

**Terminal 2 - Job Service**
```bash
cd job-service
npm install
npm start
# Runs on http://localhost:3002
```

**Terminal 3 - Application Service**
```bash
cd application-service
npm install
npm start
# Runs on http://localhost:3003
```

**Terminal 4 - Database** (if using Docker)
```bash
docker-compose up
# Starts PostgreSQL
```

### Step 4: Start Frontend
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

Visit: **http://localhost:3000** 🎉

---

## 🧪 Quick Test Scenarios

### Scenario 1: Register & Login as Job Seeker

1. Click **Sign Up** button
2. Fill form:
   - Name: John Doe
   - Email: john@example.com
   - Password: password123
   - Role: **Job Seeker**
3. Click **Register**
4. You're automatically logged in!
5. You'll see "Browse Jobs" and "My Applications" in menu

✅ **Expected Result**: Dashboard shows job seeker options

---

### Scenario 2: Register & Login as Employer

1. Click **Sign Up** button
2. Fill form:
   - Name: Jane Smith
   - Email: jane@example.com
   - Password: password123
   - Role: **Employer**
3. Click **Register**
4. You're automatically logged in!
5. You'll see "Post Job" and "Applications" in menu

✅ **Expected Result**: Dashboard shows employer options

---

### Scenario 3: Job Seeker - Browse & Apply

1. Click **Browse Jobs** (or go to `/jobs`)
2. See list of available jobs
3. Click on a job to view details
4. Click **Apply Now**
5. Optionally add cover letter
6. Click **Submit Application**
7. Go to **My Applications** to track status

✅ **Expected Result**: Application appears with "PENDING" status

---

### Scenario 4: Employer - Post Job

1. Click **Post Job** (or go to `/jobs/create`)
2. Fill form:
   - Title: Senior Developer
   - Company: TechCorp Inc.
   - Location: Remote
   - Salary: $120k - $150k
   - Description: (add job details)
3. Click **Post Job**
4. Job appears in listings

✅ **Expected Result**: New job visible in jobs list

---

### Scenario 5: Employer - Review Applications

1. Click **Applications** (or go to `/employer/applications`)
2. See applications from job seekers
3. Use dropdown to change status:
   - PENDING (initial)
   - REVIEWED (after screening)
   - ACCEPTED (ready to hire)
   - REJECTED (not interested)
4. Job seeker sees updated status in their applications

✅ **Expected Result**: Application status updates in real-time

---

## 🔍 Testing Checklist

### Authentication ✅
- [ ] Register as job seeker
- [ ] Register as employer
- [ ] Login with email/password
- [ ] Incorrect credentials show error
- [ ] Logout clears data
- [ ] Token persists after refresh
- [ ] Expired token redirects to login

### Jobs ✅
- [ ] View all jobs
- [ ] Filter by status (coming soon)
- [ ] Click job to see details
- [ ] Job details show all info
- [ ] Apply button appears for seekers

### Applications ✅
- [ ] Job seekers see their applications
- [ ] Employers see received applications
- [ ] Status changes reflect in real-time
- [ ] Can withdraw application (seeker)
- [ ] Filter by status (employer)

### Profile ✅
- [ ] View profile info
- [ ] Edit profile
- [ ] Save changes
- [ ] See user role
- [ ] See member since date

### Navigation ✅
- [ ] Menu items change by role
- [ ] Navigation works on mobile
- [ ] All links navigate correctly
- [ ] Logout button works

---

## 📱 Mobile Testing

The app is fully responsive:
- Open DevTools (F12)
- Toggle device toolbar (Ctrl+Shift+M)
- Test on different screen sizes

All pages should work on:
- ✅ iPhone (375px)
- ✅ Tablet (768px)
- ✅ Desktop (1024px+)

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot GET /jobs"
**Solution**: Frontend running? Start with `npm run dev`

### Issue: "Connection Refused" on API calls
**Solution**: Backend services not running? Start all services

### Issue: "Invalid token" error
**Solution**: Clear localStorage:
```javascript
// Open browser console (F12) and run:
localStorage.clear();
```

### Issue: CORS error
**Solution**: Check backend CORS settings in `main.ts`:
```typescript
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
```

### Issue: Page stuck on loading
**Solution**: Check network tab (DevTools → Network), see what requests fail

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│  http://localhost:3000                                  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Pages: Auth, Jobs, Applications, Profile         │   │
│  │ Components: Navigation, ProtectedRoute            │   │
│  │ Hooks: useAuth, useRouter                         │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────┬──────────────────────────────────────┘
                  │ Axios API Calls
        ┌─────────┼─────────────────┐
        │         │                 │
        ▼         ▼                 ▼
    ┌───────┐ ┌──────────┐ ┌──────────────────┐
    │ User  │ │ Job      │ │ Application      │
    │Service│ │ Service  │ │ Service          │
    │:3001  │ │ :3002    │ │ :3003            │
    └───────┘ └──────────┘ └──────────────────┘
        │         │                 │
        └─────────┴─────────────────┘
                  │
                  ▼
            ┌────────────┐
            │ PostgreSQL │
            │  Database  │
            └────────────┘
```

---

## 🎯 Success Metrics

✅ **All Systems Working When:**
1. Can register new account
2. Can login with credentials
3. Jobs load from backend
4. Can apply to jobs
5. Can create jobs (as employer)
6. Can review applications (as employer)
7. Can update application status
8. Profile updates save
9. Navigation shows correct items by role
10. Logout clears authentication

---

## 📝 API Testing with cURL

### Test User Login
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Test Get Jobs
```bash
curl -X GET http://localhost:3002/jobs \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Submit Application
```bash
curl -X POST http://localhost:3003/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"jobId":"job-id","userId":"user-id","coverLetter":"..."}'
```

---

## 🎓 Learning Resources

### Frontend Code Structure
- `src/lib/api.ts` - Understanding API setup
- `src/lib/auth-context.tsx` - How authentication works
- `src/components/ProtectedRoute.tsx` - Role-based routing
- `src/app/jobs/page.tsx` - Example of connecting to API

### Next.js Features Used
- App Router (new Next.js 13+)
- File-based routing
- Server & Client components
- Dynamic routes `[id]`
- CSS Modules

### React Hooks Used
- `useState` - State management
- `useEffect` - Side effects (API calls)
- `useContext` - Global auth state
- `useRouter` - Navigation
- `useParams` - Route parameters

---

## 🚀 Next Steps After Testing

1. **Add more features:**
   - Search jobs by keyword
   - Filter jobs by location/salary
   - Advanced job seeker profiles
   - Company profiles

2. **Enhance UX:**
   - Loading skeletons
   - Toast notifications
   - Infinite scroll
   - Saved jobs

3. **Production ready:**
   - Environment-based configs
   - Error logging
   - Performance monitoring
   - Security audit

4. **Deployment:**
   - Deploy frontend to Vercel
   - Deploy backend to cloud
   - Set up CI/CD pipeline
   - Configure domain & SSL

---

## 💬 Questions?

1. Check `INTEGRATION_GUIDE.md` for detailed docs
2. Check `SETUP_SUMMARY.md` for what's connected
3. Review the source code comments
4. Check browser console for errors
5. Check backend logs for API errors

---

**Happy Testing! 🎉**

The entire Job Portal system is now connected and ready to use!
