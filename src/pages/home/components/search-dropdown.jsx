"use client"

import { useState, useRef, useEffect } from "react"
import "../styles/search-dropdown.css"

export default function SearchDropdown({ isOpen, onClose, onNavigate, genres }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="search-dropdown-overlay">
      <div className="search-dropdown-container" ref={dropdownRef}>
        <div className="search-dropdown-header">
          <div className="app-name">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/comicomi-logo-ueL8kbSO7bnEY7YX9G4XDaacvbMENX.png"
              alt="ComiComi"
              className="logo-image"
            />
          </div>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="search-input-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-icon">⌕</span>
        </div>

        <div className="search-menu">
          <button
            className="menu-item"
            onClick={() => {
              onNavigate("home")
              onClose()
            }}
          >
            HOME
          </button>

          <button
            className="menu-item"
            onClick={() => {
              onNavigate("library")
              onClose()
            }}
          >
            LIBRARY
          </button>

          <div className="menu-item-dropdown">
            <button className="menu-item with-arrow" onClick={() => setIsExpanded(!isExpanded)}>
              CATEGORY <span className="dropdown-arrow">{isExpanded ? "▲" : "▼"}</span>
            </button>

            {isExpanded && (
              <div className="dropdown-content">
                {genres.map((genre, index) => (
                  <button
                    key={index}
                    className="dropdown-item"
                    onClick={() => {
                      // Handle genre selection
                      onClose()
                    }}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="search-results">
          {searchQuery && (
            <div className="no-results">
              <p>No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

