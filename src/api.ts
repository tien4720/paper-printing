import axios, { type AxiosInstance } from 'axios'

const apiClient: AxiosInstance = axios.create({
    baseURL: 'https://us-central1-fe-ws-test.cloudfunctions.net',
    headers: {
        'Content-type': 'application/json',
    },
})

export default apiClient
