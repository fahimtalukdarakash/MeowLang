// File: src/api/client.ts

import axios from 'axios'

// Create an axios instance with your API URL from .env
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// ── Request Interceptor ──────────────────────────────────────────
// This runs BEFORE every single API request automatically
// It reads the token from localStorage and adds it to the header
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('meowlang_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// ── Response Interceptor ─────────────────────────────────────────
// This runs AFTER every single API response automatically
// If the server returns 401 Unauthorized, clear the token and redirect to login
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('meowlang_token')
            localStorage.removeItem('meowlang_user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default apiClient