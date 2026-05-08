import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const JOB_SERVICE_URL = process.env.NEXT_PUBLIC_JOB_SERVICE_URL || 'http://localhost:3002';
const APP_SERVICE_URL = process.env.NEXT_PUBLIC_APP_SERVICE_URL || 'http://localhost:3003';

// Create axios instances for each service
const userServiceApi: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const jobServiceApi: AxiosInstance = axios.create({
  baseURL: JOB_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const appServiceApi: AxiosInstance = axios.create({
  baseURL: APP_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
const setupInterceptors = (api: AxiosInstance) => {
  api.interceptors.request.use(
    (config) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for error handling
  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/auth/login';
        }
      }
      return Promise.reject(error);
    }
  );
};

setupInterceptors(userServiceApi);
setupInterceptors(jobServiceApi);
setupInterceptors(appServiceApi);

// User Service APIs
export const userAPI = {
  register: (data: { email: string; password: string; fullName: string; role: string }) =>
    userServiceApi.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    userServiceApi.post('/auth/login', data),
  getProfile: () => userServiceApi.get('/auth/me'),
  updateProfile: (data: any) => userServiceApi.put('/auth/me', data),
  getUsers: () => userServiceApi.get('/users'),
};

// Job Service APIs
export const jobAPI = {
  getJobs: (params?: any) => jobServiceApi.get('/jobs', { params }),
  getJobById: (id: string) => jobServiceApi.get(`/jobs/${id}`),
  createJob: (data: any) => jobServiceApi.post('/jobs/createJob', data),
  updateJob: (id: string, data: any) => jobServiceApi.patch(`/jobs/${id}`, data),
  deleteJob: (id: string) => jobServiceApi.delete(`/jobs/${id}`),
};

// Application Service APIs
export const applicationAPI = {
  submitApplication: (data: { jobId: string; userId: string; coverLetter?: string }) =>
    appServiceApi.post('/applications', data),
  getMyApplications: () => appServiceApi.get('/applications/me'),
  getApplicationById: (id: string) => appServiceApi.get(`/applications/${id}`),
  updateApplicationStatus: (id: string, status: string) =>
    appServiceApi.patch(`/applications/${id}/updateStatus`, { status }),
  deleteApplication: (id: string) => appServiceApi.delete(`/applications/${id}/delete`),
};

export default userServiceApi;
