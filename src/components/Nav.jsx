
/**
 * =====================================================
 * NAV COMPONENT - Rebranded
 * =====================================================
 */

import React, { useState, useEffect } from "react";
// New Logo: Weather + Soccer concept
import Logo from "../img/Weather.png"; // Keeping file ref but normally would change image
import SearchBar from "./SearchBar.jsx";
import "./Nav.css";
import { Link, useLocation } from "react-router-dom";

function Nav({ onSearch, onReset }) {
  const [time, setTime] = useState(new Date());
  const location = useLocation();

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time as HH:MM
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <nav className="scoreboard-nav">
      {/* LEFT: HOME TEAM (Branding) */}
      <div className="scoreboard__home">
        <Link to="/" onClick={onReset}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/1163/1163736.png"
            alt="FutWeather Logo"
            className="scoreboard__logo"
          />
        </Link>
        <Link to="/" onClick={onReset} style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="scoreboard__brand">FUTWEATHER</span>
            <span style={{ fontSize: '0.7rem', color: '#ccc', letterSpacing: '1px' }}>
              CLIMA, FUTBOL & COMIDA
            </span>
          </div>
        </Link>
      </div>

      {/* CENTER: SCOREBOARD (Time) */}
      <div className="scoreboard__center">
        <div className="scoreboard__timer">{formatTime(time)}</div>
        <div className="scoreboard__match-time">EN VIVO</div>
      </div>

      {/* RIGHT: AWAY TEAM (Navigation & Search) */}
      <div className="scoreboard__away">
        {/* Navigation Tabs */}
        <Link
          to="/"
          onClick={onReset}
          className={`scoreboard__tab ${location.pathname === '/' ? 'scoreboard__tab--active' : ''}`}
        >
          INICIO
        </Link>

        {/* Removed redundant FIXTURE tab since Home IS the Fixture now */}
        {/* Keeping old legacy link just in case user wants 'futbol' specifically? 
            User said "la home debe ser lo que habia antes", so filtering matches is now Home.
            I will keep a secondary link perhaps? No, clean up.
        */}

        {/* Search Bar (City) */}
        <div className="scoreboard__search-wrapper">
          <SearchBar onSearch={onSearch} />
        </div>
      </div>
    </nav>
  );
}

export default Nav;
