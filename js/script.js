const API_KEY = '0ef9b3125daa34f20b3cb5ddfd2c5de7';
const CITY = 'Berlin';
const LAT = 52.52;
const LON = 13.405;
const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}`;

document.addEventListener('DOMContentLoaded', fetchWeather);

async function fetchWeather() {
    try {
        const response = await fetch(WEATHER_API_URL);
        if (!response.ok) throw new Error('Failed to fetch weather data');
        
        const data = await response.json();
        const dailyForecast = extractDailyForecast(data.list);
        displayWeather(dailyForecast);
    } catch (error) {
        console.error('Error fetching weather:', error);
    }
}

function extractDailyForecast(forecastList) {
    const dailyData = {};
    
    forecastList.forEach(entry => {
        const date = new Date(entry.dt * 1000).toLocaleDateString();
        if (!dailyData[date]) {
            dailyData[date] = entry; // Store first entry of each day
        }
    });
    
    return Object.values(dailyData).slice(0, 10); // Get only 10 unique days
}

function displayWeather(forecast) {
    const weatherContainer = document.querySelector('.weather-info');
    weatherContainer.innerHTML = '<h3>10-Day Weather Forecast</h3>';
    
    forecast.forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString();
        const temp = day.main.temp;
        const condition = day.weather[0].description;
        const windSpeed = day.wind.speed;
        
        const dayElement = document.createElement('div');
        dayElement.classList.add('weather-day');
        dayElement.innerHTML = `
            <p><strong>${date}</strong></p>
            <p>Temp: ${temp}°C</p>
            <p>Condition: ${condition}</p>
            <p>Wind: ${windSpeed} km/h</p>
        `;
        
        weatherContainer.appendChild(dayElement);
    });
}