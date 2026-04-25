import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState('London');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = '47d33a1397d6b17ff27417e4ccaea55d';

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError('');
    
    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
      );
      
      if (!weatherRes.ok) throw new Error('City not found');
      
      const weatherData = await weatherRes.json();
      setWeather(weatherData);

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${API_KEY}`
      );
      const forecastData = await forecastRes.json();
      
      const dailyForecast = forecastData.list.filter((_, index) => index % 8 === 0);
      setForecast(dailyForecast);
      
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCity(searchInput);
      fetchWeather(searchInput);
      setSearchInput('');
    }
  };

  return (
    <div className="container">
      <h1>Weather App</h1>
      
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Enter city name"
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      
      {error && <p className="error">{error}</p>}

      {weather && !loading && (
        <div className="weather-card">
          <h2>{weather.name}, {weather.sys.country}</h2>
          <div className="weather-main">
            <img 
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
              alt={weather.weather[0].description}
            />
            <div>
              <p className="temp">{Math.round(weather.main.temp)}°C</p>
              <p className="description">{weather.weather[0].description}</p>
            </div>
          </div>
          <div className="details">
            <p>Humidity: {weather.main.humidity}%</p>
            <p>Feels like: {Math.round(weather.main.feels_like)}°C</p>
            <p>Wind: {weather.wind.speed} m/s</p>
          </div>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="forecast">
          <h3>5-Day Forecast</h3>
          <div className="forecast-list">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-day">
                <p>{new Date(day.dt * 1000).toLocaleDateString('en', { weekday: 'short' })}</p>
                <img 
                  src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`} 
                  alt={day.weather[0].description}
                />
                <p>{Math.round(day.main.temp)}°C</p>
                <p>{day.weather[0].main}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
