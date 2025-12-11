/**
 * =====================================================
 * TEAM SEARCH COMPONENT
 * =====================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { searchTeams } from '../services/footballApi';
import './TeamSearch.css';

function TeamSearch({ onTeamSelect }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchTerm.length >= 2) {
                setLoading(true);
                const teams = await searchTeams(searchTerm);
                setResults(teams);
                setLoading(false);
                setShowResults(true);
            } else {
                setResults([]);
                setShowResults(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Handle outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [searchRef]);

    const handleSelect = (team) => {
        onTeamSelect(team);
        setSearchTerm('');
        setShowResults(false);
    };

    return (
        <div className="team-search" ref={searchRef}>
            <div className="team-search__input-wrapper">
                <span className="team-search__icon">🔍</span>
                <input
                    type="text"
                    className="team-search__input"
                    placeholder="Buscar equipo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => {
                        if (results.length > 0) setShowResults(true);
                    }}
                />
                {loading && <div className="team-search__loader"></div>}
            </div>

            {showResults && results.length > 0 && (
                <ul className="team-search__results">
                    {results.map(team => (
                        <li
                            key={team.id}
                            className="team-search__item"
                            onClick={() => handleSelect(team)}
                        >
                            <img src={team.logo} alt={team.name} className="team-search__team-logo" />
                            <div className="team-search__info">
                                <span className="team-search__name">{team.name}</span>
                                <span className="team-search__country">{team.country}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TeamSearch;
