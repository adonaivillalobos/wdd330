const API_KEY = '0ef9b3125daa34f20b3cb5ddfd2c5de7';
const CITY = 'Berlin';
const LAT = 52.52;
const LON = 13.405;
const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}`;

document.addEventListener('DOMContentLoaded', fetchWeather);

let currentDayIndex = 0; // To track the currently loaded set of days

// Fetch weather data from the API
async function fetchWeather() {
    try {
        const response = await fetch(WEATHER_API_URL);
        if (!response.ok) throw new Error('Failed to fetch weather data');
        
        const data = await response.json();
        const dailyForecast = extractDailyForecast(data.list);
        displayWeather(dailyForecast);
    } catch (error) {
        console.error('Error fetching weather:', error);
        displayError(error.message); // Show error to user
    }
}

// Extract unique daily forecast data
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

// Display the weather data on the page
function displayWeather(forecast) {
    const weatherContainer = document.querySelector('.weather-info');
    weatherContainer.innerHTML = '<h3>10-Day Weather Forecast</h3>';
    
    // Display a set of 3 days initially
    displayNextSet(forecast, currentDayIndex);
}

// Display the next set of days (3 at a time)
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
        
        // Add click event for modal display
        dayElement.addEventListener('click', () => showModal(day));

        weatherContainer.appendChild(dayElement);
    }
}

// Display a modal with detailed weather information when a day is clicked
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

    const closeModalButton = modal.querySelector('.close-modal');
    closeModalButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

// Show an error message to the user if the fetch fails
function displayError(message) {
    const weatherContainer = document.querySelector('.weather-info');
    weatherContainer.innerHTML = `<p class="error">Sorry, something went wrong: ${message}</p>`;
}