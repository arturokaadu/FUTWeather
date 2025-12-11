/**
 * =====================================================
 * WEATHER UTILITIES - Argentine Football Edition
 * =====================================================
 * 
 * This file contains helper functions that analyze weather data
 * and return useful information for our special features:
 * 
 * 1. Activity suggestions ("Clima del Hincha")
 * 2. Soccer playability score ("Clima de Cancha")
 * 3. Color/mood based on conditions
 * 
 * All the "magic" logic lives here so our components stay clean!
 */

// =====================================================
// ACTIVITY SUGGESTIONS - "Clima del Hincha"
// =====================================================

/**
 * getClimaDelHincha - Returns activity suggestions based on weather
 * 
 * How it works:
 * - Takes the weather data (temp, weather type, wind, etc.)
 * - Returns an object with:
 *   - primaryActivity: Main thing to do today
 *   - emoji: Visual icon
 *   - message: Fun Argentine-style message
 *   - activities: List of all good activities for this weather
 * 
 * @param {Object} weatherData - The city weather object from OpenWeatherMap
 * @returns {Object} Activity suggestion object
 */
export function getClimaDelHincha(weatherData) {
    // Destructure the data we need (fancy way of saying "grab these values")
    const { temp, weather, wind, clouds } = weatherData;

    // Convert weather to lowercase for easier comparison
    const weatherType = weather?.toLowerCase() || '';

    // -----------------------------------------------
    // DECISION LOGIC: What should we suggest?
    // -----------------------------------------------

    // RAINY WEATHER - Stay inside!
    if (weatherType.includes('rain') || weatherType.includes('drizzle') || weatherType.includes('thunderstorm')) {
        return {
            primaryActivity: 'Día de quedarse viendo fútbol',
            emoji: '📺⚽',
            message: 'Hoy no sale el picado. Mejor ponete a ver un partidito.',
            mood: 'cozy',
            activities: [
                { name: 'Ver fútbol', emoji: '📺' },
                { name: 'Mate y facturas', emoji: '🧉' },
                { name: 'Siesta obligatoria', emoji: '😴' }
            ]
        };
    }

    // VERY WINDY - Not great for soccer
    if (wind > 30) {
        return {
            primaryActivity: 'Viento para cometas, no para picado',
            emoji: '🌪️',
            message: 'Con este viento la pelota vuela para cualquier lado.',
            mood: 'windy',
            activities: [
                { name: 'Remontar barrilete', emoji: '🪁' },
                { name: 'Quedarse adentro', emoji: '🏠' },
                { name: 'Mate calentito', emoji: '🧉' }
            ]
        };
    }

    // TOO HOT - Siesta time!
    if (temp > 32) {
        return {
            primaryActivity: 'Día de pileta o siesta',
            emoji: '🏊‍♂️😴',
            message: 'Mucho calor para correr. Esperá que baje el sol.',
            mood: 'hot',
            activities: [
                { name: 'Pileta', emoji: '🏊‍♂️' },
                { name: 'Helado', emoji: '🍦' },
                { name: 'Siesta hasta las 6', emoji: '😴' },
                { name: 'Picado a las 7pm', emoji: '⚽' }
            ]
        };
    }

    // TOO COLD - Bundle up!
    if (temp < 8) {
        return {
            primaryActivity: 'Día de asado y mate',
            emoji: '🥩🧉',
            message: 'Hace un frío bárbaro. Dale al asado y al mate.',
            mood: 'cold',
            activities: [
                { name: 'Asado', emoji: '🥩' },
                { name: 'Mate', emoji: '🧉' },
                { name: 'Fútbol de salón', emoji: '🏟️' }
            ]
        };
    }

    // PERFECT WEATHER FOR ASADO (18-28°C, not rainy, low wind)
    if (temp >= 18 && temp <= 28 && wind < 20 && !weatherType.includes('rain')) {
        // Is it PERFECT for soccer too?
        if (temp >= 15 && temp <= 25 && wind < 15) {
            return {
                primaryActivity: '¡Perfecta para un picado!',
                emoji: '⚽🔥',
                message: 'Dale que el clima está joya. Juntá a los pibes.',
                mood: 'perfect',
                activities: [
                    { name: 'Picado en la plaza', emoji: '⚽' },
                    { name: 'Asado después', emoji: '🥩' },
                    { name: 'Mate en la vereda', emoji: '🧉' },
                    { name: 'Bici', emoji: '🚴' }
                ]
            };
        }

        // Good for asado
        return {
            primaryActivity: 'Clima para asado',
            emoji: '🥩🔥',
            message: 'Día perfecto para prender el fueguito.',
            mood: 'great',
            activities: [
                { name: 'Asado', emoji: '🥩' },
                { name: 'Mate en la vereda', emoji: '🧉' },
                { name: 'Picado suave', emoji: '⚽' },
                { name: 'Paseo', emoji: '🚶' }
            ]
        };
    }

    // MILD/CLOUDY - Good for outdoor activities
    if (temp >= 12 && temp <= 22) {
        return {
            primaryActivity: 'Mate en la vereda',
            emoji: '🧉☀️',
            message: 'Buen clima para estar afuera sin morirse de calor.',
            mood: 'pleasant',
            activities: [
                { name: 'Mate en la vereda', emoji: '🧉' },
                { name: 'Caminata', emoji: '🚶' },
                { name: 'Picado tranqui', emoji: '⚽' }
            ]
        };
    }

    // DEFAULT - Decent weather
    return {
        primaryActivity: 'Día para salir',
        emoji: '🌤️',
        message: 'El clima está pasable. Aprovechá.',
        mood: 'neutral',
        activities: [
            { name: 'Paseo', emoji: '🚶' },
            { name: 'Mate', emoji: '🧉' }
        ]
    };
}

// =====================================================
// PLAYABILITY SCORE - "Clima de Cancha"
// =====================================================

/**
 * getClimaDeCancha - Calculates soccer playability score
 * 
 * How it works:
 * - Starts with 100 points (perfect score)
 * - Subtracts points for bad conditions:
 *   - Rain: -30 to -50 points
 *   - High wind: -5 to -30 points
 *   - Extreme temperatures: -10 to -30 points
 *   - Too cloudy (wet grass): -5 to -10 points
 * 
 * @param {Object} weatherData - The city weather object
 * @returns {Object} Playability analysis
 */
export function getClimaDeCancha(weatherData) {
    const { temp, weather, wind, clouds } = weatherData;
    const weatherType = weather?.toLowerCase() || '';

    // Start with perfect score
    let score = 100;
    let factors = []; // Track what's affecting the score

    // -----------------------------------------------
    // FACTOR 1: RAIN (biggest impact!)
    // -----------------------------------------------
    if (weatherType.includes('thunderstorm')) {
        score -= 50;
        factors.push({ factor: 'Tormenta', impact: -50, emoji: '⛈️', description: 'Peligroso jugar' });
    } else if (weatherType.includes('rain')) {
        score -= 35;
        factors.push({ factor: 'Lluvia', impact: -35, emoji: '🌧️', description: 'Cancha embarrada' });
    } else if (weatherType.includes('drizzle')) {
        score -= 20;
        factors.push({ factor: 'Llovizna', impact: -20, emoji: '🌦️', description: 'Pasto mojado' });
    }

    // -----------------------------------------------
    // FACTOR 2: WIND (affects ball flight)
    // -----------------------------------------------
    if (wind > 40) {
        score -= 30;
        factors.push({ factor: 'Viento fuerte', impact: -30, emoji: '🌪️', description: 'La pelota vuela' });
    } else if (wind > 25) {
        score -= 15;
        factors.push({ factor: 'Viento moderado', impact: -15, emoji: '💨', description: 'Centros complicados' });
    } else if (wind > 15) {
        score -= 5;
        factors.push({ factor: 'Algo de viento', impact: -5, emoji: '🍃', description: 'Manejable' });
    }

    // -----------------------------------------------
    // FACTOR 3: TEMPERATURE (comfort level)
    // -----------------------------------------------
    if (temp > 35) {
        score -= 30;
        factors.push({ factor: 'Calor extremo', impact: -30, emoji: '🥵', description: 'Riesgo de golpe de calor' });
    } else if (temp > 30) {
        score -= 15;
        factors.push({ factor: 'Mucho calor', impact: -15, emoji: '☀️', description: 'Llevá mucha agua' });
    } else if (temp < 5) {
        score -= 25;
        factors.push({ factor: 'Muy frío', impact: -25, emoji: '🥶', description: 'Riesgo de lesiones' });
    } else if (temp < 10) {
        score -= 10;
        factors.push({ factor: 'Frío', impact: -10, emoji: '❄️', description: 'Entrada en calor larga' });
    }

    // -----------------------------------------------
    // FACTOR 4: CLOUDS (wet grass estimate)
    // -----------------------------------------------
    // Note: Clouds alone don't affect much, but combined with
    // recent conditions, very cloudy = potentially wet grass
    if (clouds > 90) {
        score -= 5;
        factors.push({ factor: 'Muy nublado', impact: -5, emoji: '☁️', description: 'Pasto posiblemente húmedo' });
    }

    // -----------------------------------------------
    // BONUS: Perfect conditions!
    // -----------------------------------------------
    if (factors.length === 0) {
        factors.push({ factor: '¡Condiciones perfectas!', impact: 0, emoji: '✨', description: 'Dale que va' });
    }

    // Make sure score doesn't go below 0
    score = Math.max(0, score);

    // Determine the overall rating
    let rating, ratingEmoji, ratingColor;
    if (score >= 80) {
        rating = '¡A jugar!';
        ratingEmoji = '⚽🔥';
        ratingColor = '#4ade80'; // Green
    } else if (score >= 60) {
        rating = 'Se puede jugar';
        ratingEmoji = '⚽👍';
        ratingColor = '#facc15'; // Yellow
    } else if (score >= 40) {
        rating = 'Complicado';
        ratingEmoji = '⚽😬';
        ratingColor = '#fb923c'; // Orange
    } else {
        rating = 'Mejor otro día';
        ratingEmoji = '⚽❌';
        ratingColor = '#f87171'; // Red
    }

    return {
        score,
        rating,
        ratingEmoji,
        ratingColor,
        factors
    };
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * getMoodGradient - Returns a CSS gradient based on weather mood
 * 
 * Used to style components with colors that match the weather vibe
 * 
 * @param {string} mood - The mood from getClimaDelHincha
 * @returns {string} CSS gradient string
 */
export function getMoodGradient(mood) {
    const gradients = {
        perfect: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', // Vibrant green
        great: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',   // Lime
        pleasant: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', // Cyan
        hot: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',      // Orange
        cold: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',     // Blue
        cozy: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',     // Purple
        windy: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',    // Slate
        neutral: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'   // Gray
    };

    return gradients[mood] || gradients.neutral;
}

/**
 * formatTemperature - Adds some flair to temperature display
 * 
 * @param {number} temp - Temperature in Celsius
 * @returns {string} Formatted temperature with description
 */
export function formatTemperature(temp) {
    if (temp > 35) return `${temp}°C 🔥`;
    if (temp > 28) return `${temp}°C ☀️`;
    if (temp > 20) return `${temp}°C 😎`;
    if (temp > 12) return `${temp}°C 🌤️`;
    if (temp > 5) return `${temp}°C 🧥`;
    return `${temp}°C 🥶`;
}
