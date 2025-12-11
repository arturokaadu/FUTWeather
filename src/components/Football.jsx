/**
 * =====================================================
 * FOOTBALL PAGE - Team Search + Weather Filter
 * =====================================================
 */

import React, { useState } from 'react';
import TeamSearch from './TeamSearch';
import NextMatch from './NextMatch';
import MatchesByWeather from './MatchesByWeather';
import './Football.css';

function Football({ onWeatherChange }) {
    const [activeTab, setActiveTab] = useState('weather'); // 'team' or 'weather'
    const [selectedTeam, setSelectedTeam] = useState(null);

    // Handle team selection from search
    function handleTeamSelect(team) {
        setSelectedTeam(team);
    }

    // Handle weather update for dynamic background
    function handleWeatherReceived(weather) {
        if (onWeatherChange) {
            onWeatherChange({
                type: weather.weather,
                icon: weather.icon
            });
        }
    }

    // Reset team selection
    function handleReset() {
        setSelectedTeam(null);
    }

    return (
        <div className="football-page">
            {/* Tabs */}
            <div className="football-page__tabs">
                <button
                    className={`football-page__tab ${activeTab === 'weather' ? 'football-page__tab--active' : ''}`}
                    onClick={() => setActiveTab('weather')}
                >
                    🌤️ Por Clima
                </button>
                <button
                    className={`football-page__tab ${activeTab === 'team' ? 'football-page__tab--active' : ''}`}
                    onClick={() => { setActiveTab('team'); handleReset(); }}
                >
                    ⚽ Por Equipo
                </button>
            </div>

            {/* Weather Filter Tab */}
            {activeTab === 'weather' && (
                <MatchesByWeather onWeatherChange={onWeatherChange} />
            )}

            {/* Team Search Tab */}
            {activeTab === 'team' && (
                <div className="football-page__team-section">
                    <div className="football-page__header">
                        <h1 className="football-page__title">🗓️ Fixture Meteorológico</h1>
                        <p className="football-page__subtitle">
                            Buscá un equipo y mirá el clima de su próximo partido
                        </p>
                    </div>

                    {/* Team search - show when no team selected */}
                    {!selectedTeam && (
                        <TeamSearch onTeamSelect={handleTeamSelect} />
                    )}

                    {/* Selected team's next match */}
                    {selectedTeam && (
                        <>
                            <NextMatch
                                team={selectedTeam}
                                onWeatherReceived={handleWeatherReceived}
                            />
                            <button className="football-page__back" onClick={handleReset}>
                                ← Buscar otro equipo
                            </button>
                        </>
                    )}

                    {/* Quick tips when no team selected */}
                    {!selectedTeam && (
                        <div className="football-page__tips">
                            <h3>🔥 Equipos populares</h3>
                            <div className="football-page__chips">
                                {['Boca', 'River', 'Barcelona', 'Real Madrid', 'Liverpool', 'PSG'].map(team => (
                                    <button
                                        key={team}
                                        className="football-page__chip"
                                        onClick={() => {
                                            document.querySelector('.team-search__input')?.focus();
                                        }}
                                    >
                                        {team}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Football;
