/**
 * =====================================================
 * MATCHES BY WEATHER PAGE
 * =====================================================
 * 
 * Filter today's matches by weather conditions:
 * - Get all matches
 * - Fetch weather for each venue
 * - Filter by selected condition
 */

import React, { useState, useEffect, useCallback } from 'react';
import { getTodaysMatches, LIVE_MATCH_STATUSES } from '../services/footballApi';
import WeatherFilter, { WEATHER_CONDITIONS } from './WeatherFilter';
import MatchCard from './MatchCard';
import TeamSearch from './TeamSearch';
import NextMatch from './NextMatch';
import './MatchesByWeather.css';

// OpenWeatherMap API key
const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

function MatchesByWeather({ onWeatherChange, currentWeather }) {
    const [matches, setMatches] = useState([]);
    const [weatherData, setWeatherData] = useState({});
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedLeague, setSelectedLeague] = useState('all');
    const [teamFilter, setTeamFilter] = useState(''); // Text filter for today's matches
    const [selectedTeam, setSelectedTeam] = useState(null); // For NextMatch overlay
    const [loading, setLoading] = useState(true);
    const [loadingWeather, setLoadingWeather] = useState(true);



    // Load matches on mount
    useEffect(() => {
        async function loadMatches() {
            setLoading(true);
            const data = await getTodaysMatches();
            setMatches(data);
            setLoading(false);
        }
        loadMatches();
    }, []);

    // Fetch weather for all unique match cities
    useEffect(() => {
        const fetchMatchWeather = async () => {
            if (matches.length === 0) return;

            setLoadingWeather(true);
            const uniqueCities = [...new Set(matches.map(m => m.venue?.city).filter(Boolean))];
            const newWeatherData = {};

            const promises = uniqueCities.map(async (rawCity) => {
                // Sanitize city name: remove parentheses and extra text
                // e.g. "Newport (Casnewydd)" -> "Newport", "Buckley / Bwcle" -> "Buckley"
                let city = rawCity.split('(')[0].split('/')[0].split(',')[0].trim();

                // Remove diacritics for better matching (optional, depending on API preference)
                // city = city.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                try {
                    const response = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`
                    );

                    if (!response.ok) return; // Skip if city not found (404)

                    const data = await response.json();
                    if (data.main) {
                        newWeatherData[rawCity] = { // Map original rawCity to data
                            temp: Math.round(data.main.temp),
                            weather: data.weather[0].main,
                            img: data.weather[0].icon,
                            icon: data.weather[0].icon
                        };
                    }
                } catch (error) {
                    console.error(`Error fetching weather for ${city}:`, error);
                }
            });

            await Promise.all(promises);
            setWeatherData(newWeatherData);
            setLoadingWeather(false);
        };

        fetchMatchWeather();
    }, [matches]);

    // Filter matches based on weather AND league AND Team
    const filterMatches = useCallback((matchList, weatherFilter, leagueFilter, teamSearch) => {
        let result = matchList;

        // 0. Filter by Team (Text Search)
        if (teamSearch && teamSearch.trim() !== '') {
            const query = teamSearch.toLowerCase().trim();
            result = result.filter(match =>
                match.homeTeam?.name?.toLowerCase().includes(query) ||
                match.awayTeam?.name?.toLowerCase().includes(query)
            );
        }

        // 1. Filter by League
        if (leagueFilter !== 'all') {
            result = result.filter(match => (match.league?.name || 'Otros') === leagueFilter);
        }

        // 2. Filter by Weather / Status
        if (weatherFilter === 'all') return result;

        const condition = WEATHER_CONDITIONS[weatherFilter];
        if (!condition) return result;

        return result.filter(match => {
            // Special Case: Live Matches
            if (condition.isLive) {
                // FIX: Access status directly as it is flattened in parseFixture
                // FIX: Access status directly as it is flattened in parseFixture
                const status = match.status;
                // Expanded list of LIVE statuses: 1H (First Half), 2H (Second Half), HT (Halftime), ET (Extra Time), BT (Break Time), P (Penalty), LIVE, INT (Interrupted)
                return LIVE_MATCH_STATUSES.includes(status);
            }

            // Weather Data Checks
            const weather = weatherData[match.venue?.city];
            if (!weather) return false;

            // Check by Day/Night (Icon suffix: 'd' = day, 'n' = night)
            if (condition.iconType) {
                return weather.icon?.endsWith(condition.iconType);
            }

            // Check by weather type
            if (condition.weatherTypes) {
                return condition.weatherTypes.includes(weather.weather);
            }

            // Check by temperature
            if (condition.minTemp !== undefined) {
                return weather.temp >= condition.minTemp;
            }
            if (condition.maxTemp !== undefined) {
                return weather.temp <= condition.maxTemp;
            }

            return true;
        });
    }, [weatherData]);

    // Get filtered matches (Memoized to prevent infinite loop)
    const filteredMatches = React.useMemo(() =>
        filterMatches(matches, activeFilter, selectedLeague, teamFilter),
        [matches, activeFilter, selectedLeague, teamFilter, filterMatches]
    );

    // Track last emitted weather to prevent loops (Moved here to be near usage)
    const lastWeatherRef = React.useRef(null);

    // Update background when filter or matches change
    useEffect(() => {
        if (onWeatherChange && filteredMatches.length > 0) {
            const firstMatch = filteredMatches[0];
            const weather = weatherData[firstMatch.venue?.city];

            if (weather) {
                // Check against global current weather state (prevents loop on remount)
                if (currentWeather &&
                    currentWeather.type === weather.weather &&
                    currentWeather.icon === weather.icon &&
                    currentWeather.temp === weather.temp) {
                    return;
                }

                // Also check local ref for good measure (double safety)
                const prev = lastWeatherRef.current;
                if (prev && prev.type === weather.weather && prev.icon === weather.icon && prev.temp === weather.temp) {
                    return;
                }

                lastWeatherRef.current = {
                    type: weather.weather,
                    icon: weather.icon,
                    temp: weather.temp
                };

                onWeatherChange({
                    type: weather.weather,
                    icon: weather.icon,
                    temp: weather.temp
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredMatches, weatherData, onWeatherChange]);



    // Group matches by league (for display)
    const groupedMatches = filteredMatches.reduce((acc, match) => {
        const league = match.league?.name || 'Otros';
        if (!acc[league]) acc[league] = [];
        acc[league].push(match);
        return acc;
    }, {});


    // Extract unique leagues from matches
    const allLeagues = [...new Set(matches.map(match => match.league?.name || 'Otros'))];

    // Define Top European Competitions
    const TOP_LEAGUES = [
        'UEFA Champions League',
        'UEFA Europa League',
        'Premier League',
        'La Liga',
        'Serie A',
        'Bundesliga',
        'Ligue 1'
    ];

    if (loading) {
        return (
            <div className="matches-page matches-page--loading">
                <div className="matches-page__loader">⚽</div>
                <p>Cargando partidos de hoy...</p>
            </div>
        );
    }

    return (
        <div className="matches-page">
            <div className="matches-page__header">
                <h1 className="matches-page__title">🌤️ Fixture Meteorológico</h1>
                <p className="matches-page__subtitle">
                    Filtrá partidos por clima y competición
                </p>

                {/* League Dropdown */}
                <div className="league-selector">
                    <select
                        value={selectedLeague}
                        onChange={(e) => setSelectedLeague(e.target.value)}
                        className="league-selector__dropdown"
                    >
                        <option value="all">🌍 Todas las Ligas</option>

                        {/* Top Competitions Group */}
                        <optgroup label="🏆 Competiciones Top">
                            {allLeagues.filter(l => TOP_LEAGUES.includes(l)).map(league => (
                                <option key={league} value={league}>{league}</option>
                            ))}
                        </optgroup>

                        {/* Rest of the World Group */}
                        <optgroup label="🌐 Resto del Mundo">
                            {allLeagues.filter(l => !TOP_LEAGUES.includes(l) && l !== 'all').map(league => (
                                <option key={league} value={league}>{league}</option>
                            ))}
                        </optgroup>
                    </select>

                    {/* NEW: smart Team Search */}
                    <div className="matches-page__search-wrapper">
                        <TeamSearch onTeamSelect={(team) => {
                            // Check if team is playing today
                            const isPlayingToday = matches.some(m =>
                                m.home?.id === team.id || m.away?.id === team.id
                            );

                            if (isPlayingToday) {
                                // Just filter the view
                                setTeamFilter(team.name);
                            } else {
                                // Show Next Match overlay
                                setSelectedTeam(team);
                            }
                        }} />
                    </div>
                </div>
            </div>

            {/* Next Match Overlay */}
            {
                selectedTeam && (
                    <div className="next-match-overlay">
                        <div className="next-match-overlay__content">
                            <h3>El equipo no juega hoy</h3>
                            <p>Mostrando próximo partido:</p>
                            <NextMatch
                                team={selectedTeam}
                                onWeatherReceived={(w) => {
                                    // Optional: update background if looking at this overlay
                                    if (onWeatherChange) {
                                        onWeatherChange({
                                            type: w.weather,
                                            icon: w.icon
                                        });
                                    }
                                }}
                            />
                            <button
                                className="next-match-overlay__close"
                                onClick={() => setSelectedTeam(null)}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )
            }

            <WeatherFilter
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                loading={loadingWeather}
            />

            {/* Stats */}
            <div className="matches-page__stats">
                <span>
                    {loadingWeather ? '⏳ Cargando clima...' : `📊 ${filteredMatches.length} partidos encontrados`}
                </span>
            </div>

            {/* No results */}
            {
                !loadingWeather && filteredMatches.length === 0 && (
                    <div className="matches-page__empty">
                        <p>😕 No hay partidos con estos filtros hoy</p>
                        <button onClick={() => { setActiveFilter('all'); setSelectedLeague('all'); }}>
                            Limpiar Filtros
                        </button>
                    </div>
                )
            }

            {/* Matches grouped by league */}
            {
                Object.entries(groupedMatches).map(([league, leagueMatches]) => (
                    <div key={league} className="matches-page__league">
                        <h2 className="matches-page__league-title">{league}</h2>
                        <div className="matches-page__grid">
                            {leagueMatches.map(match => (
                                <MatchCard
                                    key={match.id}
                                    match={match}
                                    weather={weatherData[match.venue?.city]}
                                />
                            ))}
                        </div>
                    </div>
                ))
            }
        </div >
    );
}

export default MatchesByWeather;
