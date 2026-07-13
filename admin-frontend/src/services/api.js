import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

// Attach token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('aussiepath_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const login = creds => api.post('/auth/login', creds);

// Stats
export const getStats = () => api.get('/stats');
export const getActivity = () => api.get('/stats/activity');

// Applications
export const getApplications = params => api.get('/applications', { params });
export const getApplication = id => api.get(`/applications/${id}`);
export const updateApplication = (id, data) => api.put(`/applications/${id}`, data);
export const deleteApplication = id => api.delete(`/applications/${id}`);

// Jobs
export const getJobs = params => api.get('/jobs', { params });
export const createJob = data => api.post('/jobs', data);
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data);
export const deleteJob = id => api.delete(`/jobs/${id}`);

export default api;
