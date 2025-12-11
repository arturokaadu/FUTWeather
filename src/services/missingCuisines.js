/**
 * SUPPLEMENTAL FOOD DATABASE
 * Manual entries for countries that are missing from TheMealDB API
 * to ensure high accuracy for major football nations.
 * 
 * Images from Unsplash (High Quality).
 */

export const MISSING_CUISINES = {
    'Germany': [
        {
            name: 'Schnitzel con Papas',
            image: 'https://images.unsplash.com/photo-1599921841143-819065a55cc6?q=80&w=800',
            id: 'local-de-schnitzel',
            area: 'Alemania'
        },
        {
            name: 'Currywurst & Pommes',
            image: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?q=80&w=800', // Best alt for currywurst
            id: 'local-de-currywurst',
            area: 'Alemania'
        },
        {
            name: 'Bratwurst Clásico',
            image: 'https://images.unsplash.com/photo-1524182576066-18a7a6543509?q=80&w=800',
            id: 'local-de-bratwurst',
            area: 'Alemania'
        },
        {
            name: 'Pretzel & Cerveza',
            image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800',
            id: 'local-de-pretzel',
            area: 'Alemania'
        }
    ],
    'England': [
        {
            name: 'Meat Pie & Mash',
            image: 'https://images.unsplash.com/photo-1572367572617-f08b1b24e127?q=80&w=800',
            id: 'local-uk-pie',
            area: 'Inglaterra'
        },
        {
            name: 'Fish & Chips',
            image: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?q=80&w=800',
            id: 'local-uk-fish',
            area: 'Inglaterra'
        },
        {
            name: 'Pinta de Lager & Burger',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800',
            id: 'local-uk-burger',
            area: 'Inglaterra'
        }
    ],
    'Spain': [
        {
            name: 'Bocadillo de Jamón',
            image: 'https://images.unsplash.com/photo-1626808642875-0aa545482dfb?q=80&w=800',
            id: 'local-es-bocadillo',
            area: 'España'
        },
        {
            name: 'Tapas & Caña',
            image: 'https://images.unsplash.com/photo-1535916707213-35f977fc2641?q=80&w=800',
            id: 'local-es-tapas',
            area: 'España'
        },
        {
            name: 'Pipas & Fútbol',
            image: 'https://images.unsplash.com/photo-1527751171053-6f6951171804?q=80&w=800', // Seeds representation
            id: 'local-es-pipas',
            area: 'España'
        }
    ],
    'Italy': [
        {
            name: 'Panino con Salamella',
            image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800', // Sausage sandwich
            id: 'local-it-salamella',
            area: 'Italia'
        },
        {
            name: 'Pizza al Trancio',
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800',
            id: 'local-it-pizza',
            area: 'Italia'
        },
        {
            name: 'Arancini Sicilianos',
            image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=800',
            id: 'local-it-arancini',
            area: 'Italia'
        }
    ],
    'France': [
        {
            name: 'Galette-Saucisse',
            image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800', // Reusing savory vibe
            id: 'local-fr-galette',
            area: 'Francia'
        },
        {
            name: 'Baguette Jambon-Beurre',
            image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800',
            id: 'local-fr-baguette',
            area: 'Francia'
        }
    ],
    'Brazil': [
        {
            name: 'Feijoada Completa',
            image: 'https://images.unsplash.com/photo-1626509689842-834c9c7f6ba6?q=80&w=800',
            id: 'local-br-feijoada',
            area: 'Brasil'
        },
        {
            name: 'Pão de Queijo',
            image: 'https://images.unsplash.com/photo-1596634629437-14280f9ae4f1?q=80&w=800',
            id: 'local-br-pao',
            area: 'Brasil'
        },
        {
            name: 'Churrasco Gaúcho',
            image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800',
            id: 'local-br-bbq',
            area: 'Brasil'
        }
    ],
    'Chile': [
        {
            name: 'Empanada de Pino',
            image: 'https://images.unsplash.com/photo-1626127391910-d0de991bc215?q=80&w=800',
            id: 'local-cl-empanada',
            area: 'Chile'
        },
        {
            name: 'Completo Italiano',
            image: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=800', // Hot dog generic but fits
            id: 'local-cl-completo',
            area: 'Chile'
        }
    ],
    'Colombia': [
        {
            name: 'Bandeja Paisa',
            image: 'https://images.unsplash.com/photo-1606756816408-56cb2f260477?q=80&w=800', // Closest robust plate
            id: 'local-co-bandeja',
            area: 'Colombia'
        },
        {
            name: 'Arepas con Queso',
            image: 'https://images.unsplash.com/photo-1629780653696-6e4695039d99?q=80&w=800',
            id: 'local-co-arepa',
            area: 'Colombia'
        }
    ],
    'Belgium': [
        {
            name: 'Papas Fritas Belgas',
            image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=800',
            id: 'local-be-fries',
            area: 'Bélgica'
        },
        {
            name: 'Waffles de Lieja',
            image: 'https://images.unsplash.com/photo-1562967167-9aa14e49cd0c?q=80&w=800',
            id: 'local-be-waffle',
            area: 'Bélgica'
        }
    ],
    'South Korea': [
        {
            name: 'Korean Fried Chicken',
            image: 'https://images.unsplash.com/photo-1626082927389-6cd09d6d9681?q=80&w=800',
            id: 'local-kr-chicken',
            area: 'Corea del Sur'
        },
        {
            name: 'Bibimbap',
            image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=800',
            id: 'local-kr-bibimbap',
            area: 'Corea del Sur'
        }
    ]
};
