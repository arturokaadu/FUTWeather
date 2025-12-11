/**
 * CULTURAL PROFILE CONFIGURATION
 * 
 * Defines the "Search Strategy" for each country.
 * The Algorithm will try keywords in order until a match is found.
 * 
 * Structure:
 * - food: [Priority 1, Priority 2, Fallback]
 * - drink: [Priority 1, Priority 2, Fallback]
 * 
 * DATA VALIDATED AGAINST TheMealDB & TheCocktailDB availability.
 */

export const CULTURAL_PROFILE = {
    'Argentina': {
        food: ['Empanadas', 'Steak', 'Parilla', 'Chimichurri', 'Beef'],
        drink: ['Malbec', 'Red Wine', 'Fernet', 'Tea']
    },
    'Germany': {
        food: ['Sausage', 'Pork', 'Potato', 'Beef'], // 'Schnitzel' lacks data, 'Sausage' is reliable
        drink: ['Beer', 'Lager', 'Ale', 'Kirsch']
    },
    'Spain': {
        food: ['Paella', 'Tapas', 'Tortilla', 'Pork'],
        drink: ['Sangria', 'Wine', 'Sherry', 'Beer']
    },
    'Italy': {
        food: ['Pizza', 'Pasta', 'Risotto', 'Lasagna'],
        drink: ['Spritz', 'Negroni', 'Wine', 'Espresso']
    },
    'England': {
        food: ['Pie', 'Beef', 'Fish', 'English'],
        drink: ['Ale', 'Beer', 'Tea', 'Gin']
    },
    'Brazil': {
        food: ['Bean', 'Rice', 'Beef', 'Pork'], // Feijoada components
        drink: ['Caipirinha', 'Lime', 'Beer']
    },
    'France': {
        food: ['Duck', 'Beef', 'Chicken', 'Omelette'],
        drink: ['Wine', 'Champagne', 'Brandy']
    },
    'Mexico': {
        food: ['Tacos', 'Burrito', 'Chili', 'Salsa'],
        drink: ['Tequila', 'Margarita', 'Beer', 'Corona']
    },
    'USA': {
        food: ['Burger', 'Hot Dog', 'BBQ', 'Steak'],
        drink: ['Cola', 'Beer', 'Whiskey']
    },
    'Japan': {
        food: ['Sushi', 'Teriyaki', 'Ramen', 'Chicken'],
        drink: ['Sake', 'Tea', 'Whiskey']
    },
    'China': {
        food: ['Duck', 'Pork', 'Chicken', 'Rice'],
        drink: ['Tea', 'Beer']
    },
    'Portugal': {
        food: ['Fish', 'Pork', 'Chicken'],
        drink: ['Port', 'Wine']
    },
    'Netherlands': {
        food: ['Pork', 'Potato', 'Cheese'],
        drink: ['Beer', 'Gin']
    },
    'Russia': {
        food: ['Beef', 'Pork', 'Potato'],
        drink: ['Vodka', 'Tea']
    },
    'Czech Republic': {
        food: ['Pork', 'Sausage', 'Duck'],
        drink: ['Beer', 'Pilsner']
    },
    'Ecuador': {
        food: ['Chicken', 'Rice', 'Potato'],
        drink: ['Beer', 'Fruit']
    },
    'Colombia': {
        food: ['Chicken', 'Pork', 'Corn'],
        drink: ['Coffee', 'Beer']
    },
    'Chile': {
        food: ['Beef', 'Corn', 'Fish'],
        drink: ['Wine', 'Pisco']
    },
    'Peru': {
        food: ['Chicken', 'Fish', 'Potato'],
        drink: ['Pisco', 'Sour']
    },
    'Uruguay': {
        food: ['Steak', 'Beef', 'Sandwich'],
        drink: ['Wine', 'Tea']
    },
    // Generic Fallback for unknown
    // Generic Fallback for unknown
    'International': {
        food: ['Burger', 'Fries', 'Pizza', 'Sandwich'],
        drink: ['Beer', 'Cola', 'Water']
    },

    // REGIONAL PROFILES (Last Resort before International)
    'Region_SouthAmerica': {
        food: ['Empanadas', 'Steak', 'Arepa', 'Rice'],
        drink: ['Beer', 'Wine', 'Fruit']
    },
    'Region_Europe': {
        food: ['Sausage', 'Stew', 'Potato', 'Fish'],
        drink: ['Beer', 'Wine']
    },
    'Region_Asia': {
        food: ['Rice', 'Noodle', 'Chicken', 'Curry'],
        drink: ['Tea', 'Sake', 'Beer']
    },
    'Region_Africa': {
        food: ['Stew', 'Rice', 'Chicken', 'Cassava'],
        drink: ['Beer', 'Tea', 'Ginger']
    },
    'Region_MiddleEast': {
        food: ['Kebab', 'Hummus', 'Falafel', 'Lamb'],
        drink: ['Tea', 'Ayran', 'Coffee']
    }
};

export const COUNTRY_TO_REGION = {
    'Uruguay': 'Region_SouthAmerica',
    'Paraguay': 'Region_SouthAmerica',
    'Bolivia': 'Region_SouthAmerica',
    'Venezuela': 'Region_SouthAmerica',

    'Belgium': 'Region_Europe',
    'Austria': 'Region_Europe',
    'Switzerland': 'Region_Europe',
    'Sweden': 'Region_Europe',
    'Denmark': 'Region_Europe',
    'Norway': 'Region_Europe',
    'Poland': 'Region_Europe',
    'Ukraine': 'Region_Europe',
    'Croatia': 'Region_Europe',
    'Serbia': 'Region_Europe',

    'Vietnam': 'Region_Asia',
    'Thailand': 'Region_Asia',
    'Korea': 'Region_Asia',
    'South Korea': 'Region_Asia',
    'Indonesia': 'Region_Asia',
    'Malaysia': 'Region_Asia',

    'Morocco': 'Region_Africa',
    'Egypt': 'Region_Africa',
    'Nigeria': 'Region_Africa',
    'Senegal': 'Region_Africa',
    'Cameroon': 'Region_Africa',
    'Ivory Coast': 'Region_Africa',

    'Turkey': 'Region_MiddleEast',
    'Saudi Arabia': 'Region_MiddleEast',
    'Iran': 'Region_MiddleEast',
    'Qatar': 'Region_MiddleEast'
};
