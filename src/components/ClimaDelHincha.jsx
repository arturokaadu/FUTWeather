/**
 * =====================================================
 * CLIMA DEL HINCHA - Activity Suggestions Component
 * =====================================================
 * 
 * This component shows what activities are good for today's weather.
 * It has an Argentine personality with local slang and activities.
 * 
 * HOW IT WORKS:
 * 1. Receives weather data as props (from the parent City component)
 * 2. Calls getClimaDelHincha() utility to get activity suggestions
 * 3. Displays the main suggestion plus a list of other activities
 * 
 * PROPS EXPLAINED:
 * - weatherData: Object containing temp, weather, wind, clouds, etc.
 *   (This is the same "city" object we already have in App.js)
 */

import React from 'react';
// Import our utility function that does all the logic
import { getClimaDelHincha, getMoodGradient } from '../utils/weatherUtils';
import './ClimaDelHincha.css';

function ClimaDelHincha({ weatherData }) {
    // -----------------------------------------------
    // STEP 1: Check if we have data
    // -----------------------------------------------
    // If no weather data yet, show a loading state
    // (This prevents errors when component renders before data loads)
    if (!weatherData) {
        return null; // Don't render anything
    }

    // -----------------------------------------------
    // STEP 2: Get the activity suggestion
    // -----------------------------------------------
    // This calls our utility function that analyzes the weather
    // and returns appropriate activities with Argentine flavor
    const suggestion = getClimaDelHincha(weatherData);

    // Get the background gradient based on the mood
    // (e.g., "perfect" = green, "hot" = orange, "cozy" = purple)
    const backgroundGradient = getMoodGradient(suggestion.mood);

    // -----------------------------------------------
    // STEP 3: Render the component
    // -----------------------------------------------
    return (
        <div className="clima-hincha">
            {/* HEADER: Shows the section title */}
            <h3 className="clima-hincha__title">
                🇦🇷 Clima del Hincha
            </h3>

            {/* MAIN CARD: Shows the primary activity suggestion */}
            <div
                className="clima-hincha__main-card"
                style={{ background: backgroundGradient }}
            >
                {/* Big emoji for visual impact */}
                <span className="clima-hincha__emoji">{suggestion.emoji}</span>

                {/* Primary activity (the main thing to do) */}
                <h4 className="clima-hincha__activity">
                    {suggestion.primaryActivity}
                </h4>

                {/* Fun message with Argentine slang */}
                <p className="clima-hincha__message">
                    {suggestion.message}
                </p>
            </div>

            {/* ACTIVITY LIST: All suggested activities */}
            <div className="clima-hincha__activities">
                <p className="clima-hincha__activities-title">
                    Hoy es buen día para:
                </p>

                <div className="clima-hincha__activity-list">
                    {/* 
            .map() loops through each activity and creates a "chip"
            This is like a forEach but returns JSX elements
          */}
                    {suggestion.activities.map((activity, index) => (
                        <span
                            key={index} // React needs a unique key for list items
                            className="clima-hincha__activity-chip"
                        >
                            {activity.emoji} {activity.name}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Export the component so other files can import it
export default ClimaDelHincha;
