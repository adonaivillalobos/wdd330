// Existing weather API code
const API_KEY = '0ef9b3125daa34f20b3cb5ddfd2c5de7';
const CITY = 'Berlin';
const LAT = 52.52;
const LON = 13.405;
const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}`;

document.addEventListener('DOMContentLoaded', () => {
    fetchWeather();
    fetchExchangeRates();
});

let currentDayIndex = 0;

// Fetch weather data
async function fetchWeather() {
    try {
        const response = await fetch(WEATHER_API_URL);
        if (!response.ok) throw new Error('Failed to fetch weather data');

        const data = await response.json();
        const dailyForecast = extractDailyForecast(data.list);
        displayWeather(dailyForecast);
    } catch (error) {
        console.error('Error fetching weather:', error);
        displayError(error.message);
    }
}

// Extract daily forecast
function extractDailyForecast(forecastList) {
    const dailyData = {};
    forecastList.forEach(entry => {
        const date = new Date(entry.dt * 1000).toLocaleDateString();
        if (!dailyData[date]) {
            dailyData[date] = entry;
        }
    });
    return Object.values(dailyData).slice(0, 10);
}

// Display weather
function displayWeather(forecast) {
    const weatherContainer = document.querySelector('.weather-info');
    weatherContainer.innerHTML = '<h3>10-Day Weather Forecast</h3>';
    displayNextSet(forecast, currentDayIndex);
}

// Display next set of weather data
function displayNextSet(forecast, index) {
    const weatherContainer = document.querySelector('.weather-info');
    for (let i = index; i < index + 3 && i < forecast.length; i++) {
        const day = forecast[i];
        const date = new Date(day.dt * 1000).toLocaleDateString();
        const temp = day.main.temp;
        const condition = day.weather[0].description;
        const windSpeed = day.wind.speed;
        const iconCode = day.weather[0].icon;

        const dayElement = document.createElement('div');
        dayElement.classList.add('weather-day');
        dayElement.innerHTML = `
            <p><strong>${date}</strong></p>
            <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="${condition}" />
            <p>Temp: ${temp}°C</p>
            <p>Condition: ${condition}</p>
            <p>Wind: ${windSpeed} km/h</p>
        `;

        dayElement.addEventListener('click', () => showModal(day));
        weatherContainer.appendChild(dayElement);
    }
}

// Display weather modal
function showModal(day) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <h3>${new Date(day.dt * 1000).toLocaleDateString()}</h3>
        <p>Temp: ${day.main.temp}°C</p>
        <p>Condition: ${day.weather[0].description}</p>
        <p>Wind: ${day.wind.speed} km/h</p>
        <button class="close-modal">Close</button>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

// Display error
function displayError(message) {
    const weatherContainer = document.querySelector('.weather-info');
    weatherContainer.innerHTML = `<p class="error">Sorry, something went wrong: ${message}</p>`;
}

// New Exchange API integration
const EXCHANGE_API_KEY = 'youb1265b001bb2dafece4695ee';

const EXCHANGE_API_URL = 'https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/EUR';

async function fetchExchangeRates() {
    try {
        const response = await fetch(EXCHANGE_API_URL);
        if (!response.ok) throw new Error('Failed to fetch exchange rates');

        const data = await response.json();
        displayExchangeRates(data.rates);
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
    }
}

// Display exchange rates
function displayExchangeRates(rates) {
    const exchangeContainer = document.querySelector('.exchange-info');
    if (!exchangeContainer) return;

    exchangeContainer.innerHTML = '<h3>Exchange Rates (EUR)</h3>';
    const importantRates = ['USD', 'GBP', 'JPY', 'AUD'];

    importantRates.forEach(currency => {
        const rate = rates[currency];
        const rateElement = document.createElement('div');
        rateElement.classList.add('exchange-rate');
        rateElement.textContent = `${currency}: ${rate}`;
        exchangeContainer.appendChild(rateElement);
    });
} 