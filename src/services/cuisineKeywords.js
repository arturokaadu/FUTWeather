/**
 * CUISINE KEYWORDS CONFIGURATION
 * 
 * Instead of hardcoding static data, we define "Search Keywords" 
 * that will be used to DYNAMICALLY fetch real recipes from the API.
 * 
 * This makes the system scalable: to add a country, just add keywords.
 */

export const CUISINE_KEYWORDS = {
    'Germany': ['Sausage', 'Pork', 'Potato', 'Beef'],
    'Brazil': ['Bean', 'Pork', 'Rice', 'Beef'],
    'South Korea': ['Chicken', 'Beef', 'Rice', 'Stew'],
    'Chile': ['Beef', 'Pork', 'Corn'],
    'Colombia': ['Corn', 'Pork', 'Beef'],
    'Belgium': ['Potato', 'Chocolate', 'Beef'],
    'Uruguay': ['Beef', 'Pork'],
    'Peru': ['Chicken', 'Fish', 'Potato'],
    'Sweden': ['Fish', 'Pork', 'Potato'],
    'Switzerland': ['Cheese', 'Potato'],
    'Austria': ['Pork', 'Beef'],
    'Denmark': ['Pork', 'Fish'],
    'Ukraine': ['Chicken', 'Pork'],
    'Russia': ['Beef', 'Pork', 'Potato'],
    'Czech Republic': ['Pork', 'Sausage', 'Duck'],
    'Ecuador': ['Rice', 'Chicken', 'Potato'],
    'International': ['Burger', 'Fries', 'Hot Dog'],
    // Add more as needed
};
