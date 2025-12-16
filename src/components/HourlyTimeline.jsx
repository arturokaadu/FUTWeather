/**
 * =====================================================
 * HOURLY TIMELINE - Temperature Graph
 * =====================================================
 * 
 * This component shows a visual timeline of temperatures
 * for the next 24 hours. It's what Reddit users request most!
 * 
 * HOW IT WORKS:
 * 1. Receives forecast data (array of hourly temps)
 * 2. Creates a simple bar chart using pure CSS (no Chart.js needed!)
 * 3. Highlights "Horario de Picado" (5pm-8pm) - best soccer time
 * 
 * WHY NO CHART.JS?
 * - Smaller bundle size
 * - No extra dependency to learn
 * - Good enough for our use case
 * - Easier to customize
 * 
 * PROPS:
 * - forecastData: Array of objects with { hour, temp, icon, isPicadoTime }
 */

import React from 'react';
import './HourlyTimeline.css';

function HourlyTimeline({ forecastData }) {
    // -----------------------------------------------
    // STEP 1: Safety check
    // -----------------------------------------------
    if (!forecastData || forecastData.length === 0) {
        return null;
    }

    // -----------------------------------------------
    // STEP 2: Find min/max temps for scaling the bars
    // -----------------------------------------------
    // We need to know the range to make bars proportional
    // Math.max/min with spread operator finds highest/lowest
    const temps = forecastData.map(item => item.temp);
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);

    // Calculate the range (add 5 to give some padding)
    const range = maxTemp - minTemp + 5;

    // -----------------------------------------------
    // STEP 3: Calculate bar height percentage
    // -----------------------------------------------
    // Each bar's height is relative to the temp range
    // Formula: ((temp - minTemp) / range) * 100
    const getBarHeight = (temp) => {
        // Minimum bar height of 20% so it's always visible
        const heightPercent = ((temp - minTemp + 2) / range) * 100;
        return Math.max(20, heightPercent);
    };

    // -----------------------------------------------
    // STEP 4: Render the timeline
    // -----------------------------------------------
    return (
        <div className="hourly-timeline">
            {/* HEADER */}
            <h3 className="hourly-timeline__title">
                📊 Próximas Horas
            </h3>

            {/* LEGEND for "Picado Time" */}
            <div className="hourly-timeline__legend">
                <span className="hourly-timeline__legend-item">
                    <span className="hourly-timeline__legend-dot hourly-timeline__legend-dot--picado"></span>
                    Horario de Picado (17-20hs)
                </span>
            </div>

            {/* THE CHART */}
            <div className="hourly-timeline__chart">
                {/* 
          Loop through each hour in the forecast
          and create a bar for it 
        */}
                {forecastData.map((item, index) => (
                    <div
                        key={index}
                        className={`hourly-timeline__bar-container ${item.isPicadoTime ? 'hourly-timeline__bar-container--picado' : ''
                            }`}
                    >
                        {/* Temperature label above the bar */}
                        <span className="hourly-timeline__temp">
                            {Math.round(item.temp)}°
                        </span>

                        {/* The actual bar */}
                        <div
                            className={`hourly-timeline__bar ${item.isPicadoTime ? 'hourly-timeline__bar--picado' : ''
                                }`}
                            style={{
                                height: `${getBarHeight(item.temp)}%`,
                                // Add animation delay for staggered effect
                                animationDelay: `${index * 0.05}s`
                            }}
                        >
                            {/* Weather icon inside the bar */}
                            <img
                                src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                                alt=""
                                className="hourly-timeline__icon"
                            />
                        </div>

                        {/* Hour label below the bar */}
                        <span className="hourly-timeline__hour">
                            {item.hour}
                        </span>
                    </div>
                ))}
            </div>

            {/* Tip message */}
            <p className="hourly-timeline__tip">
                💡 El mejor horario para jugar es entre las 17 y 20hs
            </p>
        </div>
    );
}

export default HourlyTimeline;
