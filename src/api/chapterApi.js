import axios from 'axios'

const baseUrl = 'http://localhost:8080/api/chapter'

const chapterUrl = {
    getChapter: baseUrl + '/chapter/:id',
    updateChapter: baseUrl + '/chapter/:id',
    getChapterContent: baseUrl + '/chapter/:id/contents'
}

const chapterApi = {
    getChapter: async ({id})=>{
        if(id == null) return {}
        const url = chapterUrl.getChapter.replace(':id', id);
        const response = await axios.get(url);
        return response.data
    },
    updateChapter: async ({id, contents}) => {
        console.log("Upload logic implementation here.")
        return {"status": "success"}
    },
    getChapterContent: async ({id}) => {
        const url = chapterUrl.getChapterContent.replace(':id', id);
        const response = await axios.get(url);
        return response.data
    }
}

export default chapterApi