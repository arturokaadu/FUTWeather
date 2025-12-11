const https = require('https');

const key = 'aedee0444e3eb70c768523e7c719e10c';

function test(url, headers, name) {
    console.log(`Testing ${name}...`);
    const req = https.request(url, { method: 'GET', headers: headers }, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            console.log(`[${name}] Status: ${res.statusCode}`);
            if (res.statusCode === 200) {
                console.log(`[${name}] SUCCESS!`);
                console.log(data.substring(0, 100));
            } else {
                console.log(`[${name}] FAILED.`);
                console.log(data.substring(0, 100));
            }
        });
    });
    req.on('error', (e) => console.log(`[${name}] Error: ${e.message}`));
    req.end();
}

// Test 1: Direct API-Sports
test('https://v3.football.api-sports.io/status', {
    'x-apisports-key': key
}, 'DIRECT');

// Test 2: RapidAPI
test('https://api-football-v1.p.rapidapi.com/v3/status', {
    'x-rapidapi-key': key,
    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
}, 'RAPIDAPI');
