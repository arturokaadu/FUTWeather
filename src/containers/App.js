/**
 * =====================================================
 * MAIN APP COMPONENT - Updated with Dynamic Background
 * =====================================================
 * 
 * CHANGES:
 * - Added DynamicBackground component wrapper
 * - Track current weather for background changes
 * - Background changes when you search a city!
 * - NEW: Football page for team search!
 */

import React, { useState, useCallback } from "react";
import "./App.css";

// Import components
import Nav from "../components/Nav.jsx";
import Cards from "../components/Cards.jsx";
import { Route } from "react-router-dom";
import City from "../components/City";
import DynamicBackground from "../components/DynamicBackground";
import Football from "../components/Football";
import MatchesByWeather from "../components/MatchesByWeather";
import WeatherCard from "../components/WeatherCard";

// Your OpenWeatherMap API key
const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

function App() {
  // State: List of cities
  const [cities, setCities] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null); // Local weather

  // State: Forecast data for hourly timeline
  const [forecastData, setForecastData] = useState({});

  // NEW: Track current weather for background
  const [currentWeather, setCurrentWeather] = useState({
    type: 'clear',
    icon: '01d',
    temp: 20
  });

  // Load User Location on Mount
  React.useEffect(() => {
    if (navigator.geolocation) {
      // Timeout 5s
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (err) => {
          console.log("Geolocation denied or timeout:", err);
          // Default location: Buenos Aires
          fetchWeatherByCoords(-34.6037, -58.3816);
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    } else {
      // Default location if no geolocation support
      fetchWeatherByCoords(-34.6037, -58.3816);
    }
  }, []);

  function fetchWeatherByCoords(lat, lon) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    )
      .then((r) => r.json())
      .then((recurso) => {
        if (recurso.main !== undefined) {
          const ciudad = {
            min: Math.round(recurso.main.temp_min),
            max: Math.round(recurso.main.temp_max),
            img: recurso.weather[0].icon,
            id: recurso.id,
            wind: recurso.wind.speed,
            temp: recurso.main.temp,
            feels: Math.round(recurso.main.feels_like),
            name: recurso.name,
            weather: recurso.weather[0].main,
            clouds: recurso.clouds.all,
            humidity: recurso.main.humidity,
            latitud: recurso.coord.lat,
            longitud: recurso.coord.lon,
            timezone: recurso.timezone, // Timezone offset in seconds
            isLocal: true // Flag to identify local weather
          };

          // Set as current location (pinned)
          setCurrentLocation(ciudad);

          // Also set background immediately
          setCurrentWeather({
            type: recurso.weather[0].main,
            icon: recurso.weather[0].icon,
            temp: recurso.main.temp
          });

          // Fetch forecast
          fetchForecast(recurso.id, lat, lon);
        }
      });
  }

  // Remove a city from the list
  function onClose(id) {
    setCities((oldCities) => oldCities.filter((c) => c.id !== id));
  }

  // Search for a city and add it
  function onSearch(ciudad) {
    console.log("App.onSearch called with:", ciudad);
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric`
    )
      .then((r) => r.json())
      .then((recurso) => {
        if (recurso.main !== undefined) {
          const ciudad = {
            min: Math.round(recurso.main.temp_min),
            max: Math.round(recurso.main.temp_max),
            img: recurso.weather[0].icon,
            id: recurso.id,
            wind: recurso.wind.speed,
            temp: recurso.main.temp,
            feels: Math.round(recurso.main.feels_like),
            name: recurso.name,
            weather: recurso.weather[0].main,
            clouds: recurso.clouds.all,
            humidity: recurso.main.humidity,
            latitud: recurso.coord.lat,
            longitud: recurso.coord.lon,
            timezone: recurso.timezone,
          };

          setCities([ciudad]); // Replace previous search with new one

          // UPDATE BACKGROUND when searching!
          setCurrentWeather({
            type: recurso.weather[0].main,
            icon: recurso.weather[0].icon,
            temp: recurso.main.temp
          });

          // Fetch forecast for this city
          fetchForecast(recurso.id, recurso.coord.lat, recurso.coord.lon);
        } else {
          console.warn("City not found in API:", ciudad);
          alert("Ciudad no encontrada");
        }
      });
  }

  // Fetch 5-day forecast and process for 3-day view
  function fetchForecast(cityId, lat, lon) {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.list) {
          // Group by day to get min/max and representative icon
          const dailyMap = new Map();

          data.list.forEach((item) => {
            // Get date string YYYY-MM-DD to group
            const dateObj = new Date(item.dt * 1000);
            const dateStr = dateObj.toISOString().split('T')[0];

            if (!dailyMap.has(dateStr)) {
              dailyMap.set(dateStr, {
                min: item.main.temp_min,
                max: item.main.temp_max,
                icon: item.weather[0].icon, // Default to first available
                weather: item.weather[0].description,
                date: dateObj
              });
            } else {
              const current = dailyMap.get(dateStr);
              current.min = Math.min(current.min, item.main.temp_min);
              current.max = Math.max(current.max, item.main.temp_max);

              // Prefer icon from around noon (12:00)
              const hour = dateObj.getHours();
              if (hour >= 11 && hour <= 14) {
                current.icon = item.weather[0].icon;
                current.weather = item.weather[0].description;
              }
            }
          });

          // Convert to array, skip today (index 0) if we want "next 3 days", 
          // but sometimes API returns today as part of list. 
          // Let's show the next 3 entries from the map (excluding current if it's partial? No, just slice 1-4)
          // Actually, let's just take values and slice.
          const dailyList = Array.from(dailyMap.values()).map(d => ({
            dayName: d.date.toLocaleDateString('es-ES', { weekday: 'long' }),
            min: Math.round(d.min),
            max: Math.round(d.max),
            icon: d.icon,
            weather: d.weather
          }));

          // If we have today's data fully or partially, we might want to skip it to show "Future"
          // We'll take slice(1, 4) to get tomorrow, day after, etc.
          const next3Days = dailyList.slice(1, 4);

          // Also keep the hourly for the detail view (original logic)
          // We can store both or just this. 
          // The City detail view uses hourly timeline. 
          // We'll store both formats in a cleaner way if needed, but for now let's overload forecastData
          // OR create a separate state?
          // Existing City view uses `forecastData[cityId]` as the list of hours.
          // I shouldn't break that.
          // Helper: Let's store an object { hourly: ..., daily: ... }
          // But that would break existing code in City.jsx and everywhere.

          // Let's add a NEW state for dailyForecast or modify how we store it.
          // Given the user wants to FIX everything, I should ideally refactor.
          // But to avoid breaking City.jsx too much, I will use a new property `dailyForecastData`?
          // Or I'll attach it to the city object?
          // Attaching to city object in `cities` state is hard because this is async.

          // I will use `setForecastData` to store the *Original* processed hourly data (for City view)
          // AND I will add a `setDailyForecastData` state?
          // Or just update `forecastData` to contain `{ hourly: [...], daily: [...] }` and update City.jsx to read `.hourly`.

          // For least breakage with unknown City.jsx internals (I read it? No, I haven't read City.jsx fully, only listed it. I read Nav, SearchBar, Cards, App):
          // I'll stick to a separate state or just hack it.
          // Let's modify the processed data for `forecastData` to be the hourly (first 8) as before, 
          // BUT I also need the daily for the Card.

          // Let's use `setForecastData` to store `{ hourly: ..., daily: ... }`.
          // And I will update City.jsx if needed.

          const hourlyProcessed = data.list.slice(0, 8).map((item) => {
            const date = new Date(item.dt * 1000);
            const hour = date.getHours();
            const isPicadoTime = hour >= 17 && hour <= 20;

            return {
              hour: `${hour}:00`,
              temp: Math.round(item.main.temp),
              icon: item.weather[0].icon,
              isPicadoTime: isPicadoTime,
            };
          });

          setForecastData((prev) => ({
            ...prev,
            [cityId]: {
              hourly: hourlyProcessed,
              daily: next3Days
            }
          }));
        }
      })
      .catch((error) => {
        console.log("Error fetching forecast:", error);
      });
  }

  // Filter cities by ID
  function onFilter(ciudadId) {
    let ciudad = cities.filter((c) => c.id === parseInt(ciudadId));
    if (ciudad.length > 0) {
      return ciudad[0];
    } else {
      return null;
    }
  }

  // UPDATE BACKGROUND when viewing city detail
  function updateBackground(city) {
    if (city) {
      setCurrentWeather({
        type: city.weather,
        icon: city.img,
        temp: city.temp
      });
    }
  }


  // Handle weather change from Football page (Memoized to prevent infinite loop)
  const handleWeatherChange = React.useCallback((weather) => {
    setCurrentWeather(prev => {
      // Only update if actually different to prevent re-renders
      if (prev.type === weather.type && prev.icon === weather.icon && prev.temp === weather.temp) {
        return prev;
      }
      return weather;
    });
  }, []);

  return (
    // Wrap everything in DynamicBackground!
    <DynamicBackground
      weatherType={currentWeather.type}
      icon={currentWeather.icon}
      temp={currentWeather.temp}
    >
      <div className="App">
        {/* Pinned Local Weather Card (Always Visible) */}
        {currentLocation && (
          <div className="pinned-weather-card">
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

        {/* Navigation Bar */}
        <Route path={"/"} render={() => <Nav onSearch={onSearch} onReset={() => setCities([])} />} />

        {/* Home Page - Matches By Weather */}
        <Route
          exact
          path={"/"}
          render={() => (
            <>
              <div style={{ marginBottom: '2rem' }}>
                <Cards
                  cities={cities}
                  onClose={onClose}
                  currentLocation={null}
                  forecastData={forecastData}
                />
              </div>
              <MatchesByWeather
                onWeatherChange={handleWeatherChange}
                currentWeather={currentWeather}
              />
            </>
          )}
        />

        {/* Old Cards View available at /cities for now, or just hidden? 
            User said "la home debe ser lo que habia antes", referring to MatchesByWeather filter view.
            I will keep the old Cards view as a search result view but maybe on a different route or just remove it if redundant?
            User implies Home IS the filter view. 
        */}
        <Route
          exact
          path={"/cities"}
          render={() => <Cards
            cities={cities}
            onClose={onClose}
            currentLocation={null} // Local is now pinned separately
            forecastData={forecastData}
          />}
        />

        {/* Football Page - Team Search */}
        <Route
          exact
          path={"/futbol"}
          render={() => <Football onWeatherChange={handleWeatherChange} />}
        />

        {/* City Detail Page */}
        <Route
          path={"/city/:cityId"}
          render={({ match }) => {
            const cityId = match.params.cityId;
            const cityData = onFilter(cityId);
            const forecast = forecastData[cityId]?.hourly || []; // Access .hourly now

            // Update background when viewing this city
            if (cityData) {
              setTimeout(() => updateBackground(cityData), 0);
            }

            return (
              <City
                city={cityData}
                forecastData={forecast}
              />
            );
          }}
        />
      </div>
    </DynamicBackground>
  );
}

export default App;
