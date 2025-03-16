import axios from 'axios';

const baseUrl = 'http://localhost:8080/api';

const chapterUrl = {
    getChaptersByStoryId: baseUrl + '/stories/:storyId/chapters',
    createChapter: baseUrl + '/chapter/create',
    deleteChapter: baseUrl + '/chapters/:chapterId',
    updateChapter: baseUrl + '/chapters/:chapterId',
    getChapterDetail: baseUrl + '/chapters/:chapterId',
    getChapterContent: baseUrl + '/chapter/:chapterId/contents',
    getStoryDetail: baseUrl + '/v2/stories/:storyId',
    saveChapterNovel: baseUrl + '/chapter/save-content/novel/:chapterId',
    publishChapter: baseUrl + '/chapter/publish/:chapterId',
    loadCommonContent: baseUrl + '/chapter/contents/:chapterId',
    loadAdvancedContent: baseUrl + '/chapter/contents/:chapterId/private',
    uploadImageContent: baseUrl + '/chapter/save-content/comic/:chapterId',
    getCommonAllChapterOfStory: baseUrl + '/stories/:storyId/chapters/common'
};

const chapterApi = {
    getChaptersByStoryId: async (storyId, params, authToken) => {
        const trueUrl = chapterUrl.getChaptersByStoryId.replace(':storyId', storyId);
        const response = await axios.get(trueUrl, {
            params,
            headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
        });
        return response;
    },
    createChapter: async (chapterData, authToken) => {
        const response = await axios.post(chapterUrl.createChapter, chapterData, {
            headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
        });
        return response;
    },
    deleteChapter: async (chapterId, authToken) => {
        const trueUrl = chapterUrl.deleteChapter.replace(':chapterId', chapterId);
        const response = await axios.delete(trueUrl, {
            headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
        });
        return response;
    },
    updateChapter: async (chapterId, chapterData, authToken) => {
        const trueUrl = chapterUrl.updateChapter.replace(':chapterId', chapterId);
        const response = await axios.put(trueUrl, chapterData, {
            headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
        });
        return response;
    },
    getChapterDetail: async (chapterId, authToken) => {
        const trueUrl = chapterUrl.getChapterDetail.replace(':chapterId', chapterId);
        const response = await axios.get(trueUrl, {
            headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
        });
        return response;
    },
    getChapterContent: async (chapterId, authToken) => {
        const trueUrl = chapterUrl.getChapterContent.replace(':chapterId', chapterId);
        const response = await axios.get(trueUrl, {
            headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
        });
        return response;
    },
    getStoryDetail: async (storyId, authToken) => {
        const trueUrl = chapterUrl.getStoryDetail.replace(':storyId', storyId);
        const response = await axios.get(trueUrl, {
            headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
        });
        return response;
    },
    saveChapterNovel: async (chapterId, chapterContent, authToken) => {
        const trueUrl = chapterUrl.saveChapterNovel.replace(':chapterId', chapterId);
        const response = await axios.post(trueUrl, {contents: chapterContent}, {
            headers: authToken ? { 'Authorization': `Bearer ${authToken}`} : {}
        });
        return response;
    },
    publishChapter: async (chapterId, authToken) => {
        const trueUrl = chapterUrl.publishChapter.replace(':chapterId', chapterId);
        const response = await axios.get(trueUrl, {
            headers: authToken ? { 'Authorization': `Bearer ${authToken}`} : {}
        });
        return response;
    },
    loadCommonContent: async(chapterId, authToken) => {
        const trueUrl = chapterUrl.loadCommonContent.replace(':chapterId', chapterId);
        const response = await axios.get(trueUrl, {
            headers: authToken ? { 'Authorization': `Bearer ${authToken}`} : {}
        });
        return response;
    },
    loadPrivateContent: async(chapterId, authToken) => {
        const trueUrl = chapterUrl.loadAdvancedContent.replace(':chapterId', chapterId);
        const response = await axios.get(trueUrl, {
            headers: authToken ? { 'Authorization': `Bearer ${authToken}`} : {}
        });
        return response;
    },
    saveComicImage: async(chapterId, authToken, formData) => {
        const trueUrl = chapterUrl.uploadImageContent.replace(':chapterId', chapterId);
        const response = await axios.post(trueUrl,
            formData,
            {
                headers: authToken ? { 'Authorization': `Bearer ${authToken}`, "Content-Type": "multipart/form-data"} : {}
            }
        )
        return response
    },
    getCommonAllChapterOfStory: async (storyId, params) => {
        const trueUrl = chapterUrl.getCommonAllChapterOfStory.replace(':storyId', storyId);
        const response = await axios.get(trueUrl, {
            params,
            // headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {}
        });
        return response;
    },
};

export default chapterApi;
