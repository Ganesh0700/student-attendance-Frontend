import axios from 'axios';

const currentHost = window.location.hostname;
const isLocalhost = currentHost === 'localhost' || currentHost === '127.0.0.1';
const defaultApiUrl = isLocalhost
    ? 'http://localhost:5000/api'
    : '/api';
const rawApiUrl = (import.meta.env.VITE_API_URL || defaultApiUrl).trim();

function normalizeApiUrl(url) {
    const clean = (url || '').replace(/\/+$/, '');
    if (!clean) return '/api';
    if (clean === '/api' || clean.endsWith('/api')) return clean;
    return `${clean}/api`;
}

const API_URL = normalizeApiUrl(rawApiUrl);

const API = axios.create({
    baseURL: API_URL,
    timeout: 15000,
});

// Add Token to Headers
API.interceptors.request.use((req) => {
    if (localStorage.getItem('token')) {
        req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }
    return req;
});

export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data); // For Admin/Faculty/Student users

export const markAttendance = (data) => API.post('/mark_attendance', data);
export const registerStudentFace = (data) => API.post('/register', data); // Renamed for clarity, original was /register
export const registerStudent = registerStudentFace;
export const getStats = () => API.get('/stats');
export const getLogs = () => API.get('/attendance_log');

export const getHODDashboard = () => API.get('/dashboard/hod');
export const getStudentDashboard = () => API.get('/dashboard/student');
export const getStudentsList = () => API.get('/students');
export const applyLeave = (data) => API.post('/leave/apply', data);
export const getMyLeaves = () => API.get('/leave/my');

export default API;
