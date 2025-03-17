"use client"

import { useState } from "react"
import Header from "./header"
import GenreSection from "./genre-section"
import BookSection from "./book-section"
import BottomNavigation from "./bottom-navigation"
import BookDetail from "./book-detail"
import "../styles/reading-app.css"

export default function ReadingApp({ onNavigate }) {
  const [activeTab, setActiveTab] = useState("home")
  const [selectedBook, setSelectedBook] = useState(null)

  const bookData = {
    title: "Last'n Foresta De.",
    author: "Jamica Forest",
    rating: 4.0,
    coverImage: "/placeholder.svg?height=200&width=150",
  }

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

  const handleBookClick = (bookId) => {
    setSelectedBook(bookId)
  }

  const handleBackClick = () => {
    setSelectedBook(null)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)

    switch (tab) {
      case "home":
        // Stay on current page
        break
      case "discover":
        onNavigate("community")
        break
      case "news":
        onNavigate("library")
        break
      case "notifications":
        onNavigate("notifications")
        break
    }
  }

  if (selectedBook) {
    return <BookDetail onBack={handleBackClick} />
  }

  return (
    <div className="reading-app">
      <Header
        name="Hasselblad Nguyen"
        welcomeMessage="Welcome back!"
        avatarUrl="/placeholder.svg?height=60&width=60"
        onNavigate={onNavigate}
        genres={genres}
      />

      <main className="app-content">
        <GenreSection genres={genres} />

        <BookSection title="Continue Reading" books={[bookData, bookData, bookData]} onBookClick={handleBookClick} />

        <BookSection title="Popular now" books={[bookData, bookData, bookData]} onBookClick={handleBookClick} />

        <BookSection
          title="From Mystery category"
          books={[bookData, bookData, bookData]}
          onBookClick={handleBookClick}
        />
      </main>

      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} hasNotification={true} />
    </div>
  )
}

