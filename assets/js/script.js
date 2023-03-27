const searchForm = document.querySelector('#search-form');
const cityInput = document.querySelector('#city-input');
const currentWeather = document.querySelector('#current-weather');
const forecast = document.querySelector('#forecast');
const searchHistory = document.querySelector('#search-history');

let apiKey = '8815fa9153dba675fe64e2b5f006967b';

// handle form submission
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  let city = cityInput.value.trim();

  // check if city is empty
  if (city === '') {
    alert('Please enter a city name');
    return;
  }

  // clear search input
  cityInput.value = '';

  // add city to search history
  addToSearchHistory(city);

  // make API request
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`)
    .then(response => response.json())
    .then(data => {
        console.log(data)
      // display current weather
      displayCurrentWeather(data.list[0]);

      // display 5-day forecast
      displayForecast(data.list.slice(1, 6));
    })
    .catch(error => console.error(error));
});

// display current weather
function displayCurrentWeather(weatherData) {
  let html = `
    <h2>${weatherData.name} (${new Date(weatherData.dt * 1000).toLocaleDateString()}) <img src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" alt="${weatherData.weather[0].description}"></h2>
    <p>Temperature: ${weatherData.main.temp} &#8451;</p>
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
        <p>Date: ${new Date(data.dt * 1000).toLocaleDateString()}</p>
        <p>Temperature: ${data.main.temp} &#8451;</p>
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
  let html = `<li><button>${city}</button></li>`;
  searchHistory.innerHTML += html;

  // add event listener to search history button
  let lastCityButton = searchHistory.lastElementChild.querySelector('button');
  lastCityButton.addEventListener('click', () => {
    // simulate form submission with city name
    cityInput.value = lastCityButton.textContent;
    searchForm.dispatchEvent(new Event('submit'));
  });

  // save search history to local storage
  localStorage.setItem('searchHistory', searchHistory.innerHTML);
}

// load search history from local storage
if (localStorage.getItem('searchHistory')) {
  searchHistory.innerHTML = localStorage.getItem('searchHistory');
}
