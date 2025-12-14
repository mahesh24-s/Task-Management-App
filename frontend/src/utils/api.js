import axios from 'axios';

const API_BASE_URL = 'https://task-management-app-xsrx.onrender.com';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    register: (data) => api.post('/register', data),
    login: (data) => api.post('/login', data),
};

// User Task APIs
export const taskAPI = {
    getUserTasks: () => api.get('/tasks'),
    createTask: (data) => api.post('/tasks', data),
    updateTask: (id, data) => api.put(`/tasks/${id}`, data),
    deleteTask: (id) => api.delete(`/tasks/${id}`),
};

// Admin APIs
export const adminAPI = {
    getAllUsers: () => api.get('/users'),
    changeUserRole: (id, role) => api.patch(`/users/updateRole/${id}`, { role }),
    deleteUser: (id) => api.delete(`/users/${id}`),
    assignTask: (taskId, userId) => api.post('/tasks/assign', { taskId, userId }),
};

// Password and Profile update
export const userAPI = {
    updatePassword: (data) => api.patch('/password', data),
    updateProfile: (data) => api.patch('/profile', data),
};

export default api;
