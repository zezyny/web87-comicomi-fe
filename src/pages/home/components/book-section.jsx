"use client"

import BookCard from "./book-card"
import "../styles/book-section.css"

export default function BookSection({ title, books, onBookClick }) {
  if (books.length === 0) {
    return (
      <section className="book-section">
        <h2 className="section-title">{title}</h2>
        <div className="no-books-message">No books found in this category</div>
      </section>
    )
  }

  return (
    <section className="book-section">
      <h2 className="section-title">{title}</h2>
      <div className="book-list">
        {books.map((book, index) => (
          <BookCard
            key={book.id || index}
            title={book.title}
            author={typeof book.author === "object" ? book.author.name : book.author}
            rating={book.rating}
            coverImage={book.coverImage}
            onClick={() => onBookClick(book.id)}
          />
        ))}
      </div>
    </section>
  )
}

