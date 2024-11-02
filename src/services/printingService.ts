import api from '../api'

async function getPaperPrices(type: string) {
    return await api.get(`prices?paper_size=${type}`)
}

export default {
    getPaperPrices,
}
