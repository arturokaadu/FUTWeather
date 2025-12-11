/**
 * =====================================================
 * NEXT MATCH COMPONENT
 * =====================================================
 * 
 * Shows a team's next match as a FUT-style card
 * with weather info for the stadium location.
 */

import React, { useEffect, useState, useRef } from 'react';
import { getDemoFixture, getNextFixture, isApiConfigured } from '../services/footballApi';
import './NextMatch.css';

// OpenWeatherMap API key (same as main app)
const WEATHER_API_KEY = 'b32216f8417048478f9126d87e0fb170';

function NextMatch({ team, onWeatherReceived }) {
    const [fixture, setFixture] = useState(null);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Use ref to avoid useEffect dependency issues
    const onWeatherReceivedRef = useRef(onWeatherReceived);
    onWeatherReceivedRef.current = onWeatherReceived;

    useEffect(() => {
        if (!team) return;

        async function loadFixtureAndWeather() {
            setLoading(true);
            setError(null);

            try {
                // Get next fixture
                let fixtureData;
                if (isApiConfigured()) {
                    fixtureData = await getNextFixture(team.id);
                } else {
                    // Demo mode - synchronous
                    fixtureData = getDemoFixture(team);
                }

                console.log('Fixture data:', fixtureData);

                if (!fixtureData) {
                    setError('No hay próximo partido programado');
                    setLoading(false);
                    return;
                }

                setFixture(fixtureData);

                // Get weather for venue city
                const venueCity = fixtureData.venue?.city || team.venue?.city;
                console.log('Venue city:', venueCity);

                if (venueCity) {
                    const weatherResponse = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?q=${venueCity}&appid=${WEATHER_API_KEY}&units=metric`
                    );
                    const weatherData = await weatherResponse.json();
                    console.log('Weather data:', weatherData);

                    if (weatherData.main) {
                        const processedWeather = {
                            temp: Math.round(weatherData.main.temp),
                            feels: Math.round(weatherData.main.feels_like),
                            weather: weatherData.weather[0].main,
                            icon: weatherData.weather[0].icon,
                            wind: weatherData.wind.speed,
                            humidity: weatherData.main.humidity,
                            city: venueCity
                        };
                        setWeather(processedWeather);

                        // Notify parent about weather for background
                        if (onWeatherReceivedRef.current) {
                            onWeatherReceivedRef.current(processedWeather);
                        }
                    }
                }

                setLoading(false);
            } catch (err) {
                console.error('Error loading match data:', err);
                setError('Error cargando datos del partido');
                setLoading(false);
            }
        }

        loadFixtureAndWeather();
    }, [team]); // Only depend on team, not onWeatherReceived

    // Format date in Spanish
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('es-AR', options);
    }

    // Get card tier based on weather
    function getCardTier() {
        if (!weather) return 'gold';
        if (weather.temp >= 20 && weather.weather === 'Clear') return 'gold';
        if (weather.temp >= 10) return 'silver';
        return 'bronze';
    }

    if (!team) return null;

    if (loading) {
        return (
            <div className="next-match next-match--loading">
                <div className="next-match__loader">⚽</div>
                <p>Buscando próximo partido...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="next-match next-match--error">
                <p>{error}</p>
            </div>
        );
    }

    const tier = getCardTier();

    return (
        <div className={`next-match next-match--${tier}`}>
            {/* Match header */}
            <div className="next-match__header">
                <span className="next-match__league">{fixture?.league?.name}</span>
                <span className="next-match__round">{fixture?.league?.round}</span>
            </div>

            {/* Teams vs */}
            <div className="next-match__teams">
                <div className="next-match__team">
                    <img src={fixture?.home?.logo} alt={fixture?.home?.name} className="next-match__logo" />
                    <span className="next-match__team-name">{fixture?.home?.name}</span>
                </div>

                <div className="next-match__vs">VS</div>

                <div className="next-match__team">
                    <img src={fixture?.away?.logo} alt={fixture?.away?.name} className="next-match__logo" />
                    <span className="next-match__team-name">{fixture?.away?.name}</span>
                </div>
            </div>

            {/* Date and venue */}
            <div className="next-match__info">
                <div className="next-match__date">
                    📅 {formatDate(fixture?.date)}
                </div>
                <div className="next-match__venue">
                    🏟️ {fixture?.venue?.name}
                </div>
            </div>

            {/* Weather section */}
            {weather && (
                <div className="next-match__weather">
                    <div className="next-match__weather-main">
                        <img
                            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                            alt={weather.weather}
                            className="next-match__weather-icon"
                        />
                        <span className="next-match__temp">{weather.temp}°C</span>
                    </div>

                    <div className="next-match__weather-details">
                        <span>💨 {weather.wind} km/h</span>
                        <span>💧 {weather.humidity}%</span>
                        <span>🌡️ ST {weather.feels}°</span>
                    </div>

                    <div className="next-match__weather-city">
                        📍 {weather.city}
                    </div>
                </div>
            )}

            {/* Close button */}
            <button
                className="next-match__close"
                onClick={() => window.location.reload()}
                aria-label="Buscar otro equipo"
            >
                × Buscar otro
            </button>
        </div>
    );
}

export default NextMatch;
