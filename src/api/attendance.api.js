import { useApiClient } from './useApiClient';

export const useAttendanceApi = () => {
    const { fetchApi } = useApiClient();
    
    return {
        patchAttendance: (body) => 
            fetchApi("/attendance/update-record/", {
                method : "PATCH",
                body : JSON.stringify(body)
            }),
        createSession: (id,token) => 
            fetchApi(`/attendance/${id}/create-session/`, {
                method : "POST",
                body: JSON.stringify({ble_token: token})
        }),
        stopSession: (classId, sessId) => 
            fetchApi(`/attendance/${classId}/stop-session/${sessId}/`, {method : "POST"}),

        fetchLiveAttendance: (classId, sessId) => 
            fetchApi(`/attendance/${classId}/live-updates/${sessId}/`, {method: "GET"}),

        updateAttendance: (body) => 
            fetchApi("/attendance/upsert/", {
                method: "POST",
                body: JSON.stringify(body)
            }),
        getAttendanceOverview: (id) => 
            fetchApi(`/attendance/${id}/overview/`, {method: 'GET'}),
        getAttendanceData: (classId) => 
            fetchApi(`/attendance/${classId}/my-report/`, {method: "GET"}),
    }
}