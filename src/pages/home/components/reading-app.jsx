"use client"

import { useState, useEffect } from "react"
import Header from "./header"
import GenreSection from "./genre-section"
import BookSection from "./book-section"
import BottomNavigation from "./bottom-navigation"
import BookDetail from "./book-detail"
import { useAuth } from "@/context/AuthContext"
import { mockBooks, mockGenres, mockContinueReading } from "@/data/mockData"
import "../styles/reading-app.css"

export default function ReadingApp({ onNavigate }) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("home")
  const [selectedBook, setSelectedBook] = useState(null)
  const [selectedGenres, setSelectedGenres] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [showGenreSection, setShowGenreSection] = useState(false)
  const [loading, setLoading] = useState(true)

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filter books when selected genres change
  useEffect(() => {
    if (selectedGenres.length > 0) {
      const filtered = mockBooks.filter((book) => book.genres.some((genre) => selectedGenres.includes(genre)))
      setFilteredBooks(filtered)
      setShowGenreSection(true)
    } else {
      setFilteredBooks([])
      setShowGenreSection(false)
    }
  }, [selectedGenres])

  const handleBookClick = (bookId) => {
    const book = mockBooks.find((b) => b.id === bookId)
    if (book) {
      setSelectedBook(book)
    }
  }

  const handleBackClick = () => {
    setSelectedBook(null)
  }

  const handleGenreSelect = (genre) => {
    if (genre === "all") {
      setSelectedGenres([])
    } else {
      setSelectedGenres((prevGenres) => {
        if (prevGenres.includes(genre)) {
          return prevGenres.filter((g) => g !== genre)
        } else {
          return [...prevGenres, genre]
        }
      })
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)

    switch (tab) {
      case "home":
        // Stay on current page
        break
      case "community":
        onNavigate("community")
        break
      case "library":
        onNavigate("library")
        break
      case "notifications":
        onNavigate("notifications")
        break
    }
  }

  // Create a title for the filtered section based on selected genres
  const getFilteredSectionTitle = () => {
    if (selectedGenres.length === 0) return ""
    if (selectedGenres.length === 1) return `From ${selectedGenres[0]}`
    if (selectedGenres.length === 2) return `From ${selectedGenres.join(" & ")}`
    return `From ${selectedGenres.slice(0, 2).join(", ")} & ${selectedGenres.length - 2} more`
  }

  if (loading) {
    return <div className="loading">Loading books...</div>
  }

  if (selectedBook) {
    return <BookDetail book={selectedBook} onBack={handleBackClick} onNavigate={onNavigate} />
  }

  // Get popular books (top rated)
  const popularBooks = [...mockBooks].sort((a, b) => b.rating - a.rating).slice(0, 6)

  // Get recommended books (different from popular)
  const recommendedBooks = [...mockBooks].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 6)

  return (
    <div className="reading-app">
      <Header
        name={user ? user.name : "Guest"}
        welcomeMessage={user ? "Welcome back!" : "Welcome to ComiComi"}
        avatarUrl={
          user?.avatarUrl ||
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/man-eAkD9h9AIcJMsOCkzwm9DOTNDSzZI2.png"
        }
        onNavigate={onNavigate}
        genres={mockGenres}
      />

      <main className="app-content">
        <GenreSection genres={mockGenres} onGenreSelect={handleGenreSelect} activeGenres={selectedGenres} />

        {showGenreSection && (
          <BookSection title={getFilteredSectionTitle()} books={filteredBooks} onBookClick={handleBookClick} />
        )}

        {!showGenreSection && (
          <>
            {user && mockContinueReading.length > 0 && (
              <BookSection title="Continue Reading" books={mockContinueReading} onBookClick={handleBookClick} />
            )}

            <BookSection title="Popular now" books={popularBooks} onBookClick={handleBookClick} />

            <BookSection title="Recommended for you" books={recommendedBooks} onBookClick={handleBookClick} />
          </>
        )}
      </main>

      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} hasNotification={true} />
    </div>
  )
}

