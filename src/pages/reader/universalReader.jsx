import { React, useEffect, useState, useRef, useCallback } from 'react';

import headerImage from "../../assets/logo1.png"

import "./reader.css"
import chapterApi from '../dashboard/chapterapi';
import storyApi from '../../api/storyApi';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaBackward } from 'react-icons/fa';

import Dropup from '../../components/commons/Dropup/Dropup';
import { DropupItem } from '../../components/commons/Dropup/Dropup';

const Header = ({ show, chapterName, chapterNumber, storyName}) => {
    return (
        <div className={show ? "header" : "header hide"}>
            <div className="imageSection">
                <img src={headerImage} style={{ filter: "invert(100%)" }} alt="" />
            </div>
            <div className="pageNumberSection">
                <p>{storyName} - {chapterName ? chapterName : "Untitled"}</p>
            </div>

        </div>
    )
}

const Viewport = ({ content, contentType = "novel", onScroll }) => {
    const viewportRef = useRef(null);

    useEffect(() => {
        const viewportElement = viewportRef.current;
        if (viewportElement) {
            viewportElement.addEventListener('scroll', onScroll);
        }
        return () => {
            if (viewportElement) {
                viewportElement.removeEventListener('scroll', onScroll);
            }
        };
    }, [onScroll]);

    return (
        <>
            {contentType === 'novel' ? (
                <div ref={viewportRef} className="viewportNovel" dangerouslySetInnerHTML={{ __html: content ? content : "<p>loading...</p>" }}>
                </div>
            ) : contentType === 'comic' ? (
                <div ref={viewportRef} className="comicRenderer">
                    {content && content.images ? (
                        content.images.map((image, index) => (
                            <img key={index} src={image} alt={`Comic page ${index + 1}`} className="comicPage" />
                        ))
                    ) : (
                        <p>Loading comic content...</p>
                    )}
                </div>
            ) : (
                <p>Unsupported content type</p>
            )}
        </>
    );
};

const BottomTaskbar = ({ show, Chapters = [], onChapterChange, onPrevChapter, onNextChapter, chapterNumber }) => {
    return (
        <div className={show ? "taskbar" : "taskbar hide"}>
            <div className="placeholder"></div>

            <div className="chapterSwitchSection">

                {/* Previous Chapter Button */}
                <button
                    className="chapterIter back"
                    onClick={onPrevChapter}
                    disabled={Chapters.length === 0}
                >
                    <FaArrowLeft />
                </button>

                {/* Chapter Selector */}

                <Dropup
                    onSelected={(e) => { onChapterChange(e) }}
                    values={Chapters}
                // selected={Chapters.length > 0 ? chapterNumber - 1 : -1 }
                >
                    {
                        Chapters.map((e) => {
                            console.log(e)
                            return (
                                <DropupItem value={e}>
                                    <p>{e.chapterTitle}</p>
                                </DropupItem>
                            )
                        })
                    }
                </Dropup>

                {/* Next Chapter Button */}
                <button
                    className="chapterIter next"
                    onClick={onNextChapter}
                    disabled={Chapters.length === 0}
                >
                    <FaArrowRight />
                </button>

            </div>
            <div className="placeholder"></div>

        </div>
    );
};

const UniversalReader = () => {
    const [chapterData, setChapterData] = useState({});
    const [storyData, setStoryData] = useState({});
    const [content, setContent] = useState(null);
    const [showHeaderTaskbar, setShowHeaderTaskbar] = useState(true);
    const [stretchViewport, setStretchViewport] = useState(false);
    const { chapterId, storyId } = useParams();
    const lastScrollY = useRef(0);
    const [chapters, setChapters] = useState([]);
    const navigate = useNavigate();

    // Open a new chapter
    const openNewChapter = (chapterDat) => {
        const chapterBaseUrl = `/reader/${storyId}/chapter/${chapterDat._id}`;
        navigate(chapterBaseUrl);
    };

    // Handle scroll behavior for hiding/showing header/taskbar

    const handleScroll = useCallback((event) => {
        const viewportElement = event.target;
        const currentScrollY = viewportElement.scrollTop;
        const scrollThreshold = 5;

        // Detect scroll direction and apply threshold
        if (currentScrollY > lastScrollY.current + scrollThreshold) {
            setShowHeaderTaskbar(false);
            setStretchViewport(true);
        } else if (currentScrollY < lastScrollY.current - scrollThreshold) {
            setShowHeaderTaskbar(true);
            setStretchViewport(false);
        }

        // Update last scroll position
        lastScrollY.current = currentScrollY;
    }, []);

    // Load chapter data
    const loadChapterData = async () => {
        console.log("Loading chapter:", chapterId);
        console.log("Loading story:", storyId);

        try {
            // Fetch chapter details
            const chapterDataResponse = await chapterApi.getChapterDetail(chapterId, "");
            if (chapterDataResponse.status === 200) {
                setChapterData(chapterDataResponse.data);

                // Fetch content for the chapter
                const contentsList = await chapterApi.loadCommonContent(chapterId);
                setContent(contentsList.data.content);

                // Fetch storyDetail
                const storyDat = await chapterApi.getStoryDetail(storyId)
                console.log(storyDat)
                if(storyDat.status == 200){
                    setStoryData(storyDat.data)
                }

                // Fetch all chapters for the story
                const chaptersList = await chapterApi.getCommonAllChapterOfStory(storyId);
                if (chaptersList.status === 200) {
                    setChapters(chaptersList.data);
                }

            }
        } catch (error) {
            console.error("Error loading chapter data:", error);
        }
    };

    // Watch for changes in chapterId and reload data
    useEffect(() => {
        loadChapterData();
    }, [chapterId]); // Trigger loadChapterData when chapterId changes

    return (
        <div className={!stretchViewport ? "universalReader" : "universalReader stretchView"}>
            <Header
                show={showHeaderTaskbar}
                chapterNumber={chapterData.chapterNumber}
                storyName = {storyData.title}
                chapterName={chapterData.chapterTitle}
            />
            <Viewport
                content={content}
                contentType={chapterData.type}
                onScroll={handleScroll}
            />
            <BottomTaskbar
                show={showHeaderTaskbar}
                Chapters={chapters}
                chapterNumber={chapterData.chapterNumber}
                onChapterChange={(e) => openNewChapter(e)}
            />
        </div>
    );
};



export default UniversalReader;