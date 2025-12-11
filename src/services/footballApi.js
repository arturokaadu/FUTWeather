/**
 * =====================================================
 * FOOTBALL API SERVICE - With Real API Integration
 * =====================================================
 * 
 * Uses API-Football via RapidAPI for:
 * - Team search (worldwide)
 * - Today's matches / Live matches
 * - Matches by date
 * 
 * FREE TIER: 100 requests/day
 * 
 * API Documentation: https://www.api-football.com/documentation-v3
 */

// ============================================
// CONFIGURATION - Put your RapidAPI key here!
// ============================================
const API_KEY = process.env.REACT_APP_RAPIDAPI_KEY || 'aedee0444e3eb70c768523e7c719e10c';
// Note: User provided a Direct API-Sports key (not RapidAPI), so we use the direct endpoint.
const BASE_URL = 'https://v3.football.api-sports.io';

/**
 * Status Codes for Live Matches
 */
export const LIVE_MATCH_STATUSES = ['1H', '2H', 'HT', 'ET', 'BT', 'P', 'INT', 'LIVE'];

/**
 * Check if API key is configured
 */
export function isApiConfigured() {
    return API_KEY && API_KEY.length > 10;
}

/**
 * Default headers for API requests
 */
const getHeaders = () => ({
    'x-apisports-key': API_KEY
});

// ============================================
// TEAM SEARCH
// ============================================

/**
 * Search for teams by name
 */
export async function searchTeams(teamName) {
    if (!isApiConfigured()) {
        return getDemoTeams(teamName);
    }

    try {
        const response = await fetch(
            `${BASE_URL}/teams?search=${encodeURIComponent(teamName)}`,
            { headers: getHeaders() }
        );

        const data = await response.json();

        if (data.errors && Object.keys(data.errors).length > 0) {
            console.error('API Error:', data.errors);
            console.error('API Error:', data.errors);
            return [];
        }

        return (data.response || []).map(item => ({
            id: item.team.id,
            name: item.team.name,
            logo: item.team.logo,
            country: item.team.country,
            venue: {
                id: item.venue?.id,
                name: item.venue?.name,
                city: item.venue?.city
            }
        }));
    } catch (error) {
        console.error('Error searching teams:', error);
        return getDemoTeams(teamName);
    }
}

// ============================================
// FIXTURES / MATCHES
// ============================================

/**
 * Get today's matches
 */
export async function getTodaysMatches() {
    const today = new Date().toISOString().split('T')[0];
    return getMatchesByDate(today);
}

/**
 * Get matches by specific date
 * @param {string} date - Date in YYYY-MM-DD format
 */
export async function getMatchesByDate(date) {
    if (!isApiConfigured()) {
        return getDemoMatches();
    }

    try {
        const response = await fetch(
            `${BASE_URL}/fixtures?date=${date}`,
            { headers: getHeaders() }
        );

        const data = await response.json();

        if (data.errors && Object.keys(data.errors).length > 0) {
            console.error('API Error:', data.errors);
            console.error('API Error:', data.errors);
            return [];
        }

        return (data.response || []).map(parseFixture);
    } catch (error) {
        console.error('Error getting matches:', error);
        return getDemoMatches();
    }
}

/**
 * Get live matches (currently playing)
 */
export async function getLiveMatches() {
    if (!isApiConfigured()) {
        return [];
    }

    try {
        const response = await fetch(
            `${BASE_URL}/fixtures?live=all`,
            { headers: getHeaders() }
        );

        const data = await response.json();

        if (data.errors && Object.keys(data.errors).length > 0) {
            console.error('API Error:', data.errors);
            return [];
        }

        return (data.response || []).map(parseFixture);
    } catch (error) {
        console.error('Error getting live matches:', error);
        return [];
    }
}

/**
 * Get next fixture for a specific team
 */
export async function getNextFixture(teamId) {
    if (!isApiConfigured()) {
        const teams = getDemoTeams('');
        const team = teams.find(t => t.id === teamId) || teams[0];
        return getDemoFixture(team);
    }

    try {
        // 1. Check if team is LIVE now
        const liveResponse = await fetch(
            `${BASE_URL}/fixtures?live=all&team=${teamId}`,
            { headers: getHeaders() }
        );

        const liveData = await liveResponse.json();

        // If there is a live match, return it immediately!
        if (liveData.response && liveData.response.length > 0) {
            return parseFixture(liveData.response[0]);
        }

        // 2. Fetch NEXT matches (increase limit to 40)
        const response = await fetch(
            `${BASE_URL}/fixtures?team=${teamId}&next=40`,
            { headers: getHeaders() }
        );

        const data = await response.json();

        // If no upcoming matches found
        if (!data.response || data.response.length === 0) {
            console.warn(`No next matches found for team ${teamId}`);
            return null;
        }

        // Return the very next one (index 0)
        return parseFixture(data.response[0]);
    } catch (error) {
        console.error('Error getting fixture:', error);
        return null;
    }
}

/**
 * Parse API fixture response to our format
 */
function parseFixture(fixture) {
    return {
        id: fixture.fixture.id,
        date: fixture.fixture.date,
        timestamp: fixture.fixture.timestamp,
        status: fixture.fixture.status?.short || 'NS',
        venue: {
            id: fixture.fixture.venue?.id,
            name: fixture.fixture.venue?.name,
            city: fixture.fixture.venue?.city
        },
        league: {
            id: fixture.league.id,
            name: fixture.league.name,
            country: fixture.league.country,
            logo: fixture.league.logo,
            round: fixture.league.round
        },
        home: {
            id: fixture.teams.home.id,
            name: fixture.teams.home.name,
            logo: fixture.teams.home.logo,
            score: fixture.goals?.home
        },
        away: {
            id: fixture.teams.away.id,
            name: fixture.teams.away.name,
            logo: fixture.teams.away.logo,
            score: fixture.goals?.away
        }
    };
}

// ============================================
// DEMO DATA (when API not configured)
// ============================================

export function getDemoTeams(searchQuery) {
    const demoTeams = [
        { id: 451, name: 'Boca Juniors', logo: 'https://media.api-sports.io/football/teams/451.png', country: 'Argentina', venue: { city: 'Buenos Aires', name: 'La Bombonera' } },
        { id: 435, name: 'River Plate', logo: 'https://media.api-sports.io/football/teams/435.png', country: 'Argentina', venue: { city: 'Buenos Aires', name: 'Monumental' } },
        { id: 529, name: 'Barcelona', logo: 'https://media.api-sports.io/football/teams/529.png', country: 'Spain', venue: { city: 'Barcelona', name: 'Camp Nou' } },
        { id: 541, name: 'Real Madrid', logo: 'https://media.api-sports.io/football/teams/541.png', country: 'Spain', venue: { city: 'Madrid', name: 'Santiago Bernabéu' } },
        { id: 33, name: 'Manchester United', logo: 'https://media.api-sports.io/football/teams/33.png', country: 'England', venue: { city: 'Manchester', name: 'Old Trafford' } },
        { id: 50, name: 'Manchester City', logo: 'https://media.api-sports.io/football/teams/50.png', country: 'England', venue: { city: 'Manchester', name: 'Etihad Stadium' } },
        { id: 40, name: 'Liverpool', logo: 'https://media.api-sports.io/football/teams/40.png', country: 'England', venue: { city: 'Liverpool', name: 'Anfield' } },
        { id: 49, name: 'Chelsea', logo: 'https://media.api-sports.io/football/teams/49.png', country: 'England', venue: { city: 'London', name: 'Stamford Bridge' } },
        { id: 85, name: 'PSG', logo: 'https://media.api-sports.io/football/teams/85.png', country: 'France', venue: { city: 'Paris', name: 'Parc des Princes' } },
        { id: 157, name: 'Bayern Munich', logo: 'https://media.api-sports.io/football/teams/157.png', country: 'Germany', venue: { city: 'Munich', name: 'Allianz Arena' } },
        { id: 489, name: 'AC Milan', logo: 'https://media.api-sports.io/football/teams/489.png', country: 'Italy', venue: { city: 'Milan', name: 'San Siro' } },
        { id: 496, name: 'Juventus', logo: 'https://media.api-sports.io/football/teams/496.png', country: 'Italy', venue: { city: 'Turin', name: 'Allianz Stadium' } },
        { id: 432, name: 'Racing Club', logo: 'https://media.api-sports.io/football/teams/432.png', country: 'Argentina', venue: { city: 'Avellaneda', name: 'Cilindro' } },
        { id: 434, name: 'San Lorenzo', logo: 'https://media.api-sports.io/football/teams/434.png', country: 'Argentina', venue: { city: 'Buenos Aires', name: 'Nuevo Gasómetro' } },
        { id: 455, name: 'Independiente', logo: 'https://media.api-sports.io/football/teams/455.png', country: 'Argentina', venue: { city: 'Avellaneda', name: 'Libertadores de América' } },
        { id: 121, name: 'Flamengo', logo: 'https://media.api-sports.io/football/teams/121.png', country: 'Brazil', venue: { city: 'Rio de Janeiro', name: 'Maracanã' } },
        { id: 131, name: 'Corinthians', logo: 'https://media.api-sports.io/football/teams/131.png', country: 'Brazil', venue: { city: 'São Paulo', name: 'Neo Química Arena' } },
    ];

    if (!searchQuery) return demoTeams;

    const query = searchQuery.toLowerCase();
    return demoTeams.filter(team =>
        team.name.toLowerCase().includes(query) ||
        team.country.toLowerCase().includes(query)
    );
}

/**
 * Get demo matches for when API is not configured
 */
export function getDemoMatches() {
    const now = new Date();
    const teams = getDemoTeams('');

    return [
        {
            id: 1001,
            date: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
            status: 'NS',
            venue: { name: 'La Bombonera', city: 'Buenos Aires' },
            league: { name: 'Liga Argentina', country: 'Argentina', round: 'Jornada 15' },
            home: teams[0],
            away: teams[12]
        },
        {
            id: 1002,
            date: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
            status: 'NS',
            venue: { name: 'Monumental', city: 'Buenos Aires' },
            league: { name: 'Liga Argentina', country: 'Argentina', round: 'Jornada 15' },
            home: teams[1],
            away: teams[13]
        },
        {
            id: 1003,
            date: new Date(now.getTime() + 1 * 60 * 60 * 1000).toISOString(),
            status: 'NS',
            venue: { name: 'Camp Nou', city: 'Barcelona' },
            league: { name: 'La Liga', country: 'Spain', round: 'Matchday 17' },
            home: teams[2],
            away: teams[3]
        },
        {
            id: 1004,
            date: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
            status: 'NS',
            venue: { name: 'Old Trafford', city: 'Manchester' },
            league: { name: 'Premier League', country: 'England', round: 'Matchweek 16' },
            home: teams[4],
            away: teams[6]
        },
        {
            id: 1005,
            date: new Date(now.getTime() + 5 * 60 * 60 * 1000).toISOString(),
            status: 'NS',
            venue: { name: 'Etihad Stadium', city: 'Manchester' },
            league: { name: 'Premier League', country: 'England', round: 'Matchweek 16' },
            home: teams[5],
            away: teams[7]
        },
        {
            id: 1006,
            date: new Date(now.getTime() + 2.5 * 60 * 60 * 1000).toISOString(),
            status: 'NS',
            venue: { name: 'Parc des Princes', city: 'Paris' },
            league: { name: 'Ligue 1', country: 'France', round: 'Journée 15' },
            home: teams[8],
            away: { id: 999, name: 'Lyon', logo: 'https://media.api-sports.io/football/teams/80.png' }
        },
        {
            id: 1007,
            date: new Date(now.getTime() + 3.5 * 60 * 60 * 1000).toISOString(),
            status: 'NS',
            venue: { name: 'Allianz Arena', city: 'Munich' },
            league: { name: 'Bundesliga', country: 'Germany', round: 'Spieltag 14' },
            home: teams[9],
            away: { id: 998, name: 'Dortmund', logo: 'https://media.api-sports.io/football/teams/165.png' }
        },
        {
            id: 1008,
            date: new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString(),
            status: 'NS',
            venue: { name: 'San Siro', city: 'Milan' },
            league: { name: 'Serie A', country: 'Italy', round: 'Giornata 16' },
            home: teams[10],
            away: teams[11]
        },
        {
            id: 1009,
            date: new Date(now.getTime() + 1.5 * 60 * 60 * 1000).toISOString(),
            status: 'NS',
            venue: { name: 'Maracanã', city: 'Rio de Janeiro' },
            league: { name: 'Brasileirão', country: 'Brazil', round: 'Rodada 38' },
            home: teams[15],
            away: teams[16]
        },
        {
            id: 1010,
            date: new Date(now.getTime() + 7 * 60 * 60 * 1000).toISOString(),
            status: 'NS',
            venue: { name: 'Anfield', city: 'Liverpool' },
            league: { name: 'Premier League', country: 'England', round: 'Matchweek 16' },
            home: teams[6],
            away: { id: 997, name: 'Arsenal', logo: 'https://media.api-sports.io/football/teams/42.png' }
        },
    ];
}

/**
 * Get demo fixture for a team
 */
export function getDemoFixture(team) {
    const opponents = getDemoTeams('').filter(t => t.id !== team.id);
    const randomOpponent = opponents[Math.floor(Math.random() * opponents.length)];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3); // Always 3 days from now
    futureDate.setHours(20, 0, 0, 0);

    return {
        id: 999999,
        date: futureDate.toISOString(),
        timestamp: Math.floor(futureDate.getTime() / 1000),
        status: 'NS',
        venue: {
            name: team.venue?.name || 'Estadio',
            city: team.venue?.city || 'Ciudad'
        },
        league: {
            name: team.country === 'Argentina' ? 'Liga Argentina' : 'Liga Demo',
            country: team.country,
            round: 'Jornada 15'
        },
        home: {
            id: team.id,
            name: team.name,
            logo: team.logo
        },
        away: randomOpponent
    };
}
