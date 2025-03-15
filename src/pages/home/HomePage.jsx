import React from 'react';
import './HomePage.css'; 

function HomePage() {
  return (
    <div className="home-mobile">
      <header className="home-header">
        <div className="user-info">
          <img src="/src/assets/avatar.png" alt="User Avatar" className="avatar" /> {}
          <div className="welcome-message">
            <h3>Hasselblad Nguyen</h3>
            <p>Welcome back!</p>
          </div>
        </div>
        <button className="search-button">
          <i className="fas fa-search"></i> {}
        </button>
      </header>

      <section className="genre-section">
        <h4>Popular Genre</h4>
        <div className="genre-list">
          <button>Love</button>
          <button>Society & Culture</button>
          <button className="active">Science</button>
          <button>Fantasy</button>
          <button>Genz</button>
          <button>Romance</button>
          <button>Fantasy&Discovery</button>
          <button>Tracking</button>
          <button>Society&Culture</button>
          <button>Love</button>
          <button>Science</button>
          <button>See All <i className="fas fa-arrow-right"></i></button>
        </div>
      </section>

      <section className="content-section">
        <h4>Continue Reading</h4>
        <div className="content-list">
          <ContentCard title="Last'n Foresta De." author="Jamico Forest" rating="4.0" image="/src/assets/book1.jpg" />
          {/* ... more content cards */}
        </div>
      </section>

      <section className="content-section">
        <h4>Popular now</h4>
        <div className="content-list">
          <ContentCard title="Last'n Foresta De." author="Jamico Forest" rating="4.0" image="/src/assets/book2.jpg" />
          {/* ... more content cards */}
        </div>
      </section>

      <nav className="bottom-nav">
        <button className="nav-button active"><i className="fas fa-home"></i> Home</button>
        <button className="nav-button"><i className="fas fa-globe"></i></button>
        <button className="nav-button"><i className="fas fa-list"></i></button>
        <button className="nav-button"><i className="fas fa-bell"></i> <span className="notification-dot"></span></button>
      </nav>
    </div>
  );
}

function ContentCard({ title, author, rating, image }) {
  return (
    <div className="content-card">
      <img src={image} alt={title} />
      <div className="card-info">
        <h5>{title}</h5>
        <p>{author}</p>
        <div className="rating">
          <i className="fas fa-star"></i> {rating}
        </div>
      </div>
    </div>
  );
}

export default HomePage;