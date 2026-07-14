import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

// Attach token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('aussiepath_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Customer-specific APIs
export const checkEligibility = data => api.post('/eligibility/check', data);
export const submitApplication = data => api.post('/applications', data);

// Shared/Admin APIs
export const getStats = () => api.get('/stats');
export const getActivity = () => api.get('/stats/activity');

export const getApplications = params => api.get('/applications', { params });
export const getApplication = id => api.get(`/applications/${id}`);
export const updateApplication = (id, data) => api.put(`/applications/${id}`, data);
export const deleteApplication = id => api.delete(`/applications/${id}`);

export const getJobs = params => api.get('/jobs', { params });
export const getJob = id => api.get(`/jobs/${id}`);
export const createJob = data => api.post('/jobs', data);
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data);
export const deleteJob = id => api.delete(`/jobs/${id}`);

export default api;
