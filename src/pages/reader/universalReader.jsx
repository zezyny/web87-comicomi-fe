import { React, useEffect, useState, useRef, useCallback } from 'react';

import headerImage from "../../assets/logo1.png"

import "./reader.css"
import chapterApi from '../dashboard/chapterapi';
import storyApi from '../../api/storyApi';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaBackward, FaArrowDown, FaArrowUp, FaComment, FaHeart, FaPaperPlane } from 'react-icons/fa';
import { MdArrowBackIos } from 'react-icons/md';

import Dropup from '../../components/commons/Dropup/Dropup';
import { DropupItem } from '../../components/commons/Dropup/Dropup';
import { useCookies } from 'react-cookie';
import { permissionControl } from '../../security/permissionController.js';
import userApi from '../../api/userApi.js';
import commentApi from '../../api/commentApi.js';


const Header = ({ show, chapterName, chapterNumber, storyName }) => {
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

const Viewport = ({ content, contentType = "novel", onScroll, chapterId }) => {
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
    const imageCdn = `http://localhost:8080/cdn/comic/:chapterId/:traceId`

    return (
        <>
            {contentType === 'novel' ? (
                <div ref={viewportRef} className="viewportNovel" dangerouslySetInnerHTML={{ __html: content ? content : "<p>loading...</p>" }}>
                </div>
            ) : contentType === 'comic' ? (
                <div ref={viewportRef} className="comicRenderer">
                    {content && content.length > 0 ? (
                        content.map((image, index) => (
                            <img key={index} src={imageCdn.replace(":chapterId", chapterId).replace(":traceId", image)} alt={`Comic page ${index + 1}`} className="comicPage" />
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

const BottomTaskbar = ({ show, Chapters = [], onChapterChange, onPrevChapter, onNextChapter, chapterNumber, onOpenComment }) => {
    return (
        <div className={show ? "taskbar" : "taskbar hide"}>
            <div className="placeholder"></div>

            <div className="chapterSwitchSection">
                <button
                    className="chapterIter back"
                    onClick={onPrevChapter}
                    disabled={Chapters.length === 0}
                >
                    <FaArrowLeft />
                </button>

                <Dropup
                    onSelected={(e) => { onChapterChange(e) }}
                    values={Chapters}
                >
                    {
                        Chapters.map((e) => (
                            <DropupItem value={e} key={e._id}>
                                <p>{e.chapterTitle}</p>
                            </DropupItem>
                        ))
                    }
                </Dropup>

                <button
                    className="chapterIter next"
                    onClick={onNextChapter}
                    disabled={Chapters.length === 0}
                >
                    <FaArrowRight />
                </button>
            </div>
            <div className="placeholder">
                <button className="OpenCommentButton" onClick={() => { onOpenComment() }}>
                    <FaComment />
                </button>
            </div>
        </div>
    );
};

const CommentItem = ({ userName, userId, avatar, comment, like, commentId, liked }) => {
    const [username, setUsername] = useState(userName ? userName : "Anonymous")
    const [avt, setAvt] = useState(avatar)
    const [likeCount, setLikeCount] = useState(0)
    const [loadingUsername, setLoadingUsername] = useState(true); // Added loading state

    function formatNumber(num) {
        if (num >= 1000000) {
            return Math.floor(num / 1000000) + 'M+';
        } else if (num >= 1000) {
            return Math.floor(num / 1000) + 'K+';
        }
        return num.toString();
    }
    async function loadPostedUsername() {
        setLoadingUsername(true); // Start loading
        try {
            const userData = await userApi.getUser(userId);
            if (!userData) {
                // userName = "Anonymous" // Already handled by default useState
            } else {
                setUsername(userData.data.userName);
                if (userData.data.avatar) {
                    setAvt(userData.data.avatar);
                }
            }
            const likeCountRes = await commentApi.getCommentLikeCount(commentId);
            if (likeCountRes.status === 200) {
                setLikeCount(likeCountRes.count);
            }
        } catch (error) {
            console.error("Error loading username or like count:", error);
            // Handle error appropriately, maybe set username to "Anonymous" or show error message
        } finally {
            setLoadingUsername(false); // End loading regardless of success or failure
        }
    }

    useEffect(() => {
        loadPostedUsername();
    }, [userId, commentId]); // Added userId and commentId as dependencies

    return (
        <div className="CommentItem">
            <div className="CommentView">
                <div className="User">
                    <img src={avt != null ? avt : "http://dummyimage.com/106x189.png/5fa2dd/ffffff"} className="avt" alt="" />
                    <p>{loadingUsername ? "Loading..." : username}</p> {/* Show loading state */}
                </div>
                <p>{comment}</p>
                <div className="CommentAction">
                    {/* <button>Reply</button>  // Removed for now, can be implemented later */}
                    {/* <button>View replies</button> // Removed for now, can be implemented later */}
                </div>
            </div>
            <div className="CommentLike">
                <div className="Likes">
                    <span className={liked ? "liked" : ""} >{formatNumber(likeCount)}</span> <FaHeart className={liked ? "liked" : ""} />
                </div>
            </div>
        </div>
    )
}

const CommentBox = ({ children, open = true, onClose, loggedIn = false, onPostComment }) => {
    const [commentInput, setCommentInput] = useState('');

    const handleInputChange = (e) => {
        setCommentInput(e.target.value);
    };

    const handlePostClick = () => {
        if (commentInput.trim()) {
            onPostComment(commentInput);
            setCommentInput(''); // Clear input after posting
        } else {
            alert("Comment cannot be empty.");
        }
    };

    return (
        <div className={open ? "CommentBoxFloat" : "CommentBoxFloat hide"}>
            <div className="CommentBox">
                <button className="closeComment" onClick={() => { onClose() }}>
                    {<MdArrowBackIos className={open ? 'CommentDown' : 'CommentUp'} />}
                </button>
                <div className="Comments">
                    {children}
                </div>
                {
                    loggedIn ? (
                        <div className="CommentInput">
                            <input
                                type="text"
                                placeholder="Write something about this chapter..."
                                value={commentInput}
                                onChange={handleInputChange}
                            />
                            <button onClick={handlePostClick}><FaPaperPlane /></button>
                        </div>
                    ) : (
                        <div className="CommentInput NotLoggedIn">
                            <p style={{ color: "white" }}>Please login to post comment.</p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

const UniversalReader = () => {
    const [chapterData, setChapterData] = useState({});
    const [storyData, setStoryData] = useState({});
    const [userData, setUserData] = useState(null)
    const [content, setContent] = useState([]);
    const [showHeaderTaskbar, setShowHeaderTaskbar] = useState(true);
    const [stretchViewport, setStretchViewport] = useState(false);
    const { chapterId, storyId } = useParams();
    const lastScrollY = useRef(0);
    const [chapters, setChapters] = useState([]);
    const [openComment, setOpenComment] = useState(false)
    const [cookies, setCookie] = useCookies(['accessToken', 'userRole', 'userId', 'refreshToken']);
    const navigate = useNavigate();
    const [comments, setComments] = useState([])
    const [loadingComments, setLoadingComments] = useState(false); 

    const loadUser = useCallback(async () => {
        if (!cookies.refreshToken) return; // Prevent API call if no refresh token
        try {
            const newAccessToken = await permissionControl.refreshToken(cookies.refreshToken);
            setCookie("accessToken", newAccessToken);
            const res = await permissionControl.checkUser(newAccessToken);
            if (res.status === 200) {
                const UserDat = await userApi.getUser(cookies.userId);
                setUserData(UserDat.data);
            }
        } catch (error) {
            console.error("Error loading user:", error);
        }
    }, [cookies.refreshToken, cookies.userId, setCookie]);


    const loadComments = useCallback(async () => {
        setLoadingComments(true); // Start loading comments
        try {
            const commentsRes = await commentApi.getCommentByChapterId(chapterId);
            if (commentsRes.status === 200) {
                setComments(commentsRes.data.comments);
            }
        } catch (err) {
            console.error("Error loading comments:", err);
        } finally {
            setLoadingComments(false);
        }
    }, [chapterId]); 

    const postComment = useCallback(async (commentContent) => {
        if (!commentContent.trim()) {
            alert("Comment cannot be empty.");
            return;
        }
        try {
            await commentApi.postComment(chapterId, storyId, commentContent, cookies.accessToken);
            loadComments(); // Refresh comments after successful post
        } catch (err) {
            console.error("Error posting comment:", err);
            alert("Can't post your comment. Try again later.");
        }
    }, [chapterId, storyId, cookies.accessToken, loadComments]); 

    

    useEffect(() => {
        loadUser();
    }, [loadUser]); 

    useEffect(() => {
        loadComments();
    }, [chapterId, loadComments]); 

    const openNewChapter = useCallback((chapterDat) => {
        const chapterBaseUrl = `/reader/${storyId}/chapter/${chapterDat._id}`;
        navigate(chapterBaseUrl);
    }, [storyId, navigate]);

    const handleScroll = useCallback((event) => {
        const viewportElement = event.target;
        const currentScrollY = viewportElement.scrollTop;
        const scrollThreshold = 15;

        if (currentScrollY > lastScrollY.current + scrollThreshold) {
            setShowHeaderTaskbar(false);
            setStretchViewport(true);
        } else if (currentScrollY < lastScrollY.current - scrollThreshold) {
            setShowHeaderTaskbar(true);
            setStretchViewport(false);
        }

        lastScrollY.current = currentScrollY;
    }, []);


    const loadChapterData = useCallback(async () => {
        try {
            const chapterDataResponse = await chapterApi.getChapterDetail(chapterId, "");
            if (chapterDataResponse.status === 200) {
                setChapterData(chapterDataResponse.data);

                if (chapterDataResponse.data.type === 'novel') {
                    const contentsList = await chapterApi.loadCommonContent(chapterId);
                    setContent(contentsList.data.content);

                } else if (chapterDataResponse.data.type === 'comic') {
                    const contentsList = await chapterApi.getChapterContent(chapterId, "");
                    setContent(contentsList.data)
                } else {
                    setContent([]);
                    console.warn("Unknown content type:", chapterDataResponse.data.type);
                }

                const storyDat = await chapterApi.getStoryDetail(storyId)
                if (storyDat.status == 200) {
                    setStoryData(storyDat.data)
                }

                const chaptersList = await chapterApi.getCommonAllChapterOfStory(storyId);
                if (chaptersList.status === 200) {
                    setChapters(chaptersList.data);
                }
            }
        } catch (error) {
            console.error("Error loading chapter data:", error);
        }
    }, [chapterId, storyId]);

    useEffect(() => {
        loadChapterData();
    }, [loadChapterData]); 


    const onPrevChapter = useCallback(() => {
        if (chapters.length > 0 && chapterData) {
            const currentChapterIndex = chapters.findIndex(c => c._id === chapterData._id);
            if (currentChapterIndex > 0) {
                openNewChapter(chapters[currentChapterIndex - 1]);
            } else {
                console.log("Already at the first chapter.");
            }
        }
    }, [chapters, chapterData, openNewChapter]);

    const onNextChapter = useCallback(() => {
        if (chapters.length > 0 && chapterData) {
            const currentChapterIndex = chapters.findIndex(c => c._id === chapterData._id);
            if (currentChapterIndex < chapters.length - 1) {
                openNewChapter(chapters[currentChapterIndex + 1]);
            } else {
                console.log("Already at the last chapter.");
            }
        }
    }, [chapters, chapterData, openNewChapter]);


    return (
        <div className={!stretchViewport ? "universalReader" : "universalReader stretchView"}>
            <Header
                show={showHeaderTaskbar}
                chapterNumber={chapterData.chapterNumber}
                storyName={storyData.title}
                chapterName={chapterData.chapterTitle}
            />
            <Viewport
                content={content}
                contentType={chapterData.type}
                onScroll={handleScroll}
                chapterId={chapterId}
            />
            <CommentBox
                open={openComment}
                onClose={() => { setOpenComment(false) }}
                loggedIn={userData != null}
                onPostComment={postComment} 
            >
                {loadingComments ? (
                    <p>Loading comments...</p>
                ) : comments.length > 0 ? (
                    comments.map((c, i) => {
                        return (
                            <CommentItem
                                key={c._id} 
                                userId={c.userId}
                                commentId={c._id}
                                comment={c.content}
                                liked={true} 
                            />
                        )
                    })
                ) : (<p>
                    No comments yet.
                </p>)}
            </CommentBox>
            <BottomTaskbar
                show={showHeaderTaskbar}
                Chapters={chapters}
                chapterNumber={chapterData.chapterNumber}
                onChapterChange={(e) => openNewChapter(e)}
                onOpenComment={() => { setOpenComment(true) }}
                onPrevChapter={onPrevChapter}
                onNextChapter={onNextChapter}
            />
        </div>
    );
};

export default UniversalReader;