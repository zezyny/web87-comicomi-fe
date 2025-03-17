import { Content } from "antd/es/layout/layout";
import axios from "axios";

const baseUrl = 'http://localhost:8080/api/v2'

const commentUrl = {
    postComment: baseUrl + '/comment',
    getByChapterId: baseUrl + '/comments/chapter/:chapterId',
    getByStoryId: baseUrl + '/comments/story/:storyId',
    getLikeCount: baseUrl + '/comment/likes/:commentId' // need to be improve count on server side when posted an comment, then return directly at response.
}

const commentApi = {
    postComment: async(chapterId, storyId, comment, accessToken) => {
        if(chapterId == null || storyId == null || comment == null || accessToken == null)
            return{};
        try{
            const response = await axios.post(commentUrl.postComment, {
                chapterId: chapterId,
                storyId: storyId,
                CommentContent: comment
            },{
                headers:{
                    Authorization: `Bearer ${accessToken}`
                }
            })
            return response
        }catch(err){
            console.log("error, can't post comment.")
        }
    },
    getCommentByChapterId: async(chapterId) => {
        try{
            const response = await axios.get(commentUrl.getByChapterId.replace(":chapterId", chapterId))
            return response
        }catch(err){
            console.log("Err, can't get comment of chapter.")
        }
    },
    getCommentByStoryId: async(storyId) => {
        try{
            const response = await axios.get(commentUrl.getByStoryId.replace(":storyId", storyId))
            return response
        }catch(err){
            console.log("Err, can't get comment of chapter.")
        }
    },
    getCommentLikeCount: async(commentId) => {
        const response =   await axios.get(commentUrl.getLikeCount.replace(":commentId", commentId))
        if(response.status == 200){
            return response.data
        }else{
            return 0
        }
    }
}

export default commentApi