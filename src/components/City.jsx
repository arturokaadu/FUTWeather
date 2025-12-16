/**
 * =====================================================
 * CITY COMPONENT - Detailed Weather View
 * =====================================================
 * 
 * This is the page you see when you click on a city card.
 * It shows detailed weather info PLUS our three new features:
 * 
 * 1. Clima del Hincha - Activity suggestions
 * 2. Clima de Cancha - Soccer playability score  
 * 3. Hourly Timeline - Temperature graph
 * 
 * WHAT CHANGED:
 * - Imported the three new components
 * - Added them to the render below the weather info
 * - Reorganized layout to fit more content
 */

import React from "react";
import './City.css';

// Import our new feature components!
import ClimaDelHincha from "./ClimaDelHincha";
import ClimaDeCancha from "./ClimaDeCancha";
import HourlyTimeline from "./HourlyTimeline";

function City({ city, forecastData }) {
  // -----------------------------------------------
  // Handle missing city data
  // -----------------------------------------------
  if (!city) {
    return (
      <div className="cityCard cityCard--error">
        <h2>Ciudad no encontrada</h2>
        <p>Esta ciudad no está en la lista. Buscá otra!</p>
      </div>
    );
  }

  // -----------------------------------------------
  // Render the city detail page
  // -----------------------------------------------
  return (
    <div className="city-page">
      {/* MAIN WEATHER CARD */}
      <div className="cityCard">
        <div className="container">
          {/* City name and main icon */}
          <h2>{city.name}</h2>
          <img
            className="iconoClima"
            src={`https://openweathermap.org/img/wn/${city.img}@2x.png`}
            width="100"
            height="100"
            alt={city.weather}
          />

          {/* Current temperature - BIG and prominent */}
          <div className="city-temp-main">
            <span className="city-temp-value">{Math.round(city.temp)}</span>
            <span className="city-temp-unit">°C</span>
          </div>

          {/* Feels like temperature */}
          <p className="city-feels">
            Sensación térmica: {city.feels}°C
          </p>

          {/* Weather details grid */}
          <div className="info">
            <div className="info-item">
              <span className="info-label">🌡️ Clima</span>
              <span className="info-value">{city.weather}</span>
            </div>
            <div className="info-item">
              <span className="info-label">💨 Viento</span>
              <span className="info-value">{city.wind} km/h</span>
            </div>
            <div className="info-item">
              <span className="info-label">☁️ Nubes</span>
              <span className="info-value">{city.clouds}%</span>
            </div>
            <div className="info-item">
              <span className="info-label">🌡️ Min/Max</span>
              <span className="info-value">{city.min}° / {city.max}°</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== NEW FEATURES SECTION ===== */}
      <div className="city-features">
        {/* 
          FEATURE 1: Clima del Hincha
          Shows activity suggestions based on weather 
        */}
        <ClimaDelHincha weatherData={city} />

        {/* 
          FEATURE 2: Clima de Cancha
          Shows soccer playability score 
        */}
        <ClimaDeCancha weatherData={city} />

        {/* 
          FEATURE 3: Hourly Timeline
          Shows temperature graph for next hours
          (Only shows if we have forecast data)
        */}
        {forecastData && forecastData.length > 0 && (
          <HourlyTimeline forecastData={forecastData} />
        )}
      </div>

      {/* Coordinates footer */}
      <div className="city-coords">
        📍 {city.latitud}°, {city.longitud}°
      </div>
    </div>
  );
}

export default City;
