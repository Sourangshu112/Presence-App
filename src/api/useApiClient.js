import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useApi } from '@/context/APIContext';

export const useApiClient = () => {
  const router = useRouter();
  const apiurl = useApi();

  const fetchApi = async (endpoint, options = {}) => {
    const { requireAuth = true, isFormData = false, ...fetchOptions } = options;
    const headers = { ...fetchOptions.headers };

    // Automatically set JSON content type unless we are sending FormData (images)
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    // Automatically fetch and inject Token
    if (requireAuth) {
      const token = await SecureStore.getItemAsync('access_token');
      if (!token) {
        router.replace('/auth/Login');
        return Promise.reject({ status: 401, error: "No Token found" });
      }
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${apiurl}${endpoint}`, {
        ...fetchOptions,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        // Global redirect for unauthorized or forbidden tokens
        if (response.status === 401 || response.status === 403) {
          await SecureStore.deleteItemAsync('access_token'); 
          router.replace('/auth/Login');
        }
        // Reject so the component's catch() block triggers
        return Promise.reject({ status: response.status, ...data });
      }

      return data;
    } catch (error) {
      // If the error has a status, it came from our rejection block above
      if (error.status) return Promise.reject(error);
      
      // Otherwise, it's a hard network failure
      return Promise.reject({ status: 500, error: "Network Error: Could not connect to the server." });
    }
  };

  return { fetchApi };
};