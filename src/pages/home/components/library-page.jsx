"use client"

import { useState } from "react"
import SearchDropdown from "./search-dropdown"
import "../styles/library-page.css"

export default function LibraryPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState("news")
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

  const continueReading = [
    {
      id: "book-1",
      title: "Last'n Foresta De.",
      author: "Jamica Forest",
      coverImage: "/placeholder.svg?height=150&width=120",
      isNew: true,
    },
    {
      id: "book-2",
      title: "Last'n Foresta De.",
      author: "Jamica Forest",
      coverImage: "/placeholder.svg?height=150&width=120",
    },
    {
      id: "book-3",
      title: "Last'n Foresta De.",
      author: "Jamica Forest",
      coverImage: "/placeholder.svg?height=150&width=120",
      isNew: true,
    },
  ]

  const favorites = [
    {
      id: "book-4",
      title: "Last'n Foresta De.",
      author: "Jamica Forest",
      coverImage: "/placeholder.svg?height=150&width=120",
      isNew: true,
    },
    {
      id: "book-5",
      title: "Last'n Foresta De.",
      author: "Jamica Forest",
      coverImage: "/placeholder.svg?height=150&width=120",
    },
    {
      id: "book-6",
      title: "Last'n Foresta De.",
      author: "Jamica Forest",
      coverImage: "/placeholder.svg?height=150&width=120",
      isNew: true,
    },
  ]

  const downloaded = [
    {
      id: "book-7",
      title: "Last'n Foresta De.",
      author: "Jamica Forest",
      coverImage: "/placeholder.svg?height=150&width=120",
    },
    {
      id: "book-8",
      title: "Last'n Foresta De.",
      author: "Jamica Forest",
      coverImage: "/placeholder.svg?height=150&width=120",
      isNew: true,
    },
    {
      id: "book-9",
      title: "Last'n Foresta De.",
      author: "Jamica Forest",
      coverImage: "/placeholder.svg?height=150&width=120",
    },
  ]

  const handleNavigate = (page) => {
    onNavigate(page)
  }

  const renderBookGrid = (books, sectionTitle) => (
    <div className="book-section">
      <h2 className="section-title">{sectionTitle}</h2>
      <div className="book-grid">
        {books.map((book) => (
          <div key={book.id} className="library-book-card">
            <div className="book-cover-container">
              <img src={book.coverImage || "/placeholder.svg"} alt={book.title} className="book-cover" />
              {book.isNew && <span className="new-badge">NEW</span>}
            </div>
            <div className="book-info">
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">{typeof book.author === "object" ? book.author.name : book.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="library-page">
      {/* Header */}
      <header className="library-header">
        <div className="user-info">
          <div className="avatar avatar-medium">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/man-eAkD9h9AIcJMsOCkzwm9DOTNDSzZI2.png"
              alt="User avatar"
            />
          </div>
          <span className="username">Hasselblad Nguyen</span>
        </div>
        <button className="back-button" onClick={() => onNavigate("home")}>
          <span className="back-icon">←</span>
        </button>
        <button className="search-button" onClick={() => setIsSearchOpen(true)}>
          <span className="search-icon">⌕</span>
        </button>
      </header>

      {/* Page Title */}
      <div className="page-title-container">
        <h1 className="page-title">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/comicomi-logo-ueL8kbSO7bnEY7YX9G4XDaacvbMENX.png"
            alt="ComiComi"
            className="logo-image"
          />
          My Library
        </h1>
      </div>

      {/* Book Sections */}
      <div className="library-content">
        {renderBookGrid(continueReading, "Continue Reading")}
        {renderBookGrid(favorites, "Favorites")}
        {renderBookGrid(downloaded, "Downloaded")}
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-navigation">
        <button className="nav-item" onClick={() => onNavigate("home")}>
          <span>Home</span>
        </button>
        <button className="nav-item" onClick={() => onNavigate("community")}>
          <span className="nav-icon">🌐</span>
        </button>
        <button className="nav-item active">
          <span className="nav-icon">📄</span>
        </button>
        <button className="nav-item" onClick={() => onNavigate("notifications")}>
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

