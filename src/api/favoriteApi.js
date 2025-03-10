import axios from 'axios'

const baseUrl = 'http://localhost:8080'

const favoriteUrl = {
    getFavoriteById: baseUrl + '/api/v1/favorite/:id',
}

const favoriteApi = {
    getFavoriteById: async (id) => {
        const trueUrl = favoriteUrl.getFavoriteById.replace(":id", id)
        const response = await axios.get(trueUrl)
        return response.data
    }
}

export default favoriteApi