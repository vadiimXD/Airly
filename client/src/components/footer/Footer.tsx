import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="bottombar">
      <div className="footer-inner">
        <div className="footer-left">
          <span className="material-symbols-outlined sized" aria-hidden="true">☀️</span>
          <span className="brand-text">Airly</span>
        </div>

        <div className="footer-center">
          © 2025 Airly. All rights reserved by vаDiim.
        </div>

        <div className="footer-right">
          <Link to="/privacy" className="footer-link">Privacy</Link>
          <Link to="/terms" className="footer-link">Terms</Link>
        </div>
      </div>
    </footer>
  );
}