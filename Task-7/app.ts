// API Configuration
const API_KEY = '6fc1d74f81d73ba3d71b85c93c45e470'; // Replace with your OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Type Definitions
interface WeatherData {
    name: string;
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
    };
    weather: {
        main: string;
        description: string;
    }[];
    wind: {
        speed: number;
    };
}

interface ErrorResponse {
    message: string;
    cod: string | number;
}

type ApiResponse = WeatherData | ErrorResponse;

// DOM Elements
const cityInput = document.getElementById('cityInput') as HTMLInputElement;
const searchBtn = document.getElementById('searchBtn') as HTMLButtonElement;
const weatherCard = document.getElementById('weatherCard') as HTMLDivElement;
const errorMessage = document.getElementById('errorMessage') as HTMLDivElement;
const loading = document.getElementById('loading') as HTMLDivElement;

const cityName = document.getElementById('cityName') as HTMLHeadingElement;
const temperature = document.getElementById('temperature') as HTMLDivElement;
const description = document.getElementById('description') as HTMLDivElement;
const humidity = document.getElementById('humidity') as HTMLSpanElement;
const windSpeed = document.getElementById('windSpeed') as HTMLSpanElement;
const feelsLike = document.getElementById('feelsLike') as HTMLSpanElement;

const celsiusBtn = document.getElementById('celsiusBtn') as HTMLButtonElement;
const fahrenheitBtn = document.getElementById('fahrenheitBtn') as HTMLButtonElement;

// State
let isCelsius = true;
let currentData: WeatherData | null = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Get weather for default city
    getWeather('London');
    
    // Event Listeners
    searchBtn.addEventListener('click', handleSearch);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    celsiusBtn.addEventListener('click', () => setTemperatureUnit(true));
    fahrenheitBtn.addEventListener('click', () => setTemperatureUnit(false));
});

// Event Handlers
function handleSearch(): void {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    }
}

function setTemperatureUnit(isCelsiusSelected: boolean): void {
    isCelsius = isCelsiusSelected;
    celsiusBtn.classList.toggle('active', isCelsius);
    fahrenheitBtn.classList.toggle('active', !isCelsius);
    
    if (currentData) {
        updateWeatherDisplay(currentData);
    }
}

// API Functions
async function getWeather(city: string): Promise<void> {
    showLoading(true);
    hideError();
    
    try {
        const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);
        const data: ApiResponse = await response.json();
        
        // Check if response has error
        if ('cod' in data && data.cod !== 200) {
            const error = data as ErrorResponse;
            throw new Error(error.message || `Error ${String(error.cod)}`);
        }
        
        // Type guard to check if response is WeatherData
        if ('main' in data && 'weather' in data) {
            currentData = data as WeatherData;
            updateWeatherDisplay(currentData);
            showWeatherCard();
        } else {
            throw new Error('Invalid response format from API');
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
        showError(error instanceof Error ? error.message : 'Failed to fetch weather data');
    } finally {
        showLoading(false);
    }
}

// Display Functions
function updateWeatherDisplay(data: WeatherData): void {
    cityName.textContent = data.name;
    
    const temp = isCelsius ? data.main.temp : celsiusToFahrenheit(data.main.temp);
    const feelsLikeTemp = isCelsius ? data.main.feels_like : celsiusToFahrenheit(data.main.feels_like);
    
    temperature.textContent = `${Math.round(temp)}°${isCelsius ? 'C' : 'F'}`;
    description.textContent = data.weather[0].description;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    feelsLike.textContent = `${Math.round(feelsLikeTemp)}°${isCelsius ? 'C' : 'F'}`;
}

function celsiusToFahrenheit(celsius: number): number {
    return (celsius * 9/5) + 32;
}

// UI Helper Functions
function showLoading(show: boolean): void {
    loading.classList.toggle('show', show);
    if (show) {
        weatherCard.classList.remove('show');
    }
}

function showWeatherCard(): void {
    weatherCard.classList.add('show');
}

function showError(message: string): void {
    errorMessage.textContent = `Error: ${message}`;
    errorMessage.classList.add('show');
    weatherCard.classList.remove('show');
}

function hideError(): void {
    errorMessage.classList.remove('show');
}