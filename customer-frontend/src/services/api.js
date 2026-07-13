import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

export const checkEligibility = data => api.post('/eligibility/check', data);
export const getJobs = params => api.get('/jobs', { params });
export const getJob = id => api.get(`/jobs/${id}`);
export const submitApplication = data => api.post('/applications', data);

export default api;
