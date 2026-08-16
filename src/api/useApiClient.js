import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native'; 
import { useApi } from '@/context/APIContext';

export const useApiClient = () => {
  const router = useRouter();
  const apiurl = useApi();

  const fetchApi = async (endpoint, options = {}) => {
    const { requireAuth = true, isFormData = false, ...fetchOptions } = options;
    const headers = { ...fetchOptions.headers };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    if (requireAuth) {
      const token = await SecureStore.getItemAsync('access_token');
      if (!token) {
        router.replace('/auth/Login');
        return Promise.reject({ status: 401, error: "No Token found" });
      }
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      let response = await fetch(`${apiurl}${endpoint}`, {
        ...fetchOptions,
        headers,
      });

      // Catch the 401 Unauthorized BEFORE failing
      if (response.status === 401 && requireAuth) {
        const refreshToken = await SecureStore.getItemAsync('refresh_token');

        if (refreshToken) {
          try {
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
            await SecureStore.deleteItemAsync('access_token');
            await SecureStore.deleteItemAsync('refresh_token');
            router.replace('/auth/Login');
            return Promise.reject({ status: 401, error: "Session completely expired" });
          }
        } else {
          await SecureStore.deleteItemAsync('access_token');
          router.replace('/auth/Login');
          return Promise.reject({ status: 401, error: "Session expired, no refresh token" });
        }
      }

      // Read response data
      const data = await response.json().catch(() => ({})); // Added safe catch in case response isn't JSON

      if (!response.ok) {
        // Global redirect for auth failures
        if (response.status === 401 || response.status === 403) {
          await SecureStore.deleteItemAsync('access_token'); 
          await SecureStore.deleteItemAsync('refresh_token'); 
          router.replace('/auth/Login');
        } 
        // 🔥 GLOBAL SERVER ERROR HANDLER
        else if (response.status >= 500) {
          Alert.alert("Server Error", "Something went wrong on our end. Please try again later.");
          router.push('/Shared/ServerError');
        }

        return Promise.reject({ status: response.status, ...data });
      }

      return data;
    } catch (error) {
      // If we already rejected with a status above, just pass it down
      if (error.status) return Promise.reject(error);
      
      // console.error("FATAL API CLIENT ERROR:", error);

      // 🔥 GLOBAL NETWORK ERROR HANDLER
      // React Native's fetch throws a specific TypeError when there is no network connection or the server is dead
      if (error.message === 'Network request failed') {
        Alert.alert(
          "Connection Error", 
          "Could not connect to the server. Please check your internet connection and try again."
        );
        router.push('/Shared/ServerError');
      } else {
        Alert.alert("Error", "An unexpected error occurred.");
      }

      return Promise.reject({ 
        status: 500, 
        error: `Client Error: ${error.message || "Unknown error occurred"}`,
        originalError: error 
      });
    }
  };

  return { fetchApi };
};