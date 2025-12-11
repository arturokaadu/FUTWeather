/**
 * =====================================================
 * MATCH CARD COMPONENT
 * =====================================================
 * 
 * Displays a single match with weather info
 */

import React from 'react';
import './MatchCard.css';
import MatchMenu from './MatchMenu';

function MatchCard({ match, weather }) {
    const [showMenu, setShowMenu] = React.useState(false);

    // Format time
    function formatTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    }

    // Get status display
    function getStatusDisplay() {
        // Fix: accessing properly flattened match object properties
        const matchDate = match.timestamp ? new Date(match.timestamp * 1000) : new Date(match.date);
        const time = formatTime(matchDate);
        const statusShort = match.status; // Access flat status directly

        switch (statusShort) {
            case 'NS':
                return (
                    <span className="match-card__time">
                        🕒 {time}
                    </span>
                );
            case '1H': return <span className="match-card__live">🔴 1T • {match.elapsed || 0}'</span>; // Assuming elapsed is added or accessible
            case '2H': return <span className="match-card__live">🔴 2T • {match.elapsed || 0}'</span>;
            case 'HT': return <span className="match-card__live">⏸️ ET</span>;
            case 'FT': return <span className="match-card__final">✅ Final • {time}</span>;
            default: return <span className="match-card__status-text">{statusShort} • {time}</span>;
        }
    }

    // Get tier based on weather
    function getTier() {
        if (!weather) return 'default';
        if (weather.temp >= 20 && weather.weather === 'Clear') return 'gold';
        if (weather.temp >= 10 && weather.temp < 25) return 'silver';
        if (weather.weather === 'Rain' || weather.weather === 'Snow') return 'special';
        return 'bronze';
    }

    const tier = getTier();

    return (
        <div className={`match-card match-card--${tier}`}>
            {/* League Header */}
            <div className="match-card__header">
                <span className="match-card__league match-card__league--highlight">
                    🏆 {match.league?.name}
                </span>
                <span className="match-card__status">{getStatusDisplay()}</span>
            </div>

            {/* Teams */}
            <div className="match-card__teams">
                <div className="match-card__team">
                    <img
                        src={match.home?.logo}
                        alt={match.home?.name}
                        className="match-card__logo"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <span className="match-card__name">{match.home?.name}</span>
                </div>

                <div className="match-card__score-container">
                    {match.status === 'NS' || match.status === 'TBD' ? (
                        <span className="match-card__vs">vs</span>
                    ) : (
                        <div className="match-card__score">
                            <span className="match-card__goals">{match.home?.score ?? 0}</span>
                            <span className="match-card__divider">-</span>
                            <span className="match-card__goals">{match.away?.score ?? 0}</span>
                        </div>
                    )}
                </div>

                <div className="match-card__team">
                    <img
                        src={match.away?.logo}
                        alt={match.away?.name}
                        className="match-card__logo"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <span className="match-card__name">{match.away?.name}</span>
                </div>
            </div>

            {/* Venue */}
            <div className="match-card__venue">
                🏟️ {match.venue?.name} • {match.venue?.city}
            </div>

            {/* Weather */}
            {weather && (
                <div className="match-card__weather">
                    <img
                        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                        alt={weather.weather}
                        className="match-card__weather-icon"
                    />
                    <span className="match-card__temp">{weather.temp}°C</span>
                    <span className="match-card__condition">{weather.weather}</span>
                </div>
            )}

            {/* Loading weather */}
            {!weather && (
                <div className="match-card__weather match-card__weather--loading">
                    ⏳ Cargando clima...
                </div>
            )}

            {/* MENU TOGGLE - Simple & Clean */}
            <div className="match-card__footer">
                <button
                    className={`match-card__toggle-btn ${showMenu ? 'active' : ''}`}
                    onClick={() => setShowMenu(!showMenu)}
                >
                    {showMenu ? '🔼' : '🍽️ Menú'}
                </button>
            </div>

            {/* FOOD MENU SKELETON */}
            <MatchMenu
                country={match.league?.country}
                city={match.venue?.city}
                homeTeam={match.home?.name}
                awayTeam={match.away?.name}
                leagueName={match.league?.name}
                expanded={showMenu}
            />
        </div>
    );
}

export default MatchCard;
