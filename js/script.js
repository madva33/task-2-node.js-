const form = document.getElementById('weatherForm');
const addressInput = document.getElementById('address');
const message = document.getElementById('message');
const result = document.getElementById('result');
const locationF = document.getElementById('location');
const latitudeF = document.getElementById('latitude');
const longitudeF = document.getElementById('longitude');
const conditionF = document.getElementById('condition');
const temperatureF = document.getElementById('temperature');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const address = addressInput.value.trim();
    if (!address) return;

    result.hidden = true;
    message.textContent = 'Loading...';

    try {
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(address)}&count=1&language=en&format=json`);
        if (!geoResponse.ok) throw new Error('Geocoding request failed');

        const geoData = await geoResponse.json();
        if (!geoData.results || geoData.results.length === 0) {
            message.textContent = 'Unable to find location';
            return;
        }

        const location = geoData.results[0];
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,weather_code&timezone=auto`);
        if (!weatherResponse.ok) throw new Error('Weather request failed');

        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        locationF.textContent = `Location: ${location.name}, ${location.country}`;
        latitudeF.textContent = `Latitude: ${location.latitude}`;
        longitudeF.textContent = `Longitude: ${location.longitude}`;
        conditionF.textContent = `Condition: ${weatherCondition(current.weather_code)}`;
        temperatureF.textContent = `Temperature: ${current.temperature_2m}°C`;

        message.textContent = '';
        result.hidden = false;
    } catch (error) {
        console.error(error);
        message.textContent = 'Something went wrong. Please try again.';
    }
});

function weatherCondition(code) {
    if (code === 0) return 'Clear sky';
    if ([1, 2, 3].includes(code)) return 'Cloudy';
    if ([45, 48].includes(code)) return 'Fog';
    if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle';
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rain';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snow';
    if ([95, 96, 99].includes(code)) return 'Thunderstorm';
    return 'Unknown';
}
