"use client"

import { useState } from "react"
import SearchDropdown from "./search-dropdown"
import "../styles/header.css"

export default function Header({ name, welcomeMessage, avatarUrl, onNavigate, genres }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <>
      <header className="app-header">
        <div className="user-info">
          <div className="avatar-container avatar-large">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/man-eAkD9h9AIcJMsOCkzwm9DOTNDSzZI2.png"
              alt="User avatar"
            />
          </div>
          <div className="user-details">
            <h1 className="user-name">{name}</h1>
            <p className="welcome-message">{welcomeMessage}</p>
          </div>
        </div>
        <button className="search-button" onClick={() => setIsSearchOpen(true)}>
          <span className="search-icon">⌕</span>
        </button>
      </header>

      <SearchDropdown
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={onNavigate}
        genres={genres}
      />
    </>
  )
}

