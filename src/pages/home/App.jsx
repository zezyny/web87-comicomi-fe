"use client"

import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"
import ReadingApp from "./components/reading-app"
import CommunityPage from "./components/community-page"
import LibraryPage from "./components/library-page"
import NotificationPage from "./components/notification-page"
import IntroPage from "./components/onboarding/intro-page"
import SignupPage from "./components/auth/signup-page"
import LoginPage from "./components/auth/login-page"
import ForgotPasswordPage from "./components/auth/forgot-password-page"
import BookDetail from "./components/book-detail"
import { mockBooks } from "./data/mockData"

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedBook, setSelectedBook] = useState(null)

  // Extract the page from the URL query parameters
  const getPageFromUrl = () => {
    const searchParams = new URLSearchParams(location.search)
    return searchParams.get("page") || "home"
  }

  const handleNavigate = (pageName) => {
    if (pageName === "home") {
      navigate("/?page=home")
    } else {
      navigate(`/?page=${pageName}`)
    }
  }

  const handleBookClick = (bookId) => {
    const book = mockBooks.find((b) => b.id === bookId)
    if (book) {
      setSelectedBook(book)
      navigate("/book")
    }
  }

  const handleBackClick = () => {
    setSelectedBook(null)
    navigate(-1)
  }

  // Render the appropriate page based on the URL
  const renderHomePage = () => {
    const page = getPageFromUrl()

    switch (page) {
      case "home":
        return <ReadingApp onNavigate={handleNavigate} onBookClick={handleBookClick} />
      case "community":
        return <CommunityPage onNavigate={handleNavigate} />
      case "library":
        return <LibraryPage onNavigate={handleNavigate} />
      case "notifications":
        return <NotificationPage onNavigate={handleNavigate} />
      default:
        return <ReadingApp onNavigate={handleNavigate} onBookClick={handleBookClick} />
    }
  }

  return (
    <Routes>
      <Route path="/" element={renderHomePage()} />
      <Route path="/intro" element={<IntroPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        path="/book"
        element={
          selectedBook ? (
            <BookDetail book={selectedBook} onBack={handleBackClick} onNavigate={handleNavigate} />
          ) : (
            <div className="loading">Book not found</div>
          )
        }
      />
    </Routes>
  )
}

