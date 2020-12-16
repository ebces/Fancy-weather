const { body } = document;
const refreshButton = document.querySelector('.control__button--refresh');
const controlButtons = document.querySelector('.control');
const controlButtonsTemperature = document.querySelectorAll('.control__button--temperature');
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
const firstLanguageButton = document.querySelector('.control__button--language-en');
const secondLanguageButton = document.querySelector('.control__button--language-ru');

let language = 'en';

const MILLISECONDS_IN_SECOND = 1000;

const kelvinToCelsius = (kelvin) => (kelvin - 273.15).toFixed();
const kelvinToFahrenheit = (kelvin) => (((kelvin - 273.15) * 9) / 5 + 32).toFixed();

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

let time = setInterval(() => {
  dateString.textContent = getDateString(namesOfDaysEn, monthsNamesEn);
}, 1000);

const getLinkToImage = async () => {
  const url = 'https://api.unsplash.com/photos/random?query=morning&client_id=e2077ad31a806c894c460aec8f81bc2af4d09c4f8104ae3177bb809faf0eac17';
  const response = await fetch(url);
  const data = await response.json();

  return data.urls.regular;
};

const getIpData = async () => {
  const response = await fetch('https://ipinfo.io/json?token=eb5b90bb77d46a');
  const data = await response.json();

  return data;
};

const getUserCity = async () => {
  const data = await getIpData();

  return data.city;
};

const getNewCityData = async () => {
  const city = searchField.value.length ? searchField.value : await getUserCity();
  const response = await fetch(`http://search.maps.sputnik.ru/search?q=${city}`);
  const data = await response.json();

  return data;
};

const getNewCoordinates = async () => {
  const cityData = await getNewCityData();

  return [cityData.result[0].position.lat, cityData.result[0].position.lon];
};

const getNowWeather = async () => {
  const cityData = await getNewCityData();
  const cityName = cityData.result[0].title;
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=${language}&appid=489c6e3b9c228bd88ea6333b1a07dfef`);
  const data = await response.json();

  return data;
};

const getCountryNameByCode = async () => {
  const cityData = await getNowWeather();
  const countryName = cityData.sys.country;
  const response = await fetch(`https://restcountries.eu/rest/v2/alpha/${countryName}`);
  const data = await response.json();

  return data.name;
};

const getCityNameRu = async () => {
  const cityData = await getNewCityData();

  return `${cityData.result[0].title}, ${cityData.result[0].description.split(',')[0]}`;
};

const getCityNameEn = async () => {
  const cityData = await getNowWeather();
  const countryName = await getCountryNameByCode();

  return `${cityData.name}, ${countryName}`;
};

const getForecast = async () => {
  const [firstCoordinate, secondCoordinate] = await getNewCoordinates();
  const forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${firstCoordinate}&lon=${secondCoordinate}&exclude={part}&appid=489c6e3b9c228bd88ea6333b1a07dfef`;
  const response = await fetch(forecastUrl);
  const data = await response.json();

  return data;
};

const printNowWeather = async (temperatureFunc, feelsStr, windStr, windSpeedStr, humidityStr) => {
  const cityData = await getNowWeather();
  const [weatherType, weatherFeels, weatherWind, weatherHumidity] = weatherDescriptions;
  weatherType.textContent = cityData.weather[0].description.toUpperCase();
  weatherFeels.innerHTML = `${feelsStr}: ${temperatureFunc(cityData.main.feels_like)}&deg;`;
  weatherWind.textContent = `${windStr}: ${cityData.wind.speed} ${windSpeedStr}`;
  weatherHumidity.textContent = `${humidityStr}: ${cityData.main.humidity} %`;
  temperatureNow.innerHTML = `${temperatureFunc(cityData.main.temp)}&deg;`;
  weatherNowImage.setAttribute('src', `http://openweathermap.org/img/wn/${cityData.weather[0].icon}@2x.png`);
};

const printForecast = async (temperatureFunc, daysNames) => {
  const forecastData = await getForecast();
  const days = forecastData.daily;
  for (let i = 0; i < forecastTemperature.length; i += 1) {
    const dayOfWeek = new Date(days[i + 1].dt * MILLISECONDS_IN_SECOND).getDay();
    forecastNamesOfDays[i].textContent = Array.isArray(daysNames[dayOfWeek])
      ? daysNames[dayOfWeek][0] : daysNames[dayOfWeek].toUpperCase();
    forecastTemperature[i].innerHTML = `${temperatureFunc(forecastData.daily[i + 1].temp.day)}&deg;`;
    weatherForecastImages[i].setAttribute('src', `http://openweathermap.org/img/wn/${forecastData.daily[i + 1].weather[0].icon}@2x.png`);
  }
};

const printWeatherAndForecastEn = (activeTemperatureButton) => {
  if (activeTemperatureButton.textContent[0] === 'C') {
    printNowWeather(kelvinToCelsius, 'FEELS LIKE', 'WIND', 'm/s', 'HUMIDITY');
    printForecast(kelvinToCelsius, namesOfDaysEn);
  } else {
    printNowWeather(kelvinToFahrenheit, 'FEELS LIKE', 'WIND', 'm/s', 'HUMIDITY');
    printForecast(kelvinToFahrenheit, namesOfDaysEn);
  }
};

const printWeatherAndForecastRu = (activeTemperatureButton) => {
  if (activeTemperatureButton.textContent[0] === 'C') {
    printNowWeather(kelvinToCelsius, 'ОЩУЩАЕТСЯ', 'ВЕТЕР', 'м/с', 'ВЛАЖНОСТЬ');
    printForecast(kelvinToCelsius, namesOfDaysRu);
  } else {
    printNowWeather(kelvinToFahrenheit, 'ОЩУЩАЕТСЯ', 'ВЕТЕР', 'м/с', 'ВЛАЖНОСТЬ');
    printForecast(kelvinToFahrenheit, namesOfDaysRu);
  }
};

const printCoordinate = async (latitudeStr, longitudeStr) => {
  const [firstCoordinate, secondCoordinate] = await getNewCoordinates();
  const firstCoordinateDegree = Number(firstCoordinate).toFixed();
  const firstCoordinateMinutes = String(firstCoordinate).split('.')[1].slice(0, 2);
  const secondCoordinateDegree = Number(secondCoordinate).toFixed();
  const secondCoordinateMinutes = String(secondCoordinate).split('.')[1].slice(0, 2);

  latitude.innerHTML = `${latitudeStr}: ${secondCoordinateDegree}&deg;${secondCoordinateMinutes}'`;
  longitude.innerHTML = `${longitudeStr}: ${firstCoordinateDegree}&deg;${firstCoordinateMinutes}'`;
};

const printCity = async (cityNameFunc) => {
  const city = await cityNameFunc();

  cityAndCountry.textContent = city;
};

const printMap = async () => {
  const [firstCoordinate, secondCoordinate] = await getNewCoordinates();
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

const printInformation = () => {
  const activeTemperatureButton = document.querySelector('.control__button--active');
  if (language === 'en') {
    printWeatherAndForecastEn(activeTemperatureButton);
    printCoordinate('Latitude', 'Longitude');
    printCity(getCityNameEn);
  } else {
    printWeatherAndForecastRu(activeTemperatureButton);
    printCoordinate('Широта', 'Долгота');
    printCity(getCityNameRu);
  }

  printMap();
  printNewBackground();
};

printInformation();

refreshButton.addEventListener('click', printNewBackground);

controlButtons.addEventListener('click', (e) => {
  if (e.target.classList.contains('control__button--temperature')) {
    controlButtonsTemperature.forEach((button) => button.classList.remove('control__button--active'));
    e.target.classList.add('control__button--active');
  }

  const activeTemperatureButton = document.querySelector('.control__button--active');

  if (language === 'en') {
    printWeatherAndForecastEn(activeTemperatureButton);
  } else {
    printWeatherAndForecastRu(activeTemperatureButton);
  }
});

secondLanguageButton.addEventListener('click', () => {
  if (firstLanguageButton.textContent === 'EN') {
    firstLanguageButton.textContent = 'RU';
    secondLanguageButton.textContent = 'EN';
    language = 'ru';

    printCoordinate('Широта', 'Долгота');
    printCity(getCityNameRu);
    clearInterval(time);
    time = setInterval(() => {
      dateString.textContent = getDateString(namesOfDaysRu, monthsNamesRu);
    }, 1000);
  } else {
    firstLanguageButton.textContent = 'EN';
    secondLanguageButton.textContent = 'RU';
    language = 'en';

    printCoordinate('Latitude', 'Longitude');
    printCity(getCityNameEn);
    clearInterval(time);
    time = setInterval(() => {
      dateString.textContent = getDateString(namesOfDaysEn, monthsNamesEn);
    }, 1000);
  }
});

searchButton.addEventListener('click', () => {
  printInformation();
});

window.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    printInformation();
  }
});
