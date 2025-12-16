import { CULTURAL_PROFILE, COUNTRY_TO_REGION } from './culturalProfile';
import { getSpoonacularRecipe } from './spoonacularApi';
import { MISSING_CUISINES } from './missingCuisines';

const MEAL_API_BASE = 'https://www.themealdb.com/api/json/v1/1';
const COCKTAIL_API_BASE = 'https://www.thecocktaildb.com/api/json/v1/1';

// Direct Mapping for Cities -> Countries (Helper for Context)
const CITY_TO_COUNTRY = {
    // Expanded mapping for better food accuracy
    'Munich': 'Germany', 'Berlin': 'Germany', 'Dortmund': 'Germany', 'Hamburg': 'Germany', 'Frankfurt': 'Germany',
    'London': 'England', 'Manchester': 'England', 'Liverpool': 'England', 'Birmingham': 'England', 'Leeds': 'England',
    'Madrid': 'Spain', 'Barcelona': 'Spain', 'Seville': 'Spain', 'Valencia': 'Spain', 'Bilbao': 'Spain',
    'Rome': 'Italy', 'Milan': 'Italy', 'Turin': 'Italy', 'Naples': 'Italy', 'Florence': 'Italy',
    'Paris': 'France', 'Marseille': 'France', 'Lyon': 'France', 'Lille': 'France', 'Bordeaux': 'France',
    'Buenos Aires': 'Argentina', 'Rosario': 'Argentina', 'Cordoba': 'Argentina', 'Mendoza': 'Argentina',
    'Rio de Janeiro': 'Brazil', 'Sao Paulo': 'Brazil', 'Brasilia': 'Brazil', 'Salvador': 'Brazil',
    'Santiago': 'Chile', 'Valparaiso': 'Chile',
    'Lisbon': 'Portugal', 'Porto': 'Portugal',
    'Amsterdam': 'Netherlands', 'Rotterdam': 'Netherlands',
    'Brussels': 'Belgium', 'Antwerp': 'Belgium',
    'Vienna': 'Austria',
    'Zurich': 'Switzerland', 'Geneva': 'Switzerland',
    'Dublin': 'Ireland',
    'Edinburgh': 'Scotland', 'Glasgow': 'Scotland',
    'Cardiff': 'Wales',
    'Copenhagen': 'Denmark',
    'Stockholm': 'Sweden',
    'Oslo': 'Norway',
    'Helsinki': 'Finland',
    'Warsaw': 'Poland',
    'Prague': 'Czech Republic',
    'Budapest': 'Hungary',
    'Moscow': 'Russia', 'Saint Petersburg': 'Russia',
    'Istanbul': 'Turkey',
    'Athens': 'Greece',
    'Tokyo': 'Japan', 'Osaka': 'Japan',
    'Beijing': 'China', 'Shanghai': 'China',
    'Seoul': 'South Korea',
    'Mexico City': 'Mexico', 'Guadalajara': 'Mexico',
    'Bogota': 'Colombia',
    'Lima': 'Peru',
    'Montevideo': 'Uruguay',
    'New York': 'USA', 'Los Angeles': 'USA', 'Chicago': 'USA', 'Miami': 'USA', 'Boston': 'USA', 'Seattle': 'USA', 'Atlanta': 'USA',
    'Cairo': 'Egypt',
    'Lagos': 'Nigeria',
    'Sydney': 'Australia', 'Melbourne': 'Australia',

    'New Delhi': 'India', 'Mumbai': 'India',
    'Riyadh': 'Saudi Arabia',
    'Tehran': 'Iran',
    'Baghdad': 'Iraq',
    'Doha': 'Qatar',
    'Dubai': 'United Arab Emirates'
};

export function inferCountryFromText(text) {
    if (!text) return null;

    // Check known cities
    if (CITY_TO_COUNTRY[text]) return CITY_TO_COUNTRY[text];

    // Check keys in Profile
    for (const country of Object.keys(CULTURAL_PROFILE)) {
        if (text.includes(country)) return country;
    }

    return null;
}

/**
 * GENERIC SEARCH ALGORITHM
 * Used for both Food and Drink to find the best match from a list of keywords.
 */
async function searchCulturalItem(country, type) {
    const profile = CULTURAL_PROFILE[country] || CULTURAL_PROFILE['International'];
    const keywords = type === 'meal' ? profile.food : profile.drink;
    const apiBase = type === 'meal' ? MEAL_API_BASE : COCKTAIL_API_BASE;

    // ALGORITHM: Try keywords sequencially until we find a HIT
    for (const keyword of keywords) {
        try {
            const response = await fetch(`${apiBase}/search.php?s=${keyword}`);
            const data = await response.json();
            const items = type === 'meal' ? data.meals : data.drinks;

            if (items && items.length > 0) {
                // Success! Pick a random one from the results to vary matches
                // e.g. "Steak" returns 10 dishes, pick one.
                const randomItem = items[Math.floor(Math.random() * items.length)];

                return {
                    name: type === 'meal' ? randomItem.strMeal : randomItem.strDrink,
                    image: type === 'meal' ? randomItem.strMealThumb : randomItem.strDrinkThumb,
                    id: type === 'meal' ? randomItem.idMeal : randomItem.idDrink,
                    area: country
                };
            }
        } catch (e) {
            console.warn(`Failed search for ${keyword}`, e);
        }
    }

    return null; // No matches found for any keyword
}

export async function getMealRecommendation(country, city) {
    let targetCountry = country;

    // 1. Infer Country if needed
    if (city) {
        const inferred = inferCountryFromText(city);
        if (inferred) targetCountry = inferred;
    }


    // 2. CHECK MANUAL SUPPLEMENTAL DB (Top Priority for missing/specific countries)
    if (MISSING_CUISINES[targetCountry] && MISSING_CUISINES[targetCountry].length > 0) {
        const manualList = MISSING_CUISINES[targetCountry];
        // Pick random
        const randomManual = manualList[Math.floor(Math.random() * manualList.length)];
        return randomManual;
    }

    // 3. Try Spoonacular First (Best Data)
    const spoon = await getSpoonacularRecipe(targetCountry);
    if (spoon) return spoon;

    // 3. Cultural Algorithm Search (Strict Profile)
    // Matches defined countries like Argentina, Spain, Germany
    const culturalMatch = await searchCulturalItem(targetCountry, 'meal');
    if (culturalMatch) return culturalMatch;

    // 4. Dynamic Name Search (The 'Magic' Step)
    // Tries to find meals tagged with the country name (e.g. "Kenyan Beef", "Moroccan Soup")
    try {
        const response = await fetch(`${MEAL_API_BASE}/search.php?s=${targetCountry}`);
        const data = await response.json();
        if (data.meals && data.meals.length > 0) {
            const randomMeal = data.meals[Math.floor(Math.random() * data.meals.length)];
            return {
                name: randomMeal.strMeal,
                image: randomMeal.strMealThumb,
                id: randomMeal.idMeal,
                area: targetCountry
            };
        }
    } catch (e) {
        console.warn(`Dynamic search failed for ${targetCountry}`);
    }

    // 5. Regional Fallback
    // If we don't know "Uruguay" but we know it's "SouthAmerica", try typical regional food
    const region = COUNTRY_TO_REGION[targetCountry];
    if (region) {
        const regionalMatch = await searchCulturalItem(region, 'meal');
        if (regionalMatch) {
            return { ...regionalMatch, area: 'Regional' };
        }
    }

    // 6. Ultimate Fallback (International Stadium Food)
    return {
        name: 'Hamburguesa de Estadio',
        image: 'https://www.themealdb.com/images/media/meals/ursuup1487348423.jpg',
        id: 'fallback-burger',
        area: 'Internacional'
    };
}

export async function getDrinkRecommendation(country = 'International') {
    // 1. Cultural Algorithm Search (TheCocktailDB)
    const culturalMatch = await searchCulturalItem(country, 'drink');
    if (culturalMatch) return culturalMatch;

    // 2. Ultimate Fallback (Beer)
    return {
        name: 'Cerveza Helada',
        image: 'https://www.thecocktaildb.com/images/media/drink/rwqxrv1461866023.jpg',
        id: 'fallback-beer',
        area: 'Internacional'
    };
}

export async function getNonAlcoholicDrinkRecommendation() {
    // Simple static for now, or could search "Cola", "Water", "Soda"
    try {
        const response = await fetch(`${COCKTAIL_API_BASE}/filter.php?a=Non_Alcoholic`);
        const data = await response.json();
        const drinks = data.drinks || [];
        const drink = drinks[Math.floor(Math.random() * drinks.length)];
        return {
            name: drink.strDrink,
            image: drink.strDrinkThumb,
            id: drink.idDrink,
            area: 'Sin Alcohol'
        };
    } catch (e) {
        return { name: 'Cola', image: '', id: 'coke' };
    }
}
