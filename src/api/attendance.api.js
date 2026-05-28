import { useApiClient } from './useApiClient';

export const useAttendanceApi = () => {
    const { fetchApi } = useApiClient();
    
    return {
        patchAttendance : (body) => 
            fetchApi("/attendance/update-record/", {
                method : "PATCH",
                body : JSON.stringify(body)
            })
    }
}