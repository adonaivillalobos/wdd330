const apiKey = "0ef9b3125daa34f20b3cb5ddfd2c5de7"; 
const city = "Berlin";
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}`;

async function fetchWeather() {
    try {
        const response = await fetch(weatherUrl);
        if (!response.ok) throw new Error("Weather data not found");

        const data = await response.json();

        // Update the weather information on the page
        document.getElementById("temp").textContent = `${data.main.temp}°C`;
        document.getElementById("condition").textContent = data.weather[0].description;
        document.getElementById("wind-speed").textContent = `${data.wind.speed} km/h`;
    } catch (error) {
        console.error("Error fetching weather:", error);
        document.querySelector(".weather-info").textContent = "Weather information is currently unavailable.";
    }
}

document.addEventListener("DOMContentLoaded", fetchWeather);
