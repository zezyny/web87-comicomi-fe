import axios from 'axios';

const baseUrl = 'http://localhost:8080';

const unlockUrl = {
    getUnlocksByCreator: baseUrl + '/api/v1/unlock',
}

const unlockApi = {
    getUnlocksByCreator: async ({ creatorId, period, page, limit, sortBy, sortDirection }) => {
        const response = await axios.get(unlockUrl.getUnlocksByCreator, {
            params: { creatorId, period, page, limit, sortBy, sortDirection }
        })
        return response.data;
    }
}

export default unlockApi;