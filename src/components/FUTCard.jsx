/**
 * =====================================================
 * FUT CARD - FIFA Ultimate Team Style Weather Card
 * =====================================================
 * 
 * Inspired by FIFA 14+ Ultimate Team player cards:
 * - GOLD: Good weather (sunny, clear) - temp > 20°C
 * - SILVER: Moderate weather (cloudy) - temp 10-20°C
 * - BRONZE: Cold/Bad weather (rain, snow) - temp < 10°C
 * - SPECIAL: Extreme conditions (storms, heatwave)
 * 
 * Layout:
 * - Top: City name (like player name)
 * - Center: Temperature (like OVR rating)
 * - Left stats: Wind, Humidity, UV
 * - Right stats: Feels, Clouds, Pressure
 * - Bottom: Country flag + Weather condition
 */

import React from 'react';
import { Link } from 'react-router-dom';
import './FUTCard.css';

/**
 * Get card tier based on weather conditions
 * Like how FIFA rates players 75+ gold, 65-74 silver, <65 bronze
 */
function getCardTier(temp, weather) {
    const weatherLower = weather?.toLowerCase() || '';

    // SPECIAL cards for extreme conditions
    if (weatherLower.includes('thunder') || temp > 40 || temp < -10) {
        return 'special';
    }

    // GOLD: Nice weather, good temp
    if (temp >= 20 && (weatherLower === 'clear' || weatherLower === 'clouds')) {
        return 'gold';
    }

    // SILVER: Moderate
    if (temp >= 10 && temp < 25) {
        return 'silver';
    }

    // BRONZE: Cold or bad weather
    if (temp < 10 || weatherLower.includes('rain') || weatherLower.includes('snow')) {
        return 'bronze';
    }

    // Default to gold for nice conditions
    return 'gold';
}

/**
 * Get country code from city name (simplified mapping)
 */
function getCountryFlag(cityName) {
    const cityCountry = {
        'buenos aires': '🇦🇷',
        'london': '🇬🇧',
        'paris': '🇫🇷',
        'madrid': '🇪🇸',
        'barcelona': '🇪🇸',
        'rome': '🇮🇹',
        'milan': '🇮🇹',
        'berlin': '🇩🇪',
        'munich': '🇩🇪',
        'amsterdam': '🇳🇱',
        'lisbon': '🇵🇹',
        'dubai': '🇦🇪',
        'tokyo': '🇯🇵',
        'new york': '🇺🇸',
        'los angeles': '🇺🇸',
        'miami': '🇺🇸',
        'chicago': '🇺🇸',
        'mexico city': '🇲🇽',
        'são paulo': '🇧🇷',
        'rio de janeiro': '🇧🇷',
        'bogota': '🇨🇴',
        'lima': '🇵🇪',
        'santiago': '🇨🇱',
        'montevideo': '🇺🇾',
        'rosario': '🇦🇷',
        'cordoba': '🇦🇷',
        'mendoza': '🇦🇷',
        'moscow': '🇷🇺',
        'beijing': '🇨🇳',
        'shanghai': '🇨🇳',
        'mumbai': '🇮🇳',
        'sydney': '🇦🇺',
        'cairo': '🇪🇬',
        'lagos': '🇳🇬',
        'johannesburg': '🇿🇦',
    };

    const lowerCity = cityName?.toLowerCase() || '';
    return cityCountry[lowerCity] || '🌍';
}

/**
 * Get weather position text (like CM, ST, GK in FIFA)
 */
function getWeatherPosition(weather) {
    const positions = {
        'clear': 'SOL',
        'clouds': 'NUB',
        'rain': 'LLU',
        'drizzle': 'LLO',
        'thunderstorm': 'TOR',
        'snow': 'NIE',
        'mist': 'NIE',
        'fog': 'NIE',
        'haze': 'BRU',
    };

    return positions[weather?.toLowerCase()] || 'CLI';
}

/**
 * FUT Card Component
 */
function FUTCard({
    id,
    name,
    temp,
    feels,
    min,
    max,
    weather,
    wind,
    clouds,
    humidity = 65, // Default if not provided
    img,
    onClose
}) {
    const tier = getCardTier(temp, weather);
    const flag = getCountryFlag(name);
    const position = getWeatherPosition(weather);
    const weatherIcon = `https://openweathermap.org/img/wn/${img}@2x.png`;

    // Calculate "playability score" like FIFA OVR
    // Higher is better weather for playing
    const playScore = Math.round(
        100 -
        Math.abs(temp - 22) * 2 - // Optimal temp is 22°C
        (wind > 20 ? wind : 0) - // Penalize high wind
        (clouds > 80 ? 10 : 0) - // Penalize heavy clouds
        (weather?.toLowerCase().includes('rain') ? 20 : 0)
    );

    return (
        <div className={`fut-card fut-card--${tier}`}>
            {/* Close button */}
            <button
                className="fut-card__close"
                onClick={() => onClose(id)}
                aria-label="Remove city"
            >
                ×
            </button>

            {/* Card inner structure */}
            <div className="fut-card__inner">

                {/* Top section: Rating + Position */}
                <div className="fut-card__top">
                    <div className="fut-card__rating">
                        {Math.round(temp)}°
                    </div>
                    <div className="fut-card__position">
                        {position}
                    </div>
                    <div className="fut-card__play-score">
                        {Math.max(0, Math.min(99, playScore))}
                    </div>
                </div>

                {/* Center: Weather icon (like player photo) */}
                <div className="fut-card__photo">
                    <img
                        src={weatherIcon}
                        alt={weather}
                        className="fut-card__weather-icon"
                        referrerPolicy="no-referrer"
                    />
                </div>

                {/* City name (like player name) */}
                <Link to={`/city/${id}`} className="fut-card__name">
                    {name?.toUpperCase()}
                </Link>

                {/* Stats section */}
                <div className="fut-card__stats">
                    <div className="fut-card__stat-col">
                        <div className="fut-card__stat">
                            <span className="fut-card__stat-value">{Math.round(wind)}</span>
                            <span className="fut-card__stat-label">VIE</span>
                        </div>
                        <div className="fut-card__stat">
                            <span className="fut-card__stat-value">{humidity}</span>
                            <span className="fut-card__stat-label">HUM</span>
                        </div>
                        <div className="fut-card__stat">
                            <span className="fut-card__stat-value">{min}°</span>
                            <span className="fut-card__stat-label">MIN</span>
                        </div>
                    </div>
                    <div className="fut-card__stat-col">
                        <div className="fut-card__stat">
                            <span className="fut-card__stat-value">{feels}°</span>
                            <span className="fut-card__stat-label">SEN</span>
                        </div>
                        <div className="fut-card__stat">
                            <span className="fut-card__stat-value">{clouds}</span>
                            <span className="fut-card__stat-label">NUB</span>
                        </div>
                        <div className="fut-card__stat">
                            <span className="fut-card__stat-value">{max}°</span>
                            <span className="fut-card__stat-label">MAX</span>
                        </div>
                    </div>
                </div>

                {/* Bottom: Flag + Condition */}
                <div className="fut-card__bottom">
                    <span className="fut-card__flag">{flag}</span>
                    <span className="fut-card__condition">{weather}</span>
                </div>

            </div>

            {/* Card shine effect */}
            <div className="fut-card__shine"></div>
        </div>
    );
}

export default FUTCard;
