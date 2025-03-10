import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; 

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    // withCredentials: true, 
});

const chapterApi = {
    getChaptersByStoryId: (storyId, params, authToken) => apiClient.get(`/stories/${storyId}/chapters`, { params, headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {} }),
    createChapter: (chapterData, authToken) => apiClient.post('/chapter/create', chapterData, { headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {} }),
    deleteChapter: (chapterId, authToken) => apiClient.delete(`/chapters/${chapterId}`, { headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {} }),
    updateChapter: (chapterId, chapterData, authToken) => apiClient.put(`/chapters/${chapterId}`, chapterData, { headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {} }),
    getChapterDetail: (chapterId, authToken) => apiClient.get(`/chapters/${chapterId}`, { headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {} }),
    getChapterContent: (chapterId, authToken) => apiClient.get(`/chapter/${chapterId}/contents`, { headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {} }),
    getStoryDetail: (storyId, authToken) => apiClient.get(`/v2/stories/${storyId}`, { headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {} }),
};
export default chapterApi;