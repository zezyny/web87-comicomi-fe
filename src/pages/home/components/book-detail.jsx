"use client"

import { useState } from "react"
import "../styles/book-detail.css"

export default function BookDetail({ onBack }) {
  const [isLiked, setIsLiked] = useState(false)
  const [activeTab, setActiveTab] = useState("introduction")

  const chapters = [
    { id: 1, title: "The Holiday", progress: 100 },
    { id: 2, title: "Meeting", progress: 100 },
    { id: 3, title: "Emily's Family", progress: 0 },
    { id: 4, title: "John The Lumberjack", progress: 0 },
    { id: 5, title: "Fire", progress: 0 },
    { id: 6, title: "Coming Soon...", progress: 0 },
  ]

  const communityPosts = [
    {
      id: 1,
      user: { name: "Takahashi Daisuke", avatar: "T" },
      content: "REVIEW: Last'n Foresta De. Chapter 1",
      time: "3 hrs",
    },
    {
      id: 2,
      user: { name: "Takahashi Daisuke", avatar: "T" },
      content: "REVIEW: Last'n Foresta De. Chapter 2",
      time: "5 hrs",
    },
    {
      id: 3,
      user: { name: "Takahashi Daisuke", avatar: "T" },
      content: "Anyone know who's writer behind Last'n Foresta De?",
      time: "1 day",
    },
  ]

  const comments = [
    {
      id: 1,
      user: { name: "Takahashi Daisuke", avatar: "T" },
      content: "I just finished it, so I love from chapter 01",
      time: "3 hrs",
    },
    {
      id: 2,
      user: { name: "Takahashi Daisuke", avatar: "T" },
      content:
        "The language choices employed by the main character are chapter 3 and chapter 4 were EPIC! What's your thoughts?",
      time: "5 hrs",
    },
    {
      id: 3,
      user: { name: "Takahashi Daisuke", avatar: "T" },
      content: "Hey, this actually good! I felt in love from chapter 01",
      time: "1 day",
    },
    {
      id: 4,
      user: { name: "Takahashi Daisuke", avatar: "T" },
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      time: "2 days",
    },
  ]

  return (
    <div className="book-detail-page">
      {/* Header */}
      <header className="user-header">
        <div className="user-info">
          <div className="avatar">
            <img src="/placeholder.svg?height=40&width=40" alt="User avatar" />
          </div>
          <span className="username">Hasselblad Nguyen</span>
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
          <img src="/placeholder.svg?height=140&width=120" alt="Last'n Foresta De." className="book-cover-image" />
        </div>

        <button className={isLiked ? "like-button liked" : "like-button"} onClick={() => setIsLiked(!isLiked)}>
          <span className="heart-icon">{isLiked ? "❤️" : "♡"}</span>
        </button>
      </div>

      {/* Book Info and Tabs */}
      <div className="book-detail-content">
        <div className="book-title-section">
          <h1 className="book-title">Last'n Foresta De.</h1>
          <div className="book-rating">
            <span className="star-icon">★</span>
            <span className="rating-value">4.0</span>
            <span className="rating-count">230 Reviews</span>
          </div>
        </div>

        <div className="author-section">
          <div className="author-avatar">
            <img src="/placeholder.svg?height=30&width=30" alt="Author" />
          </div>
          <span className="author-name">Hasami Florick</span>
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
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
              </p>
            </div>
          )}

          {activeTab === "chapters" && (
            <div className="chapters-content">
              {chapters.map((chapter) => (
                <div key={chapter.id} className="chapter-item">
                  <div className="chapter-info">
                    <span className="chapter-title">
                      Chapter {chapter.id}: {chapter.title}
                    </span>
                  </div>
                  <div className="chapter-progress">
                    <span className="progress-text">{chapter.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "community" && (
            <div className="community-content">
              {communityPosts.map((post) => (
                <div key={post.id} className="community-post">
                  <div className="post-user">
                    <div className="user-avatar">
                      <span>{post.user.avatar}</span>
                    </div>
                    <div className="post-user-info">
                      <span className="post-username">{post.user.name}</span>
                      <span className="post-time">{post.time}</span>
                    </div>
                  </div>
                  <p className="post-content">{post.content}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "comments" && (
            <div className="comments-content">
              {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-user">
                    <div className="user-avatar">
                      <span>{comment.user.avatar}</span>
                    </div>
                    <div className="comment-user-info">
                      <span className="comment-username">{comment.user.name}</span>
                      <span className="comment-time">{comment.time}</span>
                    </div>
                  </div>
                  <p className="comment-content">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-navigation">
        <button className="nav-item active">
          <span>Home</span>
        </button>
        <button className="nav-item">
          <span className="nav-icon">🌐</span>
        </button>
        <button className="nav-item">
          <span className="nav-icon">📄</span>
        </button>
        <button className="nav-item">
          <span className="nav-icon">🔔</span>
          <span className="notification-dot"></span>
        </button>
      </nav>
    </div>
  )
}

