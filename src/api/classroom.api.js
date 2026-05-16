import { useApiClient } from './useApiClient';

export const useClassroomApi = () => {
  const { fetchApi } = useApiClient();

  return {
    getStudentDashboard: () => 
      fetchApi('/classroom/student/dashboard/', { method: 'GET' }),
      
    getTeacherDashboard: () => 
      fetchApi('/classroom/teacher/dashboard/', { method: 'GET' }),
      
    createClass: (name) => 
      fetchApi('/classroom/create/', { 
        method: 'POST', 
        body: JSON.stringify({ name }) 
      }),
      
    joinClass: (joinCode) => 
      fetchApi('/classroom/join/', { 
        method: 'POST', 
        body: JSON.stringify({ join_code: joinCode }) 
      }),
  };
};