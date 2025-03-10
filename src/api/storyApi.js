import axios from 'axios'

const baseUrl = 'http://localhost:8080'

const storyUrl = {
    getStories: baseUrl + '/api/v1/story',
    getStory: baseUrl + '/api/v1/story/:id/detail'
}

const storyApi = {
    getStories: async ({ keyword, page, pageSize, orderDirection, orderBy }) => {
        const response = await axios.get(storyUrl.getStories, {
            params: { keyword, page, pageSize, orderDirection, orderBy }
        })
        return response.data
    },
    getStory: async (id) => {
        const trueUrl = storyUrl.getStory.replace(":id", id)
        const response = await axios.get(trueUrl)
        return response.data
    }
}

export default storyApi