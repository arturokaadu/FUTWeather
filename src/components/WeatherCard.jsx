
import React, { useEffect, useState } from 'react';
import './WeatherCard.css';

export default function WeatherCard({
    name,
    temp,
    weather,
    wind,
    humidity,
    img,
    timezone,
    onClose,
    forecast,
    isLocal
}) {
    const [localTime, setLocalTime] = useState('');

    // Calculate local time based on timezone offset
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            // timezone is in seconds, getTimezoneOffset is in minutes (and inverted)
            // We want: UTC time + timezone offset
            const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            const cityTime = new Date(utc + (timezone * 1000));

            setLocalTime(cityTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }));
        };

        updateTime();
        const interval = setInterval(updateTime, 1000 * 60); // Update every minute
        return () => clearInterval(interval);
    }, [timezone]);

    return (
        <div className="weather-card animate-pop-in">
            {!isLocal && (
                <button className="weather-card__close" onClick={onClose}>
                    ×
                </button>
            )}

            <div className="weather-card__header">
                <div className="weather-card__location">
                    <h3>{name}</h3>
                    <span className="weather-card__time">{localTime}</span>
                </div>
                <div className="weather-card__icon">
                    <img
                        src={`https://openweathermap.org/img/wn/${img}@2x.png`}
                        alt={weather}
                    />
                </div>
            </div>

            <div className="weather-card__main">
                <h2 className="weather-card__temp">{Math.round(temp)}°</h2>
                <p className="weather-card__desc">{weather}</p>
            </div>

            <div className="weather-card__details">
                <div className="detail">
                    <span className="detail__label">Humedad</span>
                    <span className="detail__value">{humidity}%</span>
                </div>
                <div className="detail">
                    <span className="detail__label">Viento</span>
                    <span className="detail__value">{wind} km/h</span>
                </div>
            </div>

            {forecast && forecast.length > 0 && (
                <div className="weather-card__forecast">
                    <h4>Próximos 3 días</h4>
                    <div className="forecast-list">
                        {forecast.map((day, index) => (
                            <div key={index} className="forecast-item">
                                <span className="forecast-day">{day.dayName}</span>
                                <img
                                    src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                                    alt={day.weather}
                                />
                                <span className="forecast-temp">{day.min}° / {day.max}°</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
