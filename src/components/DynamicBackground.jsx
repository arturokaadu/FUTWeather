/**
 * =====================================================
 * DYNAMIC BACKGROUND - Changes with Weather!
 * =====================================================
 * 
 * This component creates a fullscreen animated gradient
 * background that changes based on the current weather.
 * 
 * WHY GRADIENTS INSTEAD OF IMAGES?
 * - Faster loading (no image downloads)
 * - Smooth transitions between weather states
 * - Works on any screen size
 * - Modern, premium look
 * 
 * WEATHER → GRADIENT MAPPING:
 * - Clear/Sunny: Warm yellow/orange gradient
 * - Cloudy: Gray/blue gradient
 * - Rainy: Dark blue/purple gradient
 * - Thunderstorm: Dark purple/red gradient
 * - Snow: White/light blue gradient
 * - Night: Dark blue/black gradient
 */

import React from 'react';
import './DynamicBackground.css';

/**
 * Maps weather conditions to gradient themes
 * Each theme has:
 * - colors: Array of gradient colors
 * - animation: CSS animation name for extra effects
 */
/**
 * Maps weather conditions to background images
 * Images sourced from Unsplash (Premium Quality)
 */
const weatherImages = {
    // SUNNY / CLEAR SKY - "Cinematic Low Angle Ball on Grass"
    clear: {
        url: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=2070&auto=format&fit=crop',
        className: 'bg--sunny'
    },

    // CLOUDS - "Moody Dark Stadium POV"
    clouds: {
        url: 'https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=2070&auto=format&fit=crop',
        className: 'bg--cloudy'
    },

    // RAIN - "Rainy Window (Reliable)"
    rain: {
        url: 'https://images.unsplash.com/photo-1486016006115-74a41448aea2?q=80&w=2067&auto=format&fit=crop',
        className: 'bg--rainy'
    },

    // SNOW - "Winter Forest/Field (Stable)"
    snow: {
        url: 'https://images.unsplash.com/photo-1477601263568-180e2c6d046e?q=80&w=2070&auto=format&fit=crop',
        className: 'bg--snow'
    },

    // EXTREME COLD - "Ice Texture (Stable)"
    cold: {
        url: 'https://images.unsplash.com/photo-1486286701208-1d58e9338013?q=80&w=2070&auto=format&fit=crop',
        className: 'bg--cold'
    },

    // THUNDERSTORM - "Stormy Dark Sky Stadium"
    thunderstorm: {
        url: 'https://images.unsplash.com/photo-1504305754058-2908c1a8f917?q=80&w=2070&auto=format&fit=crop',
        className: 'bg--storm'
    },

    // NIGHT - "Stadium Light Flare Cinematic"
    night: {
        url: 'https://images.unsplash.com/photo-1434648957308-5e6a859697e8?q=80&w=2074&auto=format&fit=crop',
        className: 'bg--night'
    },

    // DEFAULT
    default: {
        url: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c30a?q=80&w=2074&auto=format&fit=crop',
        className: 'bg--default'
    }
};

/**
 * Get the background theme
 */
function getBackgroundTheme(weatherType, icon, temp) {
    const weather = weatherType?.toLowerCase() || '';
    const isNight = icon?.includes('n');
    const temperature = Number(temp); // Ensure number type

    // 1. PRECIPITATION CHECKS (Highest Priority)
    // If it's snowing, raining or storming, visual element is key
    if (weather.includes('thunder')) return weatherImages.thunderstorm;
    if (weather.includes('rain') || weather.includes('drizzle')) return weatherImages.rain;
    if (weather.includes('snow')) return weatherImages.snow;

    // 2. EXTREME TEMPERATURES (Override Day/Night if extreme)
    // COLD (< 5°C) - Uses dedicated ICE/SNOW BALL image
    if (temperature <= 5) {
        return weatherImages.cold;
    }

    // HEAT (> 30°C)
    if (temperature >= 30) {
        return {
            ...weatherImages.clear,
            className: 'bg--heat'
        };
    }

    // 3. NIGHT CHECK (Standard temps)
    // Only if clear/cloudy and NOT extreme temp
    if (isNight && (weather === 'clear' || weather === 'clouds')) {
        return weatherImages.night;
    }

    // 4. STANDARD WEATHER (Daytime, Moderate Temp)
    if (weather.includes('cloud') || weather.includes('mist')) return weatherImages.clouds;
    if (weather === 'clear') return weatherImages.clear;

    return weatherImages.default;
}

/**
 * DynamicBackground Component
 */
function DynamicBackground({ weatherType, icon, temp, children }) {
    const theme = getBackgroundTheme(weatherType, icon, temp);

    return (
        <div
            className={`dynamic-bg ${theme.className}`}
            style={{ backgroundImage: `url(${theme.url})` }}
        >
            {/* Dark overlay for text readability */}
            <div className="dynamic-bg__overlay"></div>

            {/* Weather effects */}
            {theme.className === 'bg--rainy' && <RainEffect />}
            {theme.className === 'bg--snow' && <SnowEffect />}

            {/* Heat Effect */}
            {(theme.className === 'bg--heat' || (Number(temp) >= 30 && !icon?.includes('n'))) && <HeatEffect />}

            {theme.className === 'bg--sunny' && <SunEffect />}

            {/* Cold Effect always if temp <= 5 or manually triggered by theme */}
            {(theme.className === 'bg--cold' || Number(temp) <= 5) && <ColdEffect />}

            {/* App content */}
            <div className="dynamic-bg__content">
                {children}
            </div>
        </div>
    );
}

/**
 * HeatEffect - Distortion/Haze
 */
function HeatEffect() {
    return <div className="heat-effect"></div>;
}

/**
 * SunEffect - Lens flare / Brightness
 */
function SunEffect() {
    return <div className="sun-effect"></div>;
}

/**
 * ColdEffect - Frozen Frost Overlay
 */
function ColdEffect() {
    return <div className="cold-effect"></div>;
}

/**
 * RainEffect - Animated rain drops overlay
 */
function RainEffect() {
    // Create multiple rain drops
    const drops = Array.from({ length: 50 }, (_, i) => i);

    return (
        <div className="rain-effect">
            {drops.map((drop) => (
                <div
                    key={drop}
                    className="rain-drop"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${0.5 + Math.random() * 0.5}s`
                    }}
                />
            ))}
        </div>
    );
}

/**
 * SnowEffect - Animated snowflakes overlay
 */
function SnowEffect() {
    const flakes = Array.from({ length: 30 }, (_, i) => i);

    return (
        <div className="snow-effect">
            {flakes.map((flake) => (
                <div
                    key={flake}
                    className="snowflake"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${3 + Math.random() * 4}s`,
                        fontSize: `${8 + Math.random() * 12}px`
                    }}
                >
                    ❄
                </div>
            ))}
        </div>
    );
}

export default DynamicBackground;
