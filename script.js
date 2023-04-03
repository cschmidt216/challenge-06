const APIkey = "8393c34c85fc484cc3f536aeb531b29c";

const searchForm = document.querySelector('form');
const searchInput = document.querySelector('#search');
const currentWeather = document.querySelector('#current-weather');
const forecast = document.querySelector('#forecast');

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const searchTerm = searchInput.value;
  getWeather(searchTerm);
});

async function getWeather(searchTerm) {
  const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&units=imperial&appid=${APIkey}`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${searchTerm}&units=imperial&appid=${APIkey}`;

  try {
    const currentWeatherResponse = await fetch(currentWeatherURL);
    const currentWeatherData = await currentWeatherResponse.json();

    const forecastResponse = await fetch(forecastURL);
    const forecastData = await forecastResponse.json();

    showWeather(currentWeatherData, forecastData);
  } catch (error) {
    console.error(error);
  }
}

function showWeather(currentWeatherData, forecastData) {
  // Show current weather
  const temperature = Math.round(currentWeatherData.main.temp);
  const description = currentWeatherData.weather[0].description;
  const cityName = currentWeatherData.name;
  const countryName = currentWeatherData.sys.country;
  const windSpeed = currentWeatherData.wind.speed;
  const humidity = currentWeatherData.main.humidity;

  currentWeather.innerHTML = `
    <h2>${cityName}, ${countryName}</h2>
    <p>${description}</p>
    <p>Temperature: ${temperature}°F</p>
    <p>Wind Speed: ${windSpeed} mph</p>
    <p>Humidity: ${humidity}%</p>
  `;

  // Show forecast
  const forecastDays = forecastData.list.filter((weather) => weather.dt_txt.includes('12:00:00'));
  forecast.innerHTML = '';

  forecastDays.forEach((day) => {
    const dayName = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
    const temperature = Math.round(day.main.temp);
    const iconURL = `https://openweathermap.org/img/w/${day.weather[0].icon}.png`;
    const windSpeed = day.wind.speed;
    const humidity = day.main.humidity;

    const forecastDay = document.createElement('div');
    forecastDay.classList.add('forecast-day');
    forecastDay.innerHTML = `
      <h2>${dayName}</h2>
      <img src="${iconURL}" alt="${day.weather[0].description}">
      <p>Temperature: ${temperature}°F</p>
      <p>Wind Speed: ${windSpeed} mph</p>
      <p>Humidity: ${humidity}%</p>
    `;

    forecast.appendChild(forecastDay);
  });

  // Show weather info container
  const weatherInfo = document.querySelector('#weather-info');
  weatherInfo.style.display = 'block';
}
