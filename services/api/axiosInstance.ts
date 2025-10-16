import axios, { HttpStatusCode } from 'axios';
import { getMicrosoftToken } from 'services/token/microsoft';
import * as SecureStore from 'expo-secure-store';

const AxiosInstance = axios.create({
  // baseURL: '%%{APIBaseURL}%%',
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  // baseURL: 'https://chorusdev.cogninelabs.com/api/staffx/',
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

AxiosInstance.interceptors.request.use(
  async config => {
    console.log("Axios Request Interceptor Triggered");
    const token = await getMicrosoftToken();
    console.log("Attaching token to request:", token);
    if (token) {
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

AxiosInstance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === HttpStatusCode.Unauthorized) {
      // Clear stored tokens on 401 error
      try {
        await SecureStore.deleteItemAsync('ms_access_token');
        await SecureStore.deleteItemAsync('ms_refresh_token');
        console.log('Cleared tokens due to 401 error');
        // You might want to redirect to login screen here
        // or trigger a logout action
      } catch (clearError) {
        console.error('Error clearing tokens:', clearError);
      }
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;

