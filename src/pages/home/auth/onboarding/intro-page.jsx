"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import "../../styles/onboarding/intro-page.css"

export default function IntroPage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      title: "Discover new books",
      description: "Find your next favorite read from our vast collection of books across all genres.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 2,
      title: "Join the community",
      description: "Connect with other readers, share your thoughts, and discover recommendations.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 3,
      title: "Read anywhere",
      description: "Access your books anytime, anywhere. Read on any device with our synchronized library.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 4,
      title: "Track your progress",
      description: "Keep track of your reading progress and set goals to improve your reading habits.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 5,
      title: "Join the OsmiOsmi community",
      description: "Start your reading journey with thousands of other book lovers today.",
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      router.push("/signup")
    }
  }

  const handleSkip = () => {
    router.push("/signup")
  }

  return (
    <div className="intro-container">
      <header className="intro-header">
        <h1 className="app-name">OsmiOsmi</h1>
      </header>

      <div className="intro-content">
        <div className="intro-image-container">
          <img
            src={slides[currentSlide].image || "/placeholder.svg"}
            alt={slides[currentSlide].title}
            className="intro-image"
          />
        </div>

        <div className="intro-text">
          <h2 className="intro-title">{slides[currentSlide].title}</h2>
          <p className="intro-description">{slides[currentSlide].description}</p>
        </div>

        <div className="pagination-dots">
          {slides.map((slide, index) => (
            <span
              key={slide.id}
              className={`pagination-dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
      </div>

      <div className="intro-actions">
        <button className="skip-button" onClick={handleSkip}>
          Skip
        </button>
        <button className="next-button" onClick={handleNext}>
          {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
        </button>
      </div>

      <div className="intro-footer">
        <p className="login-link">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  )
}

