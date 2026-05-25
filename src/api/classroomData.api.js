import { useApiClient } from './useApiClient';

export const useClassroomDataApi = () => {
    const { fetchApi } = useApiClient();

    return {
        getAnnouncements: (id) => 
            fetchApi(`/classroom_data/${id}/announcements/`, { method: 'GET' }),
        postAnnouncement: (id, content) => 
            fetchApi(`/classroom_data/${id}/announcements/create/`, {
                method: 'POST',
                body: JSON.stringify({content})
            }),
        getclassRoster: (id) => 
            fetchApi(`/classroom_data/${id}/roster/`, {method: 'GET'}),
    }
}