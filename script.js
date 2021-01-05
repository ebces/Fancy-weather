import {
  namesOfDays, namesOfMonths, coordinateNames, searchAreaNames, weatherDescription,
} from './translatedNames';

const urlToPictures = `https://api.unsplash.com/photos/random?query=morning&client_id=${process.env.UNSPLASH_KEY}`;
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

const languages = {
  en: 'EN',
  ru: 'RU',
};

let language = localStorage.getItem('language') || languages.en;
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
    const ipResponse = await fetch(`https://ipinfo.io/json?token=${process.env.IP_INFO_KEY}`);
    const ipData = await ipResponse.json();
    const cityName = searchField.value.length ? searchField.value : ipData.city;
    const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=${language}&appid=${process.env.OPEN_WEATHER_KEY}`);
    weatherData = await weatherResponse.json();

    if (weatherData.cod === '404') {
      throw weatherData.message;
    }

    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&exclude={part}&appid=${process.env.OPEN_WEATHER_KEY}`);
    forecastData = await forecastResponse.json();
    const countryResponse = await fetch(`https://htmlweb.ru/geo/api.php?country=${weatherData.sys.country}&info&json&api_key=${process.env.HTML_WEB_KEY}`);
    countryData = await countryResponse.json();
  } catch (e) {
    alert(e);
    searchField.value = '';
  }

  return { weatherData, forecastData, countryData };
};

if (localStorage.getItem('temperature') === farenheitBadge) {
  farenheitButton.classList.add('control__button--active');
} else {
  celsiusButton.classList.add('control__button--active');
}

const translateSearchArea = () => {
  switch (language) {
    case languages.en:
      searchField.placeholder = searchAreaNames.placeHolder.en;
      searchButton.textContent = searchAreaNames.search.en;
      break;
    case languages.ru:
      searchField.placeholder = searchAreaNames.placeHolder.ru;
      searchButton.textContent = searchAreaNames.search.ru;
      break;
    default:
  }
};

const changeLanguage = () => {
  activeLanguageButton.textContent = language;
  const restLanguages = Object.values(languages).filter((elem) => elem !== language);

  for (let i = 0; i < notActiveLanguageButtons.length; i += 1) {
    notActiveLanguageButtons[i].textContent = restLanguages[i];
  }

  translateSearchArea();
};

changeLanguage();

const MILLISECONDS_IN_SECOND = 1000;

const kelvinToCelsius = (kelvin) => {
  const temp = Math.trunc(kelvin - 273.15);

  return Math.abs(temp) ? `${temp}&deg;C` : '0&deg;C';
};

const kelvinToFahrenheit = (kelvin) => {
  const temp = Math.trunc(((kelvin - 273.15) * 9) / 5 + 32);

  return Math.abs(temp) ? `${temp}&deg;F` : '0&deg;F';
};

const getDayAndMonthNames = () => {
  let names;

  switch (language) {
    case languages.en:
      names = [namesOfDays[day].en, namesOfMonths[month].en];
      break;
    case languages.ru:
      names = [namesOfDays[day].ru, namesOfMonths[month].ru];
      break;
    default:
      break;
  }

  return names;
};

const getDateString = (timeShift) => {
  const nowDate = new Date();
  const millisecondsUTC = nowDate.getTime() - localTimeShift;
  const newCountryMilliseconds = new Date(millisecondsUTC + timeShift * MILLISECONDS_IN_SECOND);
  const time = newCountryMilliseconds.toLocaleTimeString();

  const [nameOfDay, nameOfMonth] = getDayAndMonthNames();
  const [, shortDaysName] = nameOfDay;

  if (startDate !== newCountryMilliseconds.toDateString()) {
    startDate = newCountryMilliseconds.toDateString();
    day = newCountryMilliseconds.getDay();
    date = newCountryMilliseconds.getDate();
    month = newCountryMilliseconds.getMonth();
  }

  return `${shortDaysName} ${date} ${nameOfMonth} ${time}`;
};

const getLinkToImage = async () => {
  const response = await fetch(urlToPictures);
  const data = await response.json();

  return data.urls.regular;
};

const getCityName = ({ name }, { country }) => {
  let cityName;
  switch (language) {
    case languages.en:
      cityName = country ? `${name}, ${country.english}` : name;
      break;
    case languages.ru:
      cityName = country ? `${name}, ${country.name}` : name;
      break;
    default:
  }

  return cityName;
};

const printNowWeather = (tempFunc, weatherObject) => {
  let feelsStr;
  let windStr;
  let windSpeedStr;
  let humidityStr;

  switch (language) {
    case languages.en:
      feelsStr = weatherDescription.feelsStr.en;
      windStr = weatherDescription.windStr.en;
      windSpeedStr = weatherDescription.windSpeedStr.en;
      humidityStr = weatherDescription.humidityStr.en;
      break;
    case languages.ru:
      feelsStr = weatherDescription.feelsStr.ru;
      windStr = weatherDescription.windStr.ru;
      windSpeedStr = weatherDescription.windSpeedStr.ru;
      humidityStr = weatherDescription.humidityStr.ru;
      break;
    default:
      break;
  }

  const [weatherType, weatherFeels, weatherWind, weatherHumidity] = weatherDescriptions;
  weatherType.textContent = weatherObject.weather[0].description.toUpperCase();
  weatherFeels.innerHTML = `${feelsStr}: ${tempFunc(weatherObject.main.feels_like)}`;
  weatherWind.textContent = `${windStr}: ${weatherObject.wind.speed} ${windSpeedStr}`;
  weatherHumidity.textContent = `${humidityStr}: ${weatherObject.main.humidity} %`;
  temperatureNow.innerHTML = `${tempFunc(weatherObject.main.temp)}`;
  weatherNowImage.setAttribute('src', `http://openweathermap.org/img/wn/${weatherObject.weather[0].icon}@2x.png`);
};

const printForecast = (temperatureFunc, forecastObject) => {
  const days = forecastObject.daily;

  for (let i = 0; i < forecastTemperature.length; i += 1) {
    const dayOfWeek = new Date(days[i + 1].dt * MILLISECONDS_IN_SECOND).getDay();

    let daysName;
    switch (language) {
      case languages.en:
        daysName = namesOfDays[dayOfWeek].en;
        break;
      case languages.ru:
        daysName = namesOfDays[dayOfWeek].ru;
        break;
      default:
        break;
    }

    [forecastNamesOfDays[i].textContent] = daysName;
    forecastTemperature[i].innerHTML = `${temperatureFunc(forecastObject.daily[i + 1].temp.day)}`;
    weatherForecastImages[i].setAttribute('src', `http://openweathermap.org/img/wn/${forecastObject.daily[i + 1].weather[0].icon}@2x.png`);
  }
};

const chooseTemp = (temperature, weatherAndForecastData) => {
  const { weatherData, forecastData } = weatherAndForecastData;

  if (temperature.textContent[0] === celsiusBadge) {
    printNowWeather(kelvinToCelsius, weatherData);
    printForecast(kelvinToCelsius, forecastData);
  } else {
    printNowWeather(kelvinToFahrenheit, weatherData);
    printForecast(kelvinToFahrenheit, forecastData);
  }
};

const printWeatherAndForecast = (temperature, weatherData) => {
  chooseTemp(temperature, weatherData);
};

const printCoordinate = (weatherObject) => {
  const { lat: firstCoordinate, lon: secondCoordinate } = weatherObject.coord;
  const firstCoordinateDegree = Number(firstCoordinate).toFixed();
  const firstCoordinateMinutes = String(firstCoordinate).split('.')[1].slice(0, 2);
  const secondCoordinateDegree = Number(secondCoordinate).toFixed();
  const secondCoordinateMinutes = String(secondCoordinate).split('.')[1].slice(0, 2);

  switch (language) {
    case languages.en:
      latitude.innerHTML = `${coordinateNames.latitude.en}: ${secondCoordinateDegree}&deg;${secondCoordinateMinutes}'`;
      longitude.innerHTML = `${coordinateNames.longitude.en}: ${firstCoordinateDegree}&deg;${firstCoordinateMinutes}'`;
      break;
    case languages.ru:
      latitude.innerHTML = `${coordinateNames.latitude.ru}: ${secondCoordinateDegree}&deg;${secondCoordinateMinutes}'`;
      longitude.innerHTML = `${coordinateNames.longitude.ru}: ${firstCoordinateDegree}&deg;${firstCoordinateMinutes}'`;
      break;
    default:
  }
};

const printCity = (weatherObject, countryObject) => {
  cityAndCountry.textContent = getCityName(weatherObject, countryObject);
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
  const weatherAndForecastData = { weatherData, forecastData };

  const activeTemperatureButton = document.querySelector('.control__button--active');

  if (!localTimeShift) {
    localTimeShift = weatherData.timezone * MILLISECONDS_IN_SECOND;
  }

  printWeatherAndForecast(activeTemperatureButton, weatherAndForecastData);
  printCoordinate(weatherData);
  printCity(weatherData, countryData);

  clearInterval(timeInterval);
  timeInterval = setInterval(() => {
    dateString.textContent = getDateString(weatherData.timezone);
  }, 1000);

  printMap(weatherData);
  printNewBackground();
};

printInformation();

refreshButton.addEventListener('click', printNewBackground);

const changeTemperature = async (e) => {
  const { weatherData, forecastData } = await getServicesData();
  const weatherAndForecastData = { weatherData, forecastData };

  controlButtonsTemperature.forEach((button) => button.classList.remove('control__button--active'));
  e.target.classList.add('control__button--active');

  localStorage.setItem('temperature', e.target.textContent[0]);

  const activeTemperatureButton = document.querySelector('.control__button--active');
  printWeatherAndForecast(activeTemperatureButton, weatherAndForecastData);
};

farenheitButton.addEventListener('click', (e) => changeTemperature(e));
celsiusButton.addEventListener('click', (e) => changeTemperature(e));

notActiveLanguageButtons.forEach((elem) => {
  elem.addEventListener('click', async () => {
    const activeTemperatureButton = document.querySelector('.control__button--active');

    language = elem.textContent;

    const { weatherData, forecastData, countryData } = await getServicesData();
    const weatherAndForecastData = { weatherData, forecastData };

    printWeatherAndForecast(activeTemperatureButton, weatherAndForecastData);
    printCoordinate(weatherData);
    printCity(weatherData, countryData);

    clearInterval(timeInterval);
    timeInterval = setInterval(() => {
      dateString.textContent = getDateString(weatherData.timezone);
    }, 1000);

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
