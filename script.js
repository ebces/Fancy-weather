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
const notActiveLanguageButton = document.querySelector('.control__button--not-active-language');

let language = localStorage.getItem('language') || 'en';
let timeString;

const getServicesData = async () => {
  const ipResponse = await fetch('https://ipinfo.io/json?token=eb5b90bb77d46a');
  const ipData = await ipResponse.json();
  const cityName = searchField.value.length ? searchField.value : ipData.city;
  const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=${language}&appid=489c6e3b9c228bd88ea6333b1a07dfef`);
  const weatherData = await weatherResponse.json();
  const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&exclude={part}&appid=489c6e3b9c228bd88ea6333b1a07dfef`);
  const forecastData = await forecastResponse.json();
  const countryResponse = await fetch(`https://htmlweb.ru/geo/api.php?country=${weatherData.sys.country}&info&json&api_key=5ac6345ea632dcf4b4f242a291d9194a`);
  const countryData = await countryResponse.json();
  return { weatherData, forecastData, countryData };
};

if (localStorage.getItem('temperature') === 'F') {
  farenheitButton.classList.add('control__button--active');
} else {
  celsiusButton.classList.add('control__button--active');
}

if (language === 'en') {
  activeLanguageButton.textContent = 'EN';
  notActiveLanguageButton.textContent = 'RU';
} else {
  activeLanguageButton.textContent = 'RU';
  notActiveLanguageButton.textContent = 'EN';
}

const MILLISECONDS_IN_SECOND = 1000;

const kelvinToCelsius = (kelvin) => `${(kelvin - 273.15).toFixed()}&deg;C`;
const kelvinToFahrenheit = (kelvin) => `${(((kelvin - 273.15) * 9) / 5 + 32).toFixed()}&deg;F`;

const namesOfDaysEn = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

const namesOfDaysRu = {
  0: ['Воскресенье', 'Вс'],
  1: ['Понедельник', 'Пн'],
  2: ['Вторник', 'Вт'],
  3: ['Среда', 'Ср'],
  4: ['Четверг', 'Чт'],
  5: ['Пятница', 'Пт'],
  6: ['Суббота', 'Сб'],
};

const monthsNamesEn = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December',
};

const monthsNamesRu = {
  0: 'Январь',
  1: 'Февраль',
  2: 'Март',
  3: 'Апрель',
  4: 'Май',
  5: 'Июнь',
  6: 'Июль',
  7: 'Август',
  8: 'Сентябрь',
  9: 'Октябрь',
  10: 'Ноябрь',
  11: 'Декабрь',
};

const getDateString = (daysNames, monthsNames) => {
  const nowDate = new Date();
  const day = nowDate.getDay();
  const date = nowDate.getDate();
  const month = nowDate.getMonth();
  const time = nowDate.toLocaleTimeString();
  const nameOfMonth = monthsNames[month];
  const nameOfday = Array.isArray(daysNames[day]) ? namesOfDaysRu[day][1]
    : namesOfDaysEn[day].slice(0, 3);

  return `${nameOfday} ${date} ${nameOfMonth} ${time}`;
};

const getLinkToImage = async () => {
  const url = 'https://api.unsplash.com/photos/random?query=morning&client_id=e2077ad31a806c894c460aec8f81bc2af4d09c4f8104ae3177bb809faf0eac17';
  const response = await fetch(url);
  const data = await response.json();

  return data.urls.regular;
};

const getCityNameRu = (weatherObject, countryObject) => `${weatherObject.name}, ${countryObject.country.name}`;

const getCityNameEn = (weatherObject, countryObject) => `${weatherObject.name}, ${countryObject.english}`;

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
  if (activeTemperatureButton.textContent[0] === 'C') {
    printNowWeather(kelvinToCelsius, 'FEELS LIKE', 'WIND', 'm/s', 'HUMIDITY', weatherObject);
    printForecast(kelvinToCelsius, namesOfDaysEn, forecastObject);
  } else {
    printNowWeather(kelvinToFahrenheit, 'FEELS LIKE', 'WIND', 'm/s', 'HUMIDITY', weatherObject);
    printForecast(kelvinToFahrenheit, namesOfDaysEn, forecastObject);
  }
};

const printWeatherAndForecastRu = (activeTemperatureButton, weatherObject, forecastObject) => {
  if (activeTemperatureButton.textContent[0] === 'C') {
    printNowWeather(kelvinToCelsius, 'ОЩУЩАЕТСЯ', 'ВЕТЕР', 'м/с', 'ВЛАЖНОСТЬ', weatherObject);
    printForecast(kelvinToCelsius, namesOfDaysRu, forecastObject);
  } else {
    printNowWeather(kelvinToFahrenheit, 'ОЩУЩАЕТСЯ', 'ВЕТЕР', 'м/с', 'ВЛАЖНОСТЬ', weatherObject);
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

const removeLanguageButton = () => {
  notActiveLanguageButton.remove();
  setTimeout(() => {
    languageButtons.append(notActiveLanguageButton);
  }, 0);
};

const printInformation = async () => {
  const weatherAndCountryData = await getServicesData();
  const activeTemperatureButton = document.querySelector('.control__button--active');

  if (language === 'en') {
    printWeatherAndForecastEn(activeTemperatureButton, weatherAndCountryData.weatherData,
      weatherAndCountryData.forecastData);
    printCoordinate('Latitude', 'Longitude', weatherAndCountryData.weatherData);
    printCity(getCityNameEn, weatherAndCountryData.weatherData, weatherAndCountryData.countryData);

    timeString = setInterval(() => {
      dateString.textContent = getDateString(namesOfDaysEn, monthsNamesEn);
    }, 1000);
  } else {
    printWeatherAndForecastRu(activeTemperatureButton, weatherAndCountryData.weatherData,
      weatherAndCountryData.forecastData);
    printCoordinate('Широта', 'Долгота', weatherAndCountryData.weatherData);
    printCity(getCityNameRu, weatherAndCountryData.weatherData, weatherAndCountryData.countryData);

    timeString = setInterval(() => {
      dateString.textContent = getDateString(namesOfDaysRu, monthsNamesRu);
    }, 1000);
  }

  printMap(weatherAndCountryData.weatherData);
  printNewBackground();
};

printInformation();

refreshButton.addEventListener('click', printNewBackground);

const changeTemperature = async (e) => {
  const weatherAndCountryData = await getServicesData();

  controlButtonsTemperature.forEach((button) => button.classList.remove('control__button--active'));
  e.target.classList.add('control__button--active');

  localStorage.setItem('temperature', e.target.textContent[0]);

  const activeTemperatureButton = document.querySelector('.control__button--active');

  if (language === 'en') {
    printWeatherAndForecastEn(activeTemperatureButton, weatherAndCountryData.weatherData,
      weatherAndCountryData.forecastData);
  } else {
    printWeatherAndForecastRu(activeTemperatureButton, weatherAndCountryData.weatherData,
      weatherAndCountryData.forecastData);
  }
};

farenheitButton.addEventListener('click', (e) => changeTemperature(e));
celsiusButton.addEventListener('click', (e) => changeTemperature(e));

notActiveLanguageButton.addEventListener('click', async () => {
  const activeTemperatureButton = document.querySelector('.control__button--active');
  let weatherAndCountryData;

  if (language === 'en') {
    activeLanguageButton.textContent = 'RU';
    notActiveLanguageButton.textContent = 'EN';
    language = 'ru';

    weatherAndCountryData = await getServicesData();

    printWeatherAndForecastRu(activeTemperatureButton, weatherAndCountryData.weatherData,
      weatherAndCountryData.forecastData);
    printCoordinate('Широта', 'Долгота', weatherAndCountryData.weatherData);
    printCity(getCityNameRu, weatherAndCountryData.weatherData, weatherAndCountryData.countryData);

    clearInterval(timeString);
    timeString = setInterval(() => {
      dateString.textContent = getDateString(namesOfDaysRu, monthsNamesRu);
    }, 1000);
  } else {
    activeLanguageButton.textContent = 'EN';
    notActiveLanguageButton.textContent = 'RU';
    language = 'en';

    weatherAndCountryData = await getServicesData();

    printWeatherAndForecastEn(activeTemperatureButton, weatherAndCountryData.weatherData,
      weatherAndCountryData.forecastData);
    printCoordinate('Latitude', 'Longitude', weatherAndCountryData.weatherData);
    printCity(getCityNameEn, weatherAndCountryData.weatherData, weatherAndCountryData.countryData);

    clearInterval(timeString);
    timeString = setInterval(() => {
      dateString.textContent = getDateString(namesOfDaysEn, monthsNamesEn);
    }, 1000);
  }

  localStorage.setItem('language', language);
  removeLanguageButton();
});

searchButton.addEventListener('click', () => {
  printInformation();
});

window.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    printInformation();
  }
});
