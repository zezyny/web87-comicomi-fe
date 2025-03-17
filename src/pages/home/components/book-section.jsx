"use client"

import BookCard from "./book-card"
import "../styles/book-section.css"

export default function BookSection({ title, books, onBookClick }) {
  return (
    <section className="book-section">
      <h2 className="section-title">{title}</h2>
      <div className="book-list">
        {books.map((book, index) => (
          <BookCard
            key={index}
            title={book.title}
            author={book.author}
            rating={book.rating}
            coverImage={book.coverImage}
            onClick={() => onBookClick(`book-${index}`)}
          />
        ))}
      </div>
    </section>
  )
}

