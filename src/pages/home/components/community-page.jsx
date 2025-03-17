"use client"

import { useState } from "react"
import SearchDropdown from "./search-dropdown"
import "../styles/community-page.css"

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("discover")
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const genres = [
    "Love",
    "Society & Culture",
    "Science",
    "Fantasy",
    "GenZ",
    "Romance",
    "Fantasy & Discovery",
    "Tracking",
    "Society & Culture",
    "Love",
    "Science",
  ]

  const posts = [
    {
      id: 1,
      user: { name: "Hasselblad Nguyen", avatar: "H" },
      title: "REVIEW: Last'n Foresta De. Chapter 1",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      time: "2 hrs ago",
      likes: 24,
      comments: 5,
    },
    {
      id: 2,
      user: { name: "Takahashi Daisuke", avatar: "T" },
      title: "REVIEW: Last'n Foresta De. Chapter 2",
      content:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      time: "5 hrs ago",
      likes: 18,
      comments: 3,
    },
    {
      id: 3,
      user: { name: "Hasselblad Nguyen", avatar: "H" },
      title: "Anyone know who's writer behind Last'n Foresta De?",
      content:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
      time: "1 day ago",
      likes: 32,
      comments: 12,
    },
    {
      id: 4,
      user: { name: "Takahashi Daisuke", avatar: "T" },
      title: "REVIEW: Last'n Foresta De. Chapter 3",
      content:
        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
      time: "2 days ago",
      likes: 15,
      comments: 7,
    },
  ]

  const handleNavigate = (page) => {
    // This would be handled by the parent component in a real app
    console.log(`Navigate to: ${page}`)
  }

  return (
    <div className="community-page">
      {/* Header */}
      <header className="community-header">
        <div className="user-info">
          <div className="avatar">
            <img src="/placeholder.svg?height=40&width=40" alt="User avatar" />
          </div>
          <span className="username">Hasselblad Nguyen</span>
        </div>
        <button className="search-button" onClick={() => setIsSearchOpen(true)}>
          <span className="search-icon">⌕</span>
        </button>
      </header>

      {/* Page Title */}
      <div className="page-title-container">
        <h1 className="page-title">Community Forum</h1>
      </div>

      {/* Posts Feed */}
      <div className="posts-feed">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
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
            </div>
            <div className="post-content">
              <h3 className="post-title">{post.title}</h3>
              <p className="post-text">{post.content}</p>
            </div>
            <div className="post-actions">
              <button className="action-button">
                <span className="action-icon">♥</span>
                <span className="action-count">{post.likes}</span>
              </button>
              <button className="action-button">
                <span className="action-icon">💬</span>
                <span className="action-count">{post.comments}</span>
              </button>
              <button className="action-button">
                <span className="action-icon">↗</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Post Button */}
      <button className="create-post-button">
        <span>Create Post</span>
      </button>

      {/* Bottom Navigation */}
      <nav className="bottom-navigation">
        <button className="nav-item">
          <span>Home</span>
        </button>
        <button className="nav-item active">
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

      <SearchDropdown
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
        genres={genres}
      />
    </div>
  )
}

