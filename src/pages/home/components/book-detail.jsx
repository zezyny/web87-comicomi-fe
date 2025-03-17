"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { mockComments, mockCommunityPosts, mockFavorites } from "@/data/mockData"
import "../styles/book-detail.css"

export default function BookDetail({ book, onBack, onNavigate }) {
  const { user } = useAuth()
  const [isLiked, setIsLiked] = useState(false)
  const [activeTab, setActiveTab] = useState("introduction")
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState("")
  const [showReplies, setShowReplies] = useState({})

  const [comments, setComments] = useState([])
  const [communityPosts, setCommunityPosts] = useState([])
  const [loading, setLoading] = useState(true)

  // Simulate loading data
  useEffect(() => {
    const loadData = async () => {
      // Check if book is in favorites
      if (user) {
        const isFavorite = mockFavorites.some((fav) => fav.id === book.id)
        setIsLiked(isFavorite)
      }

      // Get comments for this book
      const bookComments = mockComments.filter((comment) => comment.bookId === book.id)
      setComments(bookComments)

      // Get community posts for this book
      const bookPosts = mockCommunityPosts.filter((post) => post.bookId === book.id)
      setCommunityPosts(bookPosts)

      // Simulate API delay
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }

    loadData()
  }, [book.id, user])

  const handleCommunityPostClick = () => {
    onNavigate && onNavigate("community")
  }

  const formatLikes = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}k+`
    }
    return `${count}+`
  }

  const handleLike = (commentId, replyId = null) => {
    setComments((prevComments) => {
      return prevComments.map((comment) => {
        if (replyId) {
          // Handle like for a reply
          if (comment.id === commentId) {
            const updatedReplies = comment.replies.map((reply) => {
              if (reply.id === replyId) {
                return {
                  ...reply,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                  isLiked: !reply.isLiked,
                }
              }
              return reply
            })
            return { ...comment, replies: updatedReplies }
          }
        } else {
          // Handle like for a comment
          if (comment.id === commentId) {
            return {
              ...comment,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
              isLiked: !comment.isLiked,
            }
          }
        }
        return comment
      })
    })
  }

  const handleBookLike = () => {
    if (!user) {
      // Redirect to login if not logged in
      onNavigate("login")
      return
    }

    setIsLiked(!isLiked)
  }

  const handleReply = (commentId) => {
    setReplyingTo(commentId)
    setReplyText("")
  }

  const submitReply = () => {
    if (!replyingTo || !replyText.trim()) return

    if (!user) {
      // Redirect to login if not logged in
      onNavigate("login")
      return
    }

    const newReply = {
      id: Date.now(), // Generate a unique ID
      user: {
        name: user.name,
        avatar: user.name.charAt(0),
      },
      content: replyText,
      time: "Just now",
      likes: 0,
      isLiked: false,
    }

    setComments((prevComments) => {
      return prevComments.map((comment) => {
        if (comment.id === replyingTo) {
          return {
            ...comment,
            replies: [...comment.replies, newReply],
          }
        }
        return comment
      })
    })

    // Reset reply state
    setReplyingTo(null)
    setReplyText("")

    // Show replies for the item that was just replied to
    setShowReplies((prev) => ({
      ...prev,
      [replyingTo]: true,
    }))
  }

  const toggleReplies = (commentId) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }))
  }

  const cancelReply = () => {
    setReplyingTo(null)
    setReplyText("")
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="book-detail-page">
      {/* Header */}
      <header className="user-header">
        <div className="user-info">
          <div className="avatar avatar-medium">
            <img
              src={
                user?.avatarUrl ||
                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/man-eAkD9h9AIcJMsOCkzwm9DOTNDSzZI2.png" ||
                "/placeholder.svg" ||
                "/placeholder.svg"
              }
              alt="User avatar"
            />
          </div>
          <span className="username">{user ? user.name : "Guest"}</span>
        </div>
        <button className="search-button">
          <span className="search-icon">⌕</span>
        </button>
      </header>

      {/* Book Cover Section */}
      <div className="book-cover-section">
        <button className="back-button" onClick={onBack}>
          <span className="back-icon">←</span>
        </button>

        <div className="book-cover-container">
          <img
            src={book.coverImage || "/placeholder.svg?height=140&width=120"}
            alt={book.title || "Book cover"}
            className="book-cover-image"
          />
        </div>

        <button className={isLiked ? "like-button liked" : "like-button"} onClick={handleBookLike}>
          <span className="heart-icon">{isLiked ? "❤️" : "♡"}</span>
        </button>
      </div>

      {/* Book Info and Tabs */}
      <div className="book-detail-content">
        <div className="book-title-section">
          <h1 className="book-title">{book.title}</h1>
          <div className="book-rating">
            <span className="star-icon">★</span>
            <span className="rating-value">{book.rating.toFixed(1)}</span>
            <span className="rating-count">{book.reviewCount || 0} Reviews</span>
          </div>
        </div>

        <div className="author-section">
          <div className="author-avatar">
            <img
              src={book.author && book.author.avatarUrl ? book.author.avatarUrl : "/placeholder.svg?height=30&width=30"}
              alt={book.author ? book.author.name : "Author"}
            />
          </div>
          <span className="author-name">{book.author ? book.author.name : "Unknown Author"}</span>
        </div>

        {/* Tabs */}
        <div className="book-tabs">
          <button
            className={activeTab === "introduction" ? "tab-button active" : "tab-button"}
            onClick={() => setActiveTab("introduction")}
          >
            Introduction
          </button>
          <button
            className={activeTab === "chapters" ? "tab-button active" : "tab-button"}
            onClick={() => setActiveTab("chapters")}
          >
            Chapters
          </button>
          <button
            className={activeTab === "community" ? "tab-button active" : "tab-button"}
            onClick={() => setActiveTab("community")}
          >
            Community's Post
          </button>
          <button
            className={activeTab === "comments" ? "tab-button active" : "tab-button"}
            onClick={() => setActiveTab("comments")}
          >
            Comments
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "introduction" && (
            <div className="introduction-content">
              <p>{book.description}</p>
            </div>
          )}

          {activeTab === "chapters" && (
            <div className="chapters-content">
              {book.chapters.length === 0 ? (
                <p className="no-content">No chapters available yet.</p>
              ) : (
                book.chapters.map((chapter) => (
                  <div key={chapter.id} className="chapter-item">
                    <div className="chapter-info">
                      <span className="chapter-title">
                        Chapter {chapter.number}: {chapter.title}
                      </span>
                    </div>
                    <div className="chapter-progress">
                      <span className="progress-text">{chapter.progress || 0}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "community" && (
            <div className="community-content">
              {communityPosts.length === 0 ? (
                <p className="no-content">No community posts yet. Be the first to post!</p>
              ) : (
                communityPosts.map((post) => (
                  <div key={post.id} className="community-post">
                    <div className="post-user">
                      <div
                        className="user-avatar"
                        style={{ backgroundColor: post.user.avatar === "T" ? "#ff5722" : "#4CDEAA" }}
                      >
                        <span>{post.user.avatar}</span>
                      </div>
                      <div className="post-user-info">
                        <span className="post-username">{post.user.name}</span>
                        <span className="post-time">{post.time}</span>
                      </div>
                    </div>
                    <p className="post-content" onClick={handleCommunityPostClick}>
                      {post.content}
                    </p>

                    <div className="post-actions">
                      <button
                        className={`like-action ${post.isLiked ? "liked" : ""}`}
                        onClick={() => {
                          const updatedPosts = communityPosts.map((p) =>
                            p.id === post.id
                              ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
                              : p,
                          )
                          setCommunityPosts(updatedPosts)
                        }}
                      >
                        <span className="action-icon">{post.isLiked ? "❤️" : "♡"}</span>
                        <span className="like-count">{formatLikes(post.likes)}</span>
                      </button>

                      <button className="reply-action" onClick={handleCommunityPostClick}>
                        <span className="action-icon">↩</span>
                        <span>Reply</span>
                      </button>

                      <button className="view-replies-action" onClick={handleCommunityPostClick}>
                        <span>
                          View {post.comments} {post.comments === 1 ? "reply" : "replies"}
                        </span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "comments" && (
            <div className="comments-content">
              {comments.length === 0 ? (
                <p className="no-content">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-user">
                      <div
                        className="user-avatar"
                        style={{ backgroundColor: comment.user.avatar === "T" ? "#ff5722" : "#4CDEAA" }}
                      >
                        <span>{comment.user.avatar}</span>
                      </div>
                      <div className="comment-user-info">
                        <span className="comment-username">{comment.user.name}</span>
                        <span className="comment-time">{comment.time}</span>
                      </div>
                    </div>
                    <p className="comment-content">{comment.content}</p>

                    <div className="comment-actions">
                      <button
                        className={`like-action ${comment.isLiked ? "liked" : ""}`}
                        onClick={() => handleLike(comment.id)}
                      >
                        <span className="action-icon">{comment.isLiked ? "❤️" : "♡"}</span>
                        <span className="like-count">{formatLikes(comment.likes)}</span>
                      </button>

                      <button className="reply-action" onClick={() => handleReply(comment.id)}>
                        <span className="action-icon">↩</span>
                        <span>Reply</span>
                      </button>

                      {comment.replies && comment.replies.length > 0 && (
                        <button className="view-replies-action" onClick={() => toggleReplies(comment.id)}>
                          <span>
                            {showReplies[comment.id] ? "Hide" : "View"} {comment.replies.length}{" "}
                            {comment.replies.length === 1 ? "reply" : "replies"}
                          </span>
                        </button>
                      )}
                    </div>

                    {/* Replies section */}
                    {showReplies[comment.id] && comment.replies && comment.replies.length > 0 && (
                      <div className="replies-section">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="reply-item">
                            <div className="reply-user">
                              <div
                                className="user-avatar"
                                style={{ backgroundColor: reply.user.avatar === "T" ? "#ff5722" : "#4CDEAA" }}
                              >
                                <span>{reply.user.avatar}</span>
                              </div>
                              <div className="reply-user-info">
                                <span className="reply-username">{reply.user.name}</span>
                                <span className="reply-time">{reply.time}</span>
                              </div>
                            </div>
                            <p className="reply-content">{reply.content}</p>
                            <button
                              className={`like-action small ${reply.isLiked ? "liked" : ""}`}
                              onClick={() => handleLike(comment.id, reply.id)}
                            >
                              <span className="action-icon">{reply.isLiked ? "❤️" : "♡"}</span>
                              <span className="like-count">{formatLikes(reply.likes)}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply form */}
                    {replyingTo === comment.id && (
                      <div className="reply-form">
                        <div className="reply-input-container">
                          <input
                            type="text"
                            className="reply-input"
                            placeholder="Write a reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                          />
                          <div className="reply-actions">
                            <button className="cancel-reply" onClick={cancelReply}>
                              Cancel
                            </button>
                            <button className="submit-reply" onClick={submitReply} disabled={!replyText.trim()}>
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-navigation">
        <button className="nav-item active" onClick={() => onNavigate && onNavigate("home")}>
          <span>Home</span>
        </button>
        <button className="nav-item" onClick={() => onNavigate && onNavigate("community")}>
          <span className="nav-icon">🌐</span>
        </button>
        <button className="nav-item" onClick={() => onNavigate && onNavigate("library")}>
          <span className="nav-icon">📄</span>
        </button>
        <button className="nav-item" onClick={() => onNavigate && onNavigate("notifications")}>
          <span className="nav-icon">🔔</span>
          <span className="notification-dot"></span>
        </button>
      </nav>
    </div>
  )
}

