import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header>
      <nav className="nav">
        <div className="nav-left">
          <Link to="/" className="brand">
            <span className="material-symbols-outlined sized" aria-hidden="true">☀️</span>
            Airly
          </Link>
          <div className="location">София, София – град 9°C</div>
        </div>

        <div className="nav-right">
          <form className="search-form" action="/search" role="search">
            <input
              className="search-input"
              type="search"
              name="q"
              placeholder="Търсене"
              aria-label="Търсене"
            />
            <button className="search-btn" type="submit">search</button>
          </form>
        </div>
      </nav>
    </header>
  );
}