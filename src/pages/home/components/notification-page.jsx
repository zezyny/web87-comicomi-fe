"use client"

import { useState } from "react"
import SearchDropdown from "./search-dropdown"
import "../styles/notification-page.css"

export default function NotificationPage() {
  const [activeTab, setActiveTab] = useState("notifications")
  const [activeChat, setActiveChat] = useState(null)
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

  const notifications = [
    {
      id: 1,
      user: { name: "Hasselblad Nguyen", avatar: "H" },
      content: "Your book 'Last'n Foresta De.' has been added to favorites by 5 users",
      time: "2 hrs ago",
      isUnread: true,
    },
    {
      id: 2,
      user: { name: "Takahashi Daisuke", avatar: "T" },
      content: "Takahashi Daisuke sent you a message",
      time: "5 hrs ago",
      isUnread: true,
    },
    {
      id: 3,
      user: { name: "System", avatar: "S" },
      content: "New chapter of 'Last'n Foresta De.' is now available",
      time: "1 day ago",
      isUnread: false,
    },
  ]

  const handleNavigate = (page) => {
    // This would be handled by the parent component in a real app
    console.log(`Navigate to: ${page}`)
  }

  const handleNotificationClick = (id) => {
    if (id === 2) {
      setActiveChat(id)
    }
  }

  const handleBackClick = () => {
    setActiveChat(null)
  }

  if (activeChat) {
    return (
      <div className="chat-page">
        {/* Chat Header */}
        <header className="chat-header">
          <button className="back-button" onClick={handleBackClick}>
            <span className="back-icon">←</span>
          </button>
          <div className="chat-user-info">
            <div className="chat-avatar" style={{ backgroundColor: "#ff5722" }}>
              <span>T</span>
            </div>
            <span className="chat-username">Takahashi Daisuke</span>
          </div>
          <div className="header-spacer"></div>
        </header>

        {/* Chat Messages */}
        <div className="chat-messages">
          <div className="message-date">Today</div>

          <div className="message received">
            <p className="message-text">Hello! Have you read the latest chapter of Last'n Foresta De?</p>
            <span className="message-time">10:30 AM</span>
          </div>

          <div className="message received">
            <p className="message-text">I think it's the best one so far!</p>
            <span className="message-time">10:31 AM</span>
          </div>

          <div className="message sent">
            <p className="message-text">Not yet, I'm planning to read it tonight!</p>
            <span className="message-time">10:45 AM</span>
          </div>

          <div className="message-date">Just now</div>

          <div className="message received">
            <p className="message-text">You're going to love it! Let me know what you think.</p>
            <span className="message-time">Just now</span>
          </div>
        </div>

        {/* Message Input */}
        <div className="message-input-container">
          <div className="message-input-wrapper">
            <input type="text" className="message-input" placeholder="Write a message..." />
            <button className="send-button">
              <span className="send-icon">↑</span>
            </button>
          </div>
          <div className="keyboard-indicator">HERE IS KEYBOARD.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="notification-page">
      {/* Header */}
      <header className="notification-header">
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
        <h1 className="page-title">Notifications</h1>
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-item ${notification.isUnread ? "unread" : ""}`}
            onClick={() => handleNotificationClick(notification.id)}
          >
            <div
              className="notification-avatar"
              style={{
                backgroundColor:
                  notification.user.avatar === "T"
                    ? "#ff5722"
                    : notification.user.avatar === "S"
                      ? "#2196f3"
                      : "#4CDEAA",
              }}
            >
              <span>{notification.user.avatar}</span>
            </div>
            <div className="notification-content">
              <p className="notification-text">{notification.content}</p>
              <span className="notification-time">{notification.time}</span>
            </div>
            {notification.isUnread && <div className="unread-indicator"></div>}
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-navigation">
        <button className="nav-item">
          <span>Home</span>
        </button>
        <button className="nav-item">
          <span className="nav-icon">🌐</span>
        </button>
        <button className="nav-item">
          <span className="nav-icon">📄</span>
        </button>
        <button className="nav-item active">
          <span className="nav-icon">🔔</span>
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

