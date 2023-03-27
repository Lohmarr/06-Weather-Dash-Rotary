const searchForm = document.querySelector('#search-form');
const cityInput = document.querySelector('#city-input');
const currentWeather = document.querySelector('#current-weather');
const forecast = document.querySelector('#forecast');
const searchHistory = document.querySelector('#search-history');

const apiKey = '8815fa9153dba675fe64e2b5f006967b';

// City User Input
function search() {
  event.preventDefault();

  let city = cityInput.value.toUpperCase().trim();

  if (city === '') {
    alert('Please enter a city name');
    return;
  }

  addToSearchHistory(city);

  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data.list[0]);

      displayForecast(data.list.filter((data, index) => index % 8 === 0));
    })
    .catch(error => console.error(error));
}

searchForm.addEventListener('submit', (event) => {
  search()
});

// display current weather
function displayCurrentWeather(weatherData) {
  let cityName = cityInput.value.toUpperCase()

  let html = `
    <h2>${cityName} (${weatherData.dt_txt}) <img src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" alt="${weatherData.weather[0].description}"></h2>
    <p>Temperature: ${weatherData.main.temp} °F</p>
    <p>Humidity: ${weatherData.main.humidity}%</p>
    <p>Wind Speed: ${weatherData.wind.speed} m/s</p>
  `;
  currentWeather.innerHTML = html;
}

// display 5-day forecast
function displayForecast(forecastData) {
  let html = '<h2>5-Day Forecast</h2>';
  forecastData.forEach(data => {
    html += `
      <div>
        <p>Date: ${data.dt_txt}</p>
        <p>Temperature: ${data.main.temp} °F</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
      </div>
    `;
  });
  forecast.innerHTML = html;
}

// add city to search history
function addToSearchHistory(city) {
  let searchStorage = JSON.parse(localStorage.getItem('searchHistory')) || [];

  if (!searchStorage.includes(city)) {
    searchStorage.push(city.toUpperCase());
    localStorage.setItem('searchHistory', JSON.stringify(searchStorage));

    let html = `<li class='city-button'><button>${city}</button></li>`;
    searchHistory.innerHTML += html;
  }

  let cityButtons = document.querySelectorAll('.city-button');

  cityButtons.forEach(button => {
    button.addEventListener('click', () => {
      cityInput.value = button.textContent;
      search()
    });
  });
}

// load search history from local storage
if (localStorage.getItem('searchHistory')) {
  let searchStorage = JSON.parse(localStorage.getItem('searchHistory')) || []

  searchStorage.forEach(city => {
    let html = `<li class='city-button'><button>${city}</button></li>`;
    searchHistory.innerHTML += html;
  })

  let cityButtons = document.querySelectorAll('.city-button');

  cityButtons.forEach(button => {
    button.addEventListener('click', () => {
      cityInput.value = button.textContent;
      search()
    });
})}
