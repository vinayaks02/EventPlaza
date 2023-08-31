import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = () => {
    if (isMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top px-4">
      <Link className="navbar-brand" to="/">
        EventPlaza
      </Link>
      <button
        className={`navbar-toggler ${isMobileMenuOpen ? 'collapsed' : ''}`}
        type="button"
        onClick={handleMobileMenuToggle}
        aria-controls="navbarNav"
        aria-expanded={isMobileMenuOpen ? 'true' : 'false'}
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div
        className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`}
        id="navbarNav"
      >
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/" onClick={handleLinkClick}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/booking" onClick={handleLinkClick}>
              Booking
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/create" onClick={handleLinkClick}>
              Create Event
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/manage" onClick={handleLinkClick}>
              Manage Event
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/about" onClick={handleLinkClick}>
              About
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
