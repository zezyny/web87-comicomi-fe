"use client"

import "../styles/bottom-navigation.css"

export default function BottomNavigation({ activeTab, onTabChange, hasNotification }) {
  return (
    <nav className="bottom-navigation">
      <button className={activeTab === "home" ? "nav-item active" : "nav-item"} onClick={() => onTabChange("home")}>
        <span>Home</span>
      </button>

      <button
        className={activeTab === "discover" ? "nav-item active" : "nav-item"}
        onClick={() => onTabChange("discover")}
      >
        <span className="nav-icon">🌐</span>
      </button>

      <button className={activeTab === "news" ? "nav-item active" : "nav-item"} onClick={() => onTabChange("news")}>
        <span className="nav-icon">📄</span>
      </button>

      <button
        className={activeTab === "notifications" ? "nav-item active" : "nav-item"}
        onClick={() => onTabChange("notifications")}
      >
        <span className="nav-icon">🔔</span>
        {hasNotification && <span className="notification-dot"></span>}
      </button>
    </nav>
  )
}

