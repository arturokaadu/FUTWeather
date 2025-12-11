/**
 * SPOONACULAR API SERVICE
 * The Gold Standard for Food Data.
 * 
 * Replaces TheMealDB to provide accurate, dynamic, cuisine-specific results.
 * 
 * NOTE: Requires an API Key. We are using a temporary placeholder logic 
 * that mimics the structure for now, but to be truly dynamic for ALL dishes,
 * the user needs to provide a Spoonacular API Key in .env.
 */

const SPOON_API_BASE = 'https://api.spoonacular.com/recipes/complexSearch';
// USER SHOULD ADD COMPLETED KEY HERE OR IN .ENV
// For dev purposes, we might fallback if key is missing
const API_KEY = process.env.REACT_APP_SPOONACULAR_KEY || 'demo-key';

// Cultural mapping to Spoonacular Cuisine Types
const COUNTRY_TO_CUISINE = {
    'Germany': 'German',
    'Italy': 'Italian',
    'Spain': 'Spanish',
    'France': 'French',
    'England': 'British',
    'USA': 'American',
    'Mexico': 'Mexican',
    'India': 'Indian',
    'Thailand': 'Thai',
    'Japan': 'Japanese',
    'China': 'Chinese',
    'Korea': 'Korean',
    'Vietnam': 'Vietnamese',
    'Greece': 'Greek',
    'Ireland': 'Irish'
};

/**
 * Fetch a recipe from Spoonacular by Cuisine or Query
 */
export async function getSpoonacularRecipe(country, query = '') {
    const cuisine = COUNTRY_TO_CUISINE[country];

    // Construct URL for specific cuisine or keyword
    // addRecipeInformation=true to get images and IDs
    // number=1 to get one random result (logic handled by offset usually, or simple random sort)
    // sort=random ensures we get different things every time

    let url = `${SPOON_API_BASE}?apiKey=${API_KEY}&addRecipeInformation=true&number=1&sort=random`;

    if (cuisine) {
        url += `&cuisine=${cuisine}`;
    } else if (query) {
        url += `&query=${query}`;
    } else {
        // Fallback for generic
        url += `&cuisine=American`;
    }

    try {
        const response = await fetch(url);

        // Spoonacular Error Handling (Quota/Key)
        if (response.status === 402 || response.status === 401) {
            console.warn("Spoonacular Quota Exceeded or Invalid Key. Switching to Mock Fallback.");
            return null; // Signal to use fallback
        }

        const data = await response.json();
        const recipe = data.results && data.results[0];

        if (recipe) {
            return {
                name: recipe.title,
                image: recipe.image,
                id: recipe.id,
                area: cuisine || country
            };
        }
    } catch (error) {
        console.error("Spoonacular API Error:", error);
    }

    return null;
}
