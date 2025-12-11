/**
 * =====================================================
 * CLIMA DE CANCHA - Soccer Playability Score
 * =====================================================
 * 
 * This is your UNIQUE feature! Shows how good the weather is
 * for playing soccer (or "picado" in Argentine Spanish).
 * 
 * HOW IT WORKS:
 * 1. Receives weather data from parent component
 * 2. Calls getClimaDeCancha() utility to calculate score
 * 3. Displays:
 *    - A circular score gauge (0-100)
 *    - Overall rating ("¡A jugar!", "Complicado", etc.)
 *    - Breakdown of factors affecting the score
 * 
 * THE SCORE:
 * - 80-100: Perfect conditions, go play!
 * - 60-79: Good enough, you can play
 * - 40-59: Tricky conditions, be careful
 * - 0-39: Better stay home and watch TV
 */

import React from 'react';
// Import our utility function
import { getClimaDeCancha } from '../utils/weatherUtils';
import './ClimaDeCancha.css';

function ClimaDeCancha({ weatherData }) {
    // -----------------------------------------------
    // STEP 1: Safety check - do we have data?
    // -----------------------------------------------
    if (!weatherData) {
        return null;
    }

    // -----------------------------------------------
    // STEP 2: Calculate the playability score
    // -----------------------------------------------
    // This returns: { score, rating, ratingEmoji, ratingColor, factors }
    const cancha = getClimaDeCancha(weatherData);

    // -----------------------------------------------
    // STEP 3: Calculate the gauge rotation
    // -----------------------------------------------
    // The gauge is a half-circle that fills based on score
    // 0% = -90deg (pointing left), 100% = 90deg (pointing right)
    // Formula: (score / 100) * 180 - 90
    const gaugeRotation = (cancha.score / 100) * 180 - 90;

    // -----------------------------------------------
    // STEP 4: Render the component
    // -----------------------------------------------
    return (
        <div className="clima-cancha">
            {/* HEADER */}
            <h3 className="clima-cancha__title">
                ⚽ Clima de Cancha
            </h3>

            {/* SCORE SECTION */}
            <div className="clima-cancha__score-section">
                {/* 
          CIRCULAR GAUGE
          This creates a semi-circular progress indicator
          using CSS transforms and clip-path
        */}
                <div className="clima-cancha__gauge">
                    {/* Background arc (gray) */}
                    <div className="clima-cancha__gauge-bg"></div>

                    {/* Filled arc (colored based on score) */}
                    <div
                        className="clima-cancha__gauge-fill"
                        style={{
                            // Rotate to show the score
                            transform: `rotate(${gaugeRotation}deg)`,
                            // Color matches the rating
                            backgroundColor: cancha.ratingColor
                        }}
                    ></div>

                    {/* Score number in the center */}
                    <div className="clima-cancha__score-value">
                        <span
                            className="clima-cancha__score-number"
                            style={{ color: cancha.ratingColor }}
                        >
                            {cancha.score}
                        </span>
                        <span className="clima-cancha__score-label">/ 100</span>
                    </div>
                </div>

                {/* Rating text below the gauge */}
                <div
                    className="clima-cancha__rating"
                    style={{ color: cancha.ratingColor }}
                >
                    {cancha.ratingEmoji} {cancha.rating}
                </div>
            </div>

            {/* FACTORS BREAKDOWN */}
            <div className="clima-cancha__factors">
                <p className="clima-cancha__factors-title">
                    Factores que afectan:
                </p>

                <div className="clima-cancha__factor-list">
                    {/* Loop through each factor affecting the score */}
                    {cancha.factors.map((factor, index) => (
                        <div key={index} className="clima-cancha__factor">
                            {/* Emoji icon */}
                            <span className="clima-cancha__factor-emoji">
                                {factor.emoji}
                            </span>

                            {/* Factor details */}
                            <div className="clima-cancha__factor-info">
                                <span className="clima-cancha__factor-name">
                                    {factor.factor}
                                </span>
                                <span className="clima-cancha__factor-desc">
                                    {factor.description}
                                </span>
                            </div>

                            {/* Impact number (if negative) */}
                            {factor.impact !== 0 && (
                                <span
                                    className="clima-cancha__factor-impact"
                                    style={{
                                        // Red for negative, green for positive
                                        color: factor.impact < 0 ? '#f87171' : '#4ade80'
                                    }}
                                >
                                    {factor.impact > 0 ? '+' : ''}{factor.impact}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* SOCCER FIELD VISUAL (decorative) */}
            <div className="clima-cancha__field">
                <div className="clima-cancha__field-center"></div>
                <div className="clima-cancha__field-line"></div>
            </div>
        </div>
    );
}

export default ClimaDeCancha;
