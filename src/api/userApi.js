import axios from 'axios'

const baseUrl = 'http://localhost:8080'

const userUrl = {
    getUsers: baseUrl + '/api/v1/user',
    getUser: baseUrl + '/api/v1/user/:id/detail'
}

const userApi = {
    getUsers: async ({ keyword, page, pageSize, orderDirection, orderBy }) => {
        const response = await axios.get(userUrl.getUsers, {
            params: { keyword, page, pageSize, orderDirection, orderBy }
        })
        return response.data
    },
    getUser: async (id) => {
        const trueUrl = userUrl.getUser.replace("id", id)
        const response = await axios.get(trueUrl)
        return response.data
    }
}

export default userApi