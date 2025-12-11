/**
 * =====================================================
 * WEATHER FILTER COMPONENT
 * =====================================================
 * 
 * Filter buttons for different weather conditions:
 * - Rain, Snow, Sun, Extreme Heat, Extreme Cold
 */

import React from 'react';
import './WeatherFilter.css';

// Weather condition definitions
export const WEATHER_CONDITIONS = {
    all: {
        id: 'all',
        label: '🌍 Todos',
        description: 'Todos los partidos'
    },
    rain: {
        id: 'rain',
        label: '🌧️ Lluvia',
        description: 'Partidos bajo lluvia',
        weatherTypes: ['Rain', 'Drizzle', 'Thunderstorm'],
        image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=2070&auto=format&fit=crop'
    },
    snow: {
        id: 'snow',
        label: '❄️ Nieve',
        description: 'Partidos con nieve',
        weatherTypes: ['Snow'],
        image: 'https://images.unsplash.com/photo-1477601263568-180e2c6d046e?q=80&w=2070&auto=format&fit=crop'
    },
    clear: {
        id: 'clear',
        label: '☀️ Soleado',
        description: 'Clima despejado',
        weatherTypes: ['Clear'],
        image: 'https://images.unsplash.com/photo-1622278676270-2989e1e24c0d?q=80&w=2072&auto=format&fit=crop'
    },
    clouds: {
        id: 'clouds',
        label: '☁️ Nublado',
        description: 'Cielo cubierto',
        weatherTypes: ['Clouds', 'Mist', 'Fog', 'Haze'],
        image: 'https://images.unsplash.com/photo-1594156596782-fa8205b93c00?q=80&w=2070&auto=format&fit=crop'
    },
    extreme_heat: {
        id: 'extreme_heat',
        label: '🔥 Calor Extremo',
        description: 'Más de 30°C',
        minTemp: 30,
        image: 'https://images.unsplash.com/photo-1504370805625-d32c54b16100?q=80&w=2032&auto=format&fit=crop'
    },
    extreme_cold: {
        id: 'extreme_cold',
        label: '🥶 Frío Extremo',
        description: 'Menos de 0°C',
        maxTemp: 5,
        image: 'https://images.unsplash.com/photo-1478719059408-592965723cbc?q=80&w=2012&auto=format&fit=crop'
    },
    day: {
        id: 'day',
        label: '☀️ De Día',
        description: 'Partidos de día',
        iconType: 'd',
        image: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?q=80&w=2070&auto=format&fit=crop'
    },
    night: {
        id: 'night',
        label: '🌙 De Noche',
        description: 'Partidos de noche',
        iconType: 'n',
        image: 'https://images.unsplash.com/photo-1518091043644-c715178d4a50?q=80&w=2070&auto=format&fit=crop'
    },
    live: {
        id: 'live',
        label: '🔴 En Vivo',
        description: 'Jugándose ahora',
        isLive: true,
        image: 'https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=2070&auto=format&fit=crop' // Stadium vibe
    }
};

function WeatherFilter({ activeFilter, onFilterChange, loading }) {
    // Group filters for better UI
    const timeFilters = ['all', 'live', 'day', 'night'];
    const weatherFilters = ['clear', 'clouds', 'rain', 'snow', 'extreme_heat', 'extreme_cold'];

    return (
        <div className="weather-filter">
            <h3 className="weather-filter__title">Filtrar por Clima</h3>

            {/* Time / Status Filters (Top Row) */}
            <div className="weather-filter__buttons weather-filter__buttons--primary">
                {timeFilters.map(id => {
                    const condition = WEATHER_CONDITIONS[id];
                    return (
                        <button
                            key={condition.id}
                            className={`weather-filter__btn weather-filter__btn--large ${activeFilter === condition.id ? 'weather-filter__btn--active' : ''}`}
                            onClick={() => onFilterChange(condition.id)}
                            disabled={loading}
                            title={condition.description}
                            style={condition.image ? {
                                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${condition.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                border: '2px solid rgba(255,255,255,0.5)'
                            } : {}}
                        >
                            {condition.label}
                        </button>
                    );
                })}
            </div>

            {/* Weather Condition Filters (Bottom Row) */}
            <div className="weather-filter__buttons">
                {weatherFilters.map(id => {
                    const condition = WEATHER_CONDITIONS[id];
                    return (
                        <button
                            key={condition.id}
                            className={`weather-filter__btn ${activeFilter === condition.id ? 'weather-filter__btn--active' : ''}`}
                            onClick={() => onFilterChange(condition.id)}
                            disabled={loading}
                            title={condition.description}
                        >
                            {condition.label}
                        </button>
                    );
                })}
            </div>

            {activeFilter !== 'all' && (
                <p className="weather-filter__hint">
                    {WEATHER_CONDITIONS[activeFilter]?.description}
                </p>
            )}
        </div>
    );
}

export default WeatherFilter;
