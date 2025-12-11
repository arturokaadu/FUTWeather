/**
 * =====================================================
 * MATCH MENU COMPONENT (SKELETON)
 * =====================================================
 * 
 * Shows the "Fan Menu" (Food & Drink) for the match.
 * Currently a visual skeleton waiting for logic.
 */

import React, { useState, useEffect } from 'react';
import './MatchMenu.css';
import { getMealRecommendation, getDrinkRecommendation, getNonAlcoholicDrinkRecommendation, inferCountryFromText } from '../services/foodApi';

// Domestic Leagues where we should ALWAYS show a single "Clásico Local" menu
const DOMESTIC_LEAGUES = [
    'Premier League',
    'La Liga',
    'Bundesliga',
    'Serie A',
    'Ligue 1',
    'Liga Profesional',
    'Primeira Liga',
    'Eredivisie',
    'Brasileirão',
    'Major League Soccer'
];

function MatchMenu({ country, city, homeTeam, awayTeam, leagueName, expanded }) {
    const [homeMenu, setHomeMenu] = useState({ meal: null, drinkAlc: null, drinkNonAlc: null });
    const [awayMenu, setAwayMenu] = useState({ meal: null, drinkAlc: null, drinkNonAlc: null });
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [isSameCountry, setIsSameCountry] = useState(false);

    useEffect(() => {
        if (expanded && !loaded) {
            setLoading(true);

            // 1. Determine "Same Country" Context (Domestic vs International)
            const isDomestic = DOMESTIC_LEAGUES.some(l => leagueName?.includes(l));

            // Also check inferred countries if logic allows
            const homeCountry = inferCountryFromText(city) || inferCountryFromText(homeTeam) || country;
            const awayCountry = inferCountryFromText(awayTeam) || 'International';

            const sameCountryDetected = isDomestic || (homeCountry === awayCountry);
            setIsSameCountry(sameCountryDetected);

            // 2. Fetch Logic
            const fetchMenus = async () => {
                // Fetch Home Menu logic
                const [hMeal, hDrink, hNaDrink] = await Promise.all([
                    getMealRecommendation(homeCountry, city),
                    getDrinkRecommendation(homeCountry),
                    getNonAlcoholicDrinkRecommendation(homeCountry)
                ]);

                setHomeMenu({ meal: hMeal, drinkAlc: hDrink, drinkNonAlc: hNaDrink });

                if (!sameCountryDetected) {
                    const [aMeal, aDrink, aNaDrink] = await Promise.all([
                        getMealRecommendation(awayCountry),
                        getDrinkRecommendation(awayCountry),
                        getNonAlcoholicDrinkRecommendation(awayCountry)
                    ]);
                    setAwayMenu({ meal: aMeal, drinkAlc: aDrink, drinkNonAlc: aNaDrink });
                }

                setLoading(false);
                setLoaded(true);
            };

            fetchMenus();
        }
    }, [expanded, country, city, homeTeam, awayTeam, leagueName, loaded]);

    if (!expanded) return null;

    const renderMenuItem = (label, item, icon) => (
        <div className="match-menu__item">
            {loading ? (
                <div className="match-menu__image-skeleton">{icon}</div>
            ) : (
                <div className="match-menu__image-wrapper">
                    <img src={item?.image} alt={item?.name} className="match-menu__image" />
                </div>
            )}
            <div className="match-menu__details">
                <span className="match-menu__label">{label}</span>
                {loading ? (
                    <div className="match-menu__text-skeleton"></div>
                ) : (
                    <span className="match-menu__name">{item?.name}</span>
                )}
            </div>
        </div>
    );

    return (
        <div className="match-menu">
            <div className="match-menu__header">
                🍽️ Menú del Hincha
            </div>

            {isSameCountry ? (
                // SINGLE MENU (Unified)
                <div className="match-menu__single">
                    <h4 className="match-menu__subtitle match-menu__subtitle--center">
                        🏟️ Clásico Local <span className="match-menu__badge-small">{homeMenu.meal?.area || 'Local'}</span>
                    </h4>
                    <div className="match-menu__list">
                        {renderMenuItem('Plato de Cancha', homeMenu.meal, '🍔')}
                        {renderMenuItem('Bebida', homeMenu.drinkAlc, '🍺')}
                        {renderMenuItem('Refresco', homeMenu.drinkNonAlc, '🥤')}
                    </div>
                </div>
            ) : (
                // DUAL MENU (Split)
                <div className="match-menu__columns">
                    {/* LOCAL COLUMN */}
                    <div className="match-menu__column">
                        <h4 className="match-menu__subtitle">
                            🏠 Local <span className="match-menu__badge-small">{homeMenu.meal?.area || 'Local'}</span>
                        </h4>
                        <div className="match-menu__list">
                            {renderMenuItem('Plato Principal', homeMenu.meal, '🍔')}
                            {renderMenuItem('Con Alcohol', homeMenu.drinkAlc, '🍺')}
                            {renderMenuItem('Sin Alcohol', homeMenu.drinkNonAlc, '🥤')}
                        </div>
                    </div>

                    {/* DIVIDER */}
                    <div className="match-menu__divider"></div>

                    {/* VISITOR COLUMN */}
                    <div className="match-menu__column">
                        <h4 className="match-menu__subtitle">
                            ✈️ Visitante <span className="match-menu__badge-small">{awayMenu.meal?.area || 'Visitante'}</span>
                        </h4>
                        <div className="match-menu__list">
                            {renderMenuItem('Plato Principal', awayMenu.meal, '🍔')}
                            {renderMenuItem('Con Alcohol', awayMenu.drinkAlc, '🍺')}
                            {renderMenuItem('Sin Alcohol', awayMenu.drinkNonAlc, '🥤')}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MatchMenu;
