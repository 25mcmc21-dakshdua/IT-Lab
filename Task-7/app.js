var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// API Configuration
const API_KEY = '6fc1d74f81d73ba3d71b85c93c45e470'; // Replace with your OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherCard = document.getElementById('weatherCard');
const errorMessage = document.getElementById('errorMessage');
const loading = document.getElementById('loading');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const feelsLike = document.getElementById('feelsLike');
const celsiusBtn = document.getElementById('celsiusBtn');
const fahrenheitBtn = document.getElementById('fahrenheitBtn');
// State
let isCelsius = true;
let currentData = null;
// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Get weather for default city
    getWeather('London');
    // Event Listeners
    searchBtn.addEventListener('click', handleSearch);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter')
            handleSearch();
    });
    celsiusBtn.addEventListener('click', () => setTemperatureUnit(true));
    fahrenheitBtn.addEventListener('click', () => setTemperatureUnit(false));
});
// Event Handlers
function handleSearch() {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    }
}
function setTemperatureUnit(isCelsiusSelected) {
    isCelsius = isCelsiusSelected;
    celsiusBtn.classList.toggle('active', isCelsius);
    fahrenheitBtn.classList.toggle('active', !isCelsius);
    if (currentData) {
        updateWeatherDisplay(currentData);
    }
}
// API Functions
function getWeather(city) {
    return __awaiter(this, void 0, void 0, function* () {
        showLoading(true);
        hideError();
        try {
            const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
            const response = yield fetch(url);
            const data = yield response.json();
            // Check if response has error
            if ('cod' in data && data.cod !== 200) {
                const error = data;
                throw new Error(error.message || `Error ${String(error.cod)}`);
            }
            // Type guard to check if response is WeatherData
            if ('main' in data && 'weather' in data) {
                currentData = data;
                updateWeatherDisplay(currentData);
                showWeatherCard();
            }
            else {
                throw new Error('Invalid response format from API');
            }
        }
        catch (error) {
            console.error('Error fetching weather:', error);
            showError(error instanceof Error ? error.message : 'Failed to fetch weather data');
        }
        finally {
            showLoading(false);
        }
    });
}
// Display Functions
function updateWeatherDisplay(data) {
    cityName.textContent = data.name;
    const temp = isCelsius ? data.main.temp : celsiusToFahrenheit(data.main.temp);
    const feelsLikeTemp = isCelsius ? data.main.feels_like : celsiusToFahrenheit(data.main.feels_like);
    temperature.textContent = `${Math.round(temp)}°${isCelsius ? 'C' : 'F'}`;
    description.textContent = data.weather[0].description;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    feelsLike.textContent = `${Math.round(feelsLikeTemp)}°${isCelsius ? 'C' : 'F'}`;
}
function celsiusToFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
}
// UI Helper Functions
function showLoading(show) {
    loading.classList.toggle('show', show);
    if (show) {
        weatherCard.classList.remove('show');
    }
}
function showWeatherCard() {
    weatherCard.classList.add('show');
}
function showError(message) {
    errorMessage.textContent = `Error: ${message}`;
    errorMessage.classList.add('show');
    weatherCard.classList.remove('show');
}
function hideError() {
    errorMessage.classList.remove('show');
}
