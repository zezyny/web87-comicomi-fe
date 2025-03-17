"use client"

import "../styles/genre-section.css"

export default function GenreSection({ genres, onGenreSelect, activeGenres = [] }) {
  // Check if a genre is in the active genres array
  const isGenreActive = (genre) => {
    return activeGenres.includes(genre)
  }

  return (
    <section className="genre-section">
      <h2 className="section-title">
        Popular Genre
        {activeGenres && activeGenres.length > 0 && (
          <span className="selected-count">{activeGenres.length} selected</span>
        )}
      </h2>
      <div className="genre-tags">
        {genres.map((genre, index) => (
          <button
            key={index}
            className={`genre-tag ${activeGenres && isGenreActive(genre) ? "active" : ""}`}
            onClick={() => onGenreSelect(genre)}
          >
            {genre}
          </button>
        ))}
        <button className="genre-tag see-all" onClick={() => onGenreSelect("all")}>
          See All →
        </button>
      </div>
    </section>
  )
}

