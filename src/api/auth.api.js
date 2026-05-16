import { useApiClient } from './useApiClient';

export const useAuthApi = () => {
  const { fetchApi } = useApiClient();

  return {
    loginWithGoogleBackend: (accessToken, idToken) => 
      fetchApi('/auth/google/', {
        method: 'POST',
        requireAuth: false, // Explicitly skip token check here
        body: JSON.stringify({ access_token: accessToken, id_token: idToken })
      }),

    addStudentData: (formData) => 
      fetchApi('/auth/add_student_data', {
        method: 'PUT',
        isFormData: true, // Tells the client not to force application/json
        body: formData
      }),

    addTeacherData: (formData) => 
      fetchApi('/auth/add_teacher_data', {
        method: 'PUT',
        isFormData: true,
        body: formData
      }),

    verifySession: () => 
      fetchApi('/auth/verify_session/', { method: 'GET' }),
  };
};