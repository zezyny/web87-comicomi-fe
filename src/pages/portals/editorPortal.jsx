import {React, useEffect} from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import storyApi from '../../api/storyApi';

function EditorPortal() {
    const navigate = useNavigate();
    const { storyId, chapterId } = useParams();
    
    const loadMetadata = async () => {
        let StoryData = await storyApi.getStory(storyId)
        console.log(StoryData)
        if(StoryData.type == "novel"){
            navigate(`/editor/novel/${chapterId}`)
        }else if(StoryData.type == "comic"){
            navigate(`/editor/comic/${chapterId}`)
        }
    } 
    
    useEffect(()=>{
        loadMetadata()
    },[])
    console.log(storyId, chapterId)

    return (
        <div style={{padding:"10px"}}>Please wait, re-directing... if not redirected automatically, please reload.</div>
    )
}

export default EditorPortal