import axios from 'axios'

const baseUrl = 'http://localhost:8080'

const userUrl = {
    getUsers: baseUrl + '/api/v1/user',
    getUser: baseUrl + '/api/v1/user/:id/detail',
    deleteUser: baseUrl + '/api/v1/user/:id/delete'
}

const userApi = {
    getUsers: async ({ keyword, page, pageSize, orderDirection, orderBy }) => {
        const response = await axios.get(userUrl.getUsers, {
            params: { keyword, page, pageSize, orderDirection, orderBy }
        })
        return response.data
    },
    getUser: async (id) => {
        const trueUrl = userUrl.getUser.replace(":id", id)
        const response = await axios.get(trueUrl)
        return response.data
    },
    deleteUser: async (id) => {
        const trueUrl = userUrl.deleteUser.replace(":id", id)
        const response = await axios.put(trueUrl)
        return { ...response.data, isSuccess: true }
    }
    // getAllUsers: async () => {
    //     const response = await axios.get(userUrl.getAllUsers)
    //     return response.data
    // }
}

export default userApi