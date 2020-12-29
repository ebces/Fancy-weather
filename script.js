import {
  namesOfDaysEn, monthsNamesEn, namesOfDaysRu, monthsNamesRu, coordinateNames,
} from './translatedNames';

const urlToPictures = 'https://api.unsplash.com/photos/random?query=morning&client_id=e2077ad31a806c894c460aec8f81bc2af4d09c4f8104ae3177bb809faf0eac17';
const celsiusBadge = 'C';
const farenheitBadge = 'F';
const { body } = document;
const refreshButton = document.querySelector('.control__button--refresh');
const controlButtonsTemperature = document.querySelectorAll('.control__button--temperature');
const celsiusButton = document.querySelector('.control__button--celsius');
const farenheitButton = document.querySelector('.control__button--farenheit');
const latitude = document.querySelector('.location__coordinates--latitude');
const longitude = document.querySelector('.location__coordinates--longitude');
const temperatureNow = document.querySelector('.weather__temperature');
const forecastTemperature = document.querySelectorAll('.weather__forecast-temperature');
const forecastNamesOfDays = document.querySelectorAll('.weather__day');
const weatherDescriptions = document.querySelectorAll('.weather__text');
const weatherNowImage = document.querySelector('.weather__image');
const weatherForecastImages = document.querySelectorAll('.weather__forecast-image');
const dateString = document.querySelector('.weather__date');
const searchField = document.querySelector('.search__input');
const searchButton = document.querySelector('.search__button');
const cityAndCountry = document.querySelector('.weather__city');
const languageButtons = document.querySelector('.control__button--languages');
const activeLanguageButton = document.querySelector('.control__button--active-language');
const notActiveLanguageButtons = document.querySelectorAll('.control__button--not-active-language');

const languages = ['EN', 'RU'];
let language = localStorage.getItem('language') || languages[0];
let timeInterval;
let localTimeShift;

let startDate = new Date().toDateString();
let day = new Date().getDay();
let date = new Date().getDate();
let month = new Date().getMonth();

const getServicesData = async () => {
  let weatherData;
  let forecastData;
  let countryData;

  try {
    const ipResponse = await fetch('https://ipinfo.io/json?token=eb5b90bb77d46a');
    const ipData = await ipResponse.json();
    const cityName = searchField.value.length ? searchField.value : ipData.city;
    const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=${language}&appid=489c6e3b9c228bd88ea6333b1a07dfef`);
    weatherData = await weatherResponse.json();

    if (weatherData.cod === '404') {
      throw weatherData.message;
    }

    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&exclude={part}&appid=489c6e3b9c228bd88ea6333b1a07dfef`);
    forecastData = await forecastResponse.json();
    const countryResponse = await fetch(`https://htmlweb.ru/geo/api.php?country=${weatherData.sys.country}&info&json&api_key=5ac6345ea632dcf4b4f242a291d9194a`);
    countryData = await countryResponse.json();
  } catch (e) {
    alert(e);
  }

  return { weatherData, forecastData, countryData };
};

if (localStorage.getItem('temperature') === farenheitBadge) {
  farenheitButton.classList.add('control__button--active');
} else {
  celsiusButton.classList.add('control__button--active');
}

const changeLanguage = () => {
  activeLanguageButton.textContent = language;
  const restLanguages = languages.filter((elem) => elem !== language);

  for (let i = 0; i < notActiveLanguageButtons.length; i += 1) {
    notActiveLanguageButtons[i].textContent = restLanguages[i];
  }
};

changeLanguage();

const MILLISECONDS_IN_SECOND = 1000;

const kelvinToCelsius = (kelvin) => `${(kelvin - 273.15).toFixed()}&deg;C`;
const kelvinToFahrenheit = (kelvin) => `${(((kelvin - 273.15) * 9) / 5 + 32).toFixed()}&deg;F`;

const getDateString = (daysNames, monthsNames, timeShift) => {
  const nowDate = new Date();
  const millisecondsUTC = nowDate.getTime() - localTimeShift;
  const newCountryMilliseconds = new Date(millisecondsUTC + timeShift * MILLISECONDS_IN_SECOND);
  const time = newCountryMilliseconds.toLocaleTimeString();

  if (startDate !== newCountryMilliseconds.toDateString()) {
    startDate = newCountryMilliseconds.toDateString();
    day = newCountryMilliseconds.getDay();
    date = newCountryMilliseconds.getDate();
    month = newCountryMilliseconds.getMonth();
  }
  const nameOfMonth = monthsNames[month];
  const nameOfday = Array.isArray(daysNames[day]) ? namesOfDaysRu[day][1]
    : namesOfDaysEn[day].slice(0, 3);

  return `${nameOfday} ${date} ${nameOfMonth} ${time}`;
};

const getLinkToImage = async () => {
  const response = await fetch(urlToPictures);
  const data = await response.json();

  return data.urls.regular;
};

const getCityNameRu = ({ name }, { country }) => (country ? `${name}, ${country.name}` : name);

const getCityNameEn = ({ name }, { english }) => (english ? `${name}, ${english}` : name);

const printNowWeather = (tempFunc, feelsStr, windStr, windSpeedStr, humidityStr, weatherObject) => {
  const [weatherType, weatherFeels, weatherWind, weatherHumidity] = weatherDescriptions;
  weatherType.textContent = weatherObject.weather[0].description.toUpperCase();
  weatherFeels.innerHTML = `${feelsStr}: ${tempFunc(weatherObject.main.feels_like)}`;
  weatherWind.textContent = `${windStr}: ${weatherObject.wind.speed} ${windSpeedStr}`;
  weatherHumidity.textContent = `${humidityStr}: ${weatherObject.main.humidity} %`;
  temperatureNow.innerHTML = `${tempFunc(weatherObject.main.temp)}`;
  weatherNowImage.setAttribute('src', `http://openweathermap.org/img/wn/${weatherObject.weather[0].icon}@2x.png`);
};

const printForecast = (temperatureFunc, daysNames, forecastObject) => {
  const days = forecastObject.daily;
  for (let i = 0; i < forecastTemperature.length; i += 1) {
    const dayOfWeek = new Date(days[i + 1].dt * MILLISECONDS_IN_SECOND).getDay();
    forecastNamesOfDays[i].textContent = Array.isArray(daysNames[dayOfWeek])
      ? daysNames[dayOfWeek][0] : daysNames[dayOfWeek].toUpperCase();
    forecastTemperature[i].innerHTML = `${temperatureFunc(forecastObject.daily[i + 1].temp.day)}`;
    weatherForecastImages[i].setAttribute('src', `http://openweathermap.org/img/wn/${forecastObject.daily[i + 1].weather[0].icon}@2x.png`);
  }
};

const printWeatherAndForecastEn = (activeTemperatureButton, weatherObject, forecastObject) => {
  if (activeTemperatureButton.textContent[0] === celsiusBadge) {
    printNowWeather(kelvinToCelsius, 'feels like', 'wind', 'm/s', 'humidity', weatherObject);
    printForecast(kelvinToCelsius, namesOfDaysEn, forecastObject);
  } else {
    printNowWeather(kelvinToFahrenheit, 'feels like', 'wind', 'm/s', 'humidity', weatherObject);
    printForecast(kelvinToFahrenheit, namesOfDaysEn, forecastObject);
  }
};

const printWeatherAndForecastRu = (activeTemperatureButton, weatherObject, forecastObject) => {
  if (activeTemperatureButton.textContent[0] === celsiusBadge) {
    printNowWeather(kelvinToCelsius, 'ощущается', 'ветер', 'м/с', 'влажность', weatherObject);
    printForecast(kelvinToCelsius, namesOfDaysRu, forecastObject);
  } else {
    printNowWeather(kelvinToFahrenheit, 'ощущается', 'ветер', 'м/с', 'влажность', weatherObject);
    printForecast(kelvinToFahrenheit, namesOfDaysRu, forecastObject);
  }
};

const printCoordinate = (latitudeStr, longitudeStr, weatherObject) => {
  const { lat: firstCoordinate, lon: secondCoordinate } = weatherObject.coord;
  const firstCoordinateDegree = Number(firstCoordinate).toFixed();
  const firstCoordinateMinutes = String(firstCoordinate).split('.')[1].slice(0, 2);
  const secondCoordinateDegree = Number(secondCoordinate).toFixed();
  const secondCoordinateMinutes = String(secondCoordinate).split('.')[1].slice(0, 2);

  latitude.innerHTML = `${latitudeStr}: ${secondCoordinateDegree}&deg;${secondCoordinateMinutes}'`;
  longitude.innerHTML = `${longitudeStr}: ${firstCoordinateDegree}&deg;${firstCoordinateMinutes}'`;
};

const printCity = (cityNameFunc, weatherObject, countryObject) => {
  const city = cityNameFunc(weatherObject, countryObject);

  cityAndCountry.textContent = city;
};

const printMap = (weatherObject) => {
  const { lat: firstCoordinate, lon: secondCoordinate } = weatherObject.coord;
  mapboxgl.accessToken = 'pk.eyJ1IjoiZWJjZXMiLCJhIjoiY2tpOG1qdWcyMDczejJzbGJ3d2R5NHA3eCJ9.R9QjuutWo1QLod5AChOpdw';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [secondCoordinate, firstCoordinate],
    zoom: 8,
  });
};

const printNewBackground = async () => {
  const backgroundLink = await getLinkToImage();

  body.style.backgroundImage = `url(${backgroundLink})`;
};

const removeLanguageButtons = () => {
  notActiveLanguageButtons.forEach((button) => {
    button.remove();
    setTimeout(() => {
      languageButtons.append(button);
    }, 0);
  });
};

const printInformation = async () => {
  const { weatherData, forecastData, countryData } = await getServicesData();

  const activeTemperatureButton = document.querySelector('.control__button--active');
  if (!localTimeShift) {
    localTimeShift = weatherData.timezone * MILLISECONDS_IN_SECOND;
  }

  if (language === 'EN') {
    printWeatherAndForecastEn(activeTemperatureButton, weatherData,
      forecastData);
    printCoordinate(coordinateNames.latitudeEn, coordinateNames.longitudeEn, weatherData);
    printCity(getCityNameEn, weatherData, countryData);

    clearInterval(timeInterval);
    timeInterval = setInterval(() => {
      dateString.textContent = getDateString(namesOfDaysEn, monthsNamesEn, weatherData.timezone);
    }, 1000);
  } else {
    printWeatherAndForecastRu(activeTemperatureButton, weatherData,
      forecastData);
    printCoordinate(coordinateNames.latitudeRu, coordinateNames.longitudeRu, weatherData);
    printCity(getCityNameRu, weatherData, countryData);

    clearInterval(timeInterval);
    timeInterval = setInterval(() => {
      dateString.textContent = getDateString(namesOfDaysRu, monthsNamesRu, weatherData.timezone);
    }, 1000);
  }

  printMap(weatherData);
  printNewBackground();
};

printInformation();

refreshButton.addEventListener('click', printNewBackground);

const changeTemperature = async (e) => {
  const { weatherData, forecastData } = await getServicesData();

  controlButtonsTemperature.forEach((button) => button.classList.remove('control__button--active'));
  e.target.classList.add('control__button--active');

  localStorage.setItem('temperature', e.target.textContent[0]);

  const activeTemperatureButton = document.querySelector('.control__button--active');

  if (language === 'EN') {
    printWeatherAndForecastEn(activeTemperatureButton, weatherData, forecastData);
  } else {
    printWeatherAndForecastRu(activeTemperatureButton, weatherData, forecastData);
  }
};

farenheitButton.addEventListener('click', (e) => changeTemperature(e));
celsiusButton.addEventListener('click', (e) => changeTemperature(e));

notActiveLanguageButtons.forEach((elem) => {
  elem.addEventListener('click', async () => {
    const activeTemperatureButton = document.querySelector('.control__button--active');

    language = elem.textContent;
    if (language === 'RU') {
      const { weatherData, forecastData, countryData } = await getServicesData();

      printWeatherAndForecastRu(activeTemperatureButton, weatherData,
        forecastData);
      printCoordinate(coordinateNames.latitudeRu, coordinateNames.longitudeRu, weatherData);
      printCity(getCityNameRu, weatherData, countryData);

      clearInterval(timeInterval);
      timeInterval = setInterval(() => {
        dateString.textContent = getDateString(namesOfDaysRu, monthsNamesRu, weatherData.timezone);
      }, 1000);
    } else {
      const { weatherData, forecastData, countryData } = await getServicesData();

      printWeatherAndForecastEn(activeTemperatureButton, weatherData,
        forecastData);
      printCoordinate(coordinateNames.latitudeEn, coordinateNames.longitudeEn, weatherData);
      printCity(getCityNameEn, weatherData, countryData);

      clearInterval(timeInterval);
      timeInterval = setInterval(() => {
        dateString.textContent = getDateString(namesOfDaysEn, monthsNamesEn, weatherData.timezone);
      }, 1000);
    }
    changeLanguage();

    localStorage.setItem('language', language);
    removeLanguageButtons();
  });
});

searchButton.addEventListener('click', () => {
  printInformation();
});

window.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    printInformation();
  }
});
