import axios from 'axios';

const baseUrl = 'http://localhost:8080';

const transactionApi = {
    getTransactions: async ({ transactionType }) => {
        try {
            const response = await axios.get(`${baseUrl}/api/v1/transaction?transactionType=${transactionType}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching transactions:", error);
            throw error;
        }
    }
}

export default transactionApi;