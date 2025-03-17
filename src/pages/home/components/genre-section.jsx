import "../styles/genre-section.css"

export default function GenreSection({ genres }) {
  return (
    <section className="genre-section">
      <h2 className="section-title">Popular Genre</h2>
      <div className="genre-tags">
        {genres.map((genre, index) => (
          <button key={index} className="genre-tag">
            {genre}
          </button>
        ))}
        <button className="genre-tag see-all">See All →</button>
      </div>
    </section>
  )
}

