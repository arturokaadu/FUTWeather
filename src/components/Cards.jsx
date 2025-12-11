/**
 * =====================================================
 * CARDS CONTAINER - Now with FUT Cards!
 * =====================================================
 */

import React from 'react';
import './Cards.css';
import WeatherCard from './WeatherCard.jsx';

export default function Cards({ cities, onClose, currentLocation, forecastData }) {
  // Show message when no cities AND no current location
  if (cities.length === 0 && !currentLocation) {
    return null;
  }

  return (
    <div className="cards">
      {/* LOCAL WEATHER CARD (PINNED) */}
      {currentLocation && (
        <div className="cards__pinned">
          <h3 className="cards__pinned-title">📍 Tu Ubicación</h3>
          <WeatherCard
            key="local"
            id={currentLocation.id}
            name={currentLocation.name}
            temp={currentLocation.temp}
            min={currentLocation.min}
            max={currentLocation.max}
            weather={currentLocation.weather}
            wind={currentLocation.wind}
            clouds={currentLocation.clouds}
            humidity={currentLocation.humidity}
            img={currentLocation.img}
            timezone={currentLocation.timezone}
            forecast={forecastData?.[currentLocation.id]?.daily}
            onClose={() => { }}
            isLocal={true}
          />
        </div>
      )}

      {cities.map((c) => (
        <WeatherCard
          key={c.id}
          id={c.id}
          name={c.name}
          temp={c.temp}
          min={c.min}
          max={c.max}
          weather={c.weather}
          wind={c.wind}
          clouds={c.clouds}
          humidity={c.humidity}
          img={c.img}
          timezone={c.timezone}
          forecast={forecastData?.[c.id]?.daily}
          onClose={() => onClose(c.id)}
        />
      ))}
    </div>
  );
}
