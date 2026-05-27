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
      // 1. Make the initial request using 'let' so we can overwrite it if we need to retry
      let response = await fetch(`${apiurl}${endpoint}`, {
        ...fetchOptions,
        headers,
      });

      // 🔥 THE INTERCEPTOR: Catch the 401 Unauthorized BEFORE failing
      if (response.status === 401 && requireAuth) {
        const refreshToken = await SecureStore.getItemAsync('refresh_token');

        if (refreshToken) {
          try {
            // Attempt to trade the refresh token for a new access token
            // Note: Update this path if your Django url is under /auth/ (e.g., /auth/token/refresh/)
            const refreshResponse = await fetch(`${apiurl}/auth/token/refresh/`, { 
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh: refreshToken }),
            });

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              await SecureStore.setItemAsync('access_token', refreshData.access);
              if (refreshData.refresh) {
                await SecureStore.setItemAsync('refresh_token', refreshData.refresh);
              }
              headers['Authorization'] = `Bearer ${refreshData.access}`;
              response = await fetch(`${apiurl}${endpoint}`, {
                ...fetchOptions,
                headers,
              });
            } else {
              throw new Error("Refresh token expired");
            }
          } catch (refreshError) {
            // Absolute session failure. Boot them out.
            await SecureStore.deleteItemAsync('access_token');
            await SecureStore.deleteItemAsync('refresh_token');
            router.replace('/auth/Login');
            return Promise.reject({ status: 401, error: "Session completely expired" });
          }
        } else {
          // No refresh token existed in storage in the first place
          await SecureStore.deleteItemAsync('access_token');
          router.replace('/auth/Login');
          return Promise.reject({ status: 401, error: "Session expired, no refresh token" });
        }
      }

      const data = await response.json();

      if (!response.ok) {
        // Global redirect if it's STILL 401/403 even after the refresh attempt
        if (response.status === 401 || response.status === 403) {
          await SecureStore.deleteItemAsync('access_token'); 
          await SecureStore.deleteItemAsync('refresh_token'); 
          router.replace('/auth/Login');
        }
        // Reject so the component's catch() block triggers
        return Promise.reject({ status: response.status, ...data });
      }

      return data;
    } catch (error) {
      if (error.status) return Promise.reject(error);
      
      console.error("FATAL API CLIENT ERROR:", error);

      return Promise.reject({ 
        status: 500, 
        error: `Client Error: ${error.message || "Unknown error occurred"}`,
        originalError: error 
      });
    }
  };

  return { fetchApi };
};