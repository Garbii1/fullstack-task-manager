import axios from 'axios';

    const api = axios.create({
      baseURL: process.env.REACT_APP_API_URL, // Use environment variable
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Optional: Add a request interceptor to include the token if it exists
    // This is an alternative/addition to setting the default header in AuthContext
    api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Optional: Add a response interceptor to handle global errors like 401 Unauthorized
    api.interceptors.response.use(
      (response) => response, // Directly return successful responses
      (error) => {
        if (error.response && error.response.status === 401) {
          // Handle unauthorized errors (e.g., token expired)
          console.log('Unauthorized access - 401. Potentially logging out.');
          // Optionally trigger logout here or redirect to login
          // Example: Trigger a custom event or call a logout function from context if accessible
          // window.dispatchEvent(new CustomEvent('auth-error')); // Example event
          localStorage.removeItem('token'); // Clear token immediately
           if (!window.location.pathname.includes('/login')) { // Avoid redirect loop
               // window.location.href = '/login'; // Force reload to login
           }
        }
        // Return the error promise so components can handle specific errors
        return Promise.reject(error);
      }
    );


    export default api;