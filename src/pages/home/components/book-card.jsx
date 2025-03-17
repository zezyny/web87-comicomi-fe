"use client"

import "../styles/book-card.css"

export default function BookCard({ title, author, rating, coverImage, onClick }) {
  return (
    <div className="book-card" onClick={onClick}>
      <div className="book-cover">
        <img src={coverImage || "/placeholder.svg"} alt={title} />
        <div className="rating">
          <span className="star">★</span>
          <span>{rating.toFixed(1)}</span>
        </div>
      </div>
      <div className="book-info">
        <h3 className="book-title">{title}</h3>
        <p className="book-author">{typeof author === "object" ? author.name : author}</p>
      </div>
    </div>
  )
}

