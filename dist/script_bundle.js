/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./script.js":
/*!*******************!*\
  !*** ./script.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _translatedNames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./translatedNames */ \"./translatedNames.js\");\n\nconst urlToPictures = 'https://api.unsplash.com/photos/random?query=morning&client_id=e2077ad31a806c894c460aec8f81bc2af4d09c4f8104ae3177bb809faf0eac17';\nconst celsiusBadge = 'C';\nconst farenheitBadge = 'F';\nconst {\n  body\n} = document;\nconst refreshButton = document.querySelector('.control__button--refresh');\nconst controlButtonsTemperature = document.querySelectorAll('.control__button--temperature');\nconst celsiusButton = document.querySelector('.control__button--celsius');\nconst farenheitButton = document.querySelector('.control__button--farenheit');\nconst latitude = document.querySelector('.location__coordinates--latitude');\nconst longitude = document.querySelector('.location__coordinates--longitude');\nconst temperatureNow = document.querySelector('.weather__temperature');\nconst forecastTemperature = document.querySelectorAll('.weather__forecast-temperature');\nconst forecastNamesOfDays = document.querySelectorAll('.weather__day');\nconst weatherDescriptions = document.querySelectorAll('.weather__text');\nconst weatherNowImage = document.querySelector('.weather__image');\nconst weatherForecastImages = document.querySelectorAll('.weather__forecast-image');\nconst dateString = document.querySelector('.weather__date');\nconst searchField = document.querySelector('.search__input');\nconst searchButton = document.querySelector('.search__button');\nconst cityAndCountry = document.querySelector('.weather__city');\nconst languageButtons = document.querySelector('.control__button--languages');\nconst activeLanguageButton = document.querySelector('.control__button--active-language');\nconst notActiveLanguageButtons = document.querySelectorAll('.control__button--not-active-language');\nconst languages = ['EN', 'RU'];\nlet language = localStorage.getItem('language') || languages[0];\nlet timeInterval;\nlet localTimeShift;\nlet startDate = new Date().toDateString();\nlet day = new Date().getDay();\nlet date = new Date().getDate();\nlet month = new Date().getMonth();\n\nconst getServicesData = async () => {\n  let weatherData;\n  let forecastData;\n  let countryData;\n\n  try {\n    const ipResponse = await fetch('https://ipinfo.io/json?token=eb5b90bb77d46a');\n    const ipData = await ipResponse.json();\n    const cityName = searchField.value.length ? searchField.value : ipData.city;\n    const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=${language}&appid=489c6e3b9c228bd88ea6333b1a07dfef`);\n    weatherData = await weatherResponse.json();\n\n    if (weatherData.cod === '404') {\n      throw weatherData.message;\n    }\n\n    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&exclude={part}&appid=489c6e3b9c228bd88ea6333b1a07dfef`);\n    forecastData = await forecastResponse.json();\n    const countryResponse = await fetch(`https://htmlweb.ru/geo/api.php?country=${weatherData.sys.country}&info&json&api_key=5ac6345ea632dcf4b4f242a291d9194a`);\n    countryData = await countryResponse.json();\n  } catch (e) {\n    alert(e);\n  }\n\n  return {\n    weatherData,\n    forecastData,\n    countryData\n  };\n};\n\nif (localStorage.getItem('temperature') === farenheitBadge) {\n  farenheitButton.classList.add('control__button--active');\n} else {\n  celsiusButton.classList.add('control__button--active');\n}\n\nconst changeLanguage = () => {\n  activeLanguageButton.textContent = language;\n  const restLanguages = languages.filter(elem => elem !== language);\n\n  for (let i = 0; i < notActiveLanguageButtons.length; i += 1) {\n    notActiveLanguageButtons[i].textContent = restLanguages[i];\n  }\n};\n\nchangeLanguage();\nconst MILLISECONDS_IN_SECOND = 1000;\n\nconst kelvinToCelsius = kelvin => `${(kelvin - 273.15).toFixed()}&deg;C`;\n\nconst kelvinToFahrenheit = kelvin => `${((kelvin - 273.15) * 9 / 5 + 32).toFixed()}&deg;F`;\n\nconst getDateString = (daysNames, monthsNames, timeShift) => {\n  const nowDate = new Date();\n  const millisecondsUTC = nowDate.getTime() - localTimeShift;\n  const newCountryMilliseconds = new Date(millisecondsUTC + timeShift * MILLISECONDS_IN_SECOND);\n  const time = newCountryMilliseconds.toLocaleTimeString();\n\n  if (startDate !== newCountryMilliseconds.toDateString()) {\n    startDate = newCountryMilliseconds.toDateString();\n    day = newCountryMilliseconds.getDay();\n    date = newCountryMilliseconds.getDate();\n    month = newCountryMilliseconds.getMonth();\n  }\n\n  const nameOfMonth = monthsNames[month];\n  const nameOfday = Array.isArray(daysNames[day]) ? _translatedNames__WEBPACK_IMPORTED_MODULE_0__.namesOfDaysRu[day][1] : _translatedNames__WEBPACK_IMPORTED_MODULE_0__.namesOfDaysEn[day].slice(0, 3);\n  return `${nameOfday} ${date} ${nameOfMonth} ${time}`;\n};\n\nconst getLinkToImage = async () => {\n  const response = await fetch(urlToPictures);\n  const data = await response.json();\n  return data.urls.regular;\n};\n\nconst getCityNameRu = ({\n  name\n}, {\n  country\n}) => country ? `${name}, ${country.name}` : name;\n\nconst getCityNameEn = ({\n  name\n}, {\n  english\n}) => english ? `${name}, ${english}` : name;\n\nconst printNowWeather = (tempFunc, weatherDescription, weatherObject) => {\n  const {\n    feelsStr,\n    windStr,\n    windSpeedStr,\n    humidityStr\n  } = weatherDescription;\n  const [weatherType, weatherFeels, weatherWind, weatherHumidity] = weatherDescriptions;\n  weatherType.textContent = weatherObject.weather[0].description.toUpperCase();\n  weatherFeels.innerHTML = `${feelsStr}: ${tempFunc(weatherObject.main.feels_like)}`;\n  weatherWind.textContent = `${windStr}: ${weatherObject.wind.speed} ${windSpeedStr}`;\n  weatherHumidity.textContent = `${humidityStr}: ${weatherObject.main.humidity} %`;\n  temperatureNow.innerHTML = `${tempFunc(weatherObject.main.temp)}`;\n  weatherNowImage.setAttribute('src', `http://openweathermap.org/img/wn/${weatherObject.weather[0].icon}@2x.png`);\n};\n\nconst printForecast = (temperatureFunc, daysNames, forecastObject) => {\n  const days = forecastObject.daily;\n\n  for (let i = 0; i < forecastTemperature.length; i += 1) {\n    const dayOfWeek = new Date(days[i + 1].dt * MILLISECONDS_IN_SECOND).getDay();\n    forecastNamesOfDays[i].textContent = Array.isArray(daysNames[dayOfWeek]) ? daysNames[dayOfWeek][0] : daysNames[dayOfWeek].toUpperCase();\n    forecastTemperature[i].innerHTML = `${temperatureFunc(forecastObject.daily[i + 1].temp.day)}`;\n    weatherForecastImages[i].setAttribute('src', `http://openweathermap.org/img/wn/${forecastObject.daily[i + 1].weather[0].icon}@2x.png`);\n  }\n};\n\nconst printWeatherAndForecastEn = (activeTemperatureButton, weatherObject, forecastObject) => {\n  if (activeTemperatureButton.textContent[0] === celsiusBadge) {\n    printNowWeather(kelvinToCelsius, _translatedNames__WEBPACK_IMPORTED_MODULE_0__.weatherDescriptionEn, weatherObject);\n    printForecast(kelvinToCelsius, _translatedNames__WEBPACK_IMPORTED_MODULE_0__.namesOfDaysEn, forecastObject);\n  } else {\n    printNowWeather(kelvinToFahrenheit, _translatedNames__WEBPACK_IMPORTED_MODULE_0__.weatherDescriptionEn, weatherObject);\n    printForecast(kelvinToFahrenheit, _translatedNames__WEBPACK_IMPORTED_MODULE_0__.namesOfDaysEn, forecastObject);\n  }\n};\n\nconst printWeatherAndForecastRu = (activeTemperatureButton, weatherObject, forecastObject) => {\n  if (activeTemperatureButton.textContent[0] === celsiusBadge) {\n    printNowWeather(kelvinToCelsius, _translatedNames__WEBPACK_IMPORTED_MODULE_0__.weatherDescriptionRu, weatherObject);\n    printForecast(kelvinToCelsius, _translatedNames__WEBPACK_IMPORTED_MODULE_0__.namesOfDaysRu, forecastObject);\n  } else {\n    printNowWeather(kelvinToFahrenheit, _translatedNames__WEBPACK_IMPORTED_MODULE_0__.weatherDescriptionRu, weatherObject);\n    printForecast(kelvinToFahrenheit, _translatedNames__WEBPACK_IMPORTED_MODULE_0__.namesOfDaysRu, forecastObject);\n  }\n};\n\nconst printCoordinate = (latitudeStr, longitudeStr, weatherObject) => {\n  const {\n    lat: firstCoordinate,\n    lon: secondCoordinate\n  } = weatherObject.coord;\n  const firstCoordinateDegree = Number(firstCoordinate).toFixed();\n  const firstCoordinateMinutes = String(firstCoordinate).split('.')[1].slice(0, 2);\n  const secondCoordinateDegree = Number(secondCoordinate).toFixed();\n  const secondCoordinateMinutes = String(secondCoordinate).split('.')[1].slice(0, 2);\n  latitude.innerHTML = `${latitudeStr}: ${secondCoordinateDegree}&deg;${secondCoordinateMinutes}'`;\n  longitude.innerHTML = `${longitudeStr}: ${firstCoordinateDegree}&deg;${firstCoordinateMinutes}'`;\n};\n\nconst printCity = (cityNameFunc, weatherObject, countryObject) => {\n  const city = cityNameFunc(weatherObject, countryObject);\n  cityAndCountry.textContent = city;\n};\n\nconst printMap = weatherObject => {\n  const {\n    lat: firstCoordinate,\n    lon: secondCoordinate\n  } = weatherObject.coord;\n  mapboxgl.accessToken = 'pk.eyJ1IjoiZWJjZXMiLCJhIjoiY2tpOG1qdWcyMDczejJzbGJ3d2R5NHA3eCJ9.R9QjuutWo1QLod5AChOpdw';\n  const map = new mapboxgl.Map({\n    container: 'map',\n    style: 'mapbox://styles/mapbox/streets-v11',\n    center: [secondCoordinate, firstCoordinate],\n    zoom: 8\n  });\n};\n\nconst printNewBackground = async () => {\n  const backgroundLink = await getLinkToImage();\n  body.style.backgroundImage = `url(${backgroundLink})`;\n};\n\nconst removeLanguageButtons = () => {\n  notActiveLanguageButtons.forEach(button => {\n    button.remove();\n    setTimeout(() => {\n      languageButtons.append(button);\n    }, 0);\n  });\n};\n\nconst printInformation = async () => {\n  const {\n    weatherData,\n    forecastData,\n    countryData\n  } = await getServicesData();\n  const activeTemperatureButton = document.querySelector('.control__button--active');\n\n  if (!localTimeShift) {\n    localTimeShift = weatherData.timezone * MILLISECONDS_IN_SECOND;\n  }\n\n  if (language === 'EN') {\n    printWeatherAndForecastEn(activeTemperatureButton, weatherData, forecastData);\n    printCoordinate(_translatedNames__WEBPACK_IMPORTED_MODULE_0__.coordinateNames.latitudeEn, _translatedNames__WEBPACK_IMPORTED_MODULE_0__.coordinateNames.longitudeEn, weatherData);\n    printCity(getCityNameEn, weatherData, countryData);\n    clearInterval(timeInterval);\n    timeInterval = setInterval(() => {\n      dateString.textContent = getDateString(_translatedNames__WEBPACK_IMPORTED_MODULE_0__.namesOfDaysEn, _translatedNames__WEBPACK_IMPORTED_MODULE_0__.monthsNamesEn, weatherData.timezone);\n    }, 1000);\n  } else {\n    printWeatherAndForecastRu(activeTemperatureButton, weatherData, forecastData);\n    printCoordinate(_translatedNames__WEBPACK_IMPORTED_MODULE_0__.coordinateNames.latitudeRu, _translatedNames__WEBPACK_IMPORTED_MODULE_0__.coordinateNames.longitudeRu, weatherData);\n    printCity(getCityNameRu, weatherData, countryData);\n    clearInterval(timeInterval);\n    timeInterval = setInterval(() => {\n      dateString.textContent = getDateString(_translatedNames__WEBPACK_IMPORTED_MODULE_0__.namesOfDaysRu, _translatedNames__WEBPACK_IMPORTED_MODULE_0__.monthsNamesRu, weatherData.timezone);\n    }, 1000);\n  }\n\n  printMap(weatherData);\n  printNewBackground();\n};\n\nprintInformation();\nrefreshButton.addEventListener('click', printNewBackground);\n\nconst changeTemperature = async e => {\n  const {\n    weatherData,\n    forecastData\n  } = await getServicesData();\n  controlButtonsTemperature.forEach(button => button.classList.remove('control__button--active'));\n  e.target.classList.add('control__button--active');\n  localStorage.setItem('temperature', e.target.textContent[0]);\n  const activeTemperatureButton = document.querySelector('.control__button--active');\n\n  if (language === 'EN') {\n    printWeatherAndForecastEn(activeTemperatureButton, weatherData, forecastData);\n  } else {\n    printWeatherAndForecastRu(activeTemperatureButton, weatherData, forecastData);\n  }\n};\n\nfarenheitButton.addEventListener('click', e => changeTemperature(e));\ncelsiusButton.addEventListener('click', e => changeTemperature(e));\nnotActiveLanguageButtons.forEach(elem => {\n  elem.addEventListener('click', async () => {\n    const activeTemperatureButton = document.querySelector('.control__button--active');\n    language = elem.textContent;\n\n    if (language === 'RU') {\n      const {\n        weatherData,\n        forecastData,\n        countryData\n      } = await getServicesData();\n      printWeatherAndForecastRu(activeTemperatureButton, weatherData, forecastData);\n      printCoordinate(_translatedNames__WEBPACK_IMPORTED_MODULE_0__.coordinateNames.latitudeRu, _translatedNames__WEBPACK_IMPORTED_MODULE_0__.coordinateNames.longitudeRu, weatherData);\n      printCity(getCityNameRu, weatherData, countryData);\n      clearInterval(timeInterval);\n      timeInterval = setInterval(() => {\n        dateString.textContent = getDateString(_translatedNames__WEBPACK_IMPORTED_MODULE_0__.namesOfDaysRu, _translatedNames__WEBPACK_IMPORTED_MODULE_0__.monthsNamesRu, weatherData.timezone);\n      }, 1000);\n    } else {\n      const {\n        weatherData,\n        forecastData,\n        countryData\n      } = await getServicesData();\n      printWeatherAndForecastEn(activeTemperatureButton, weatherData, forecastData);\n      printCoordinate(_translatedNames__WEBPACK_IMPORTED_MODULE_0__.coordinateNames.latitudeEn, _translatedNames__WEBPACK_IMPORTED_MODULE_0__.coordinateNames.longitudeEn, weatherData);\n      printCity(getCityNameEn, weatherData, countryData);\n      clearInterval(timeInterval);\n      timeInterval = setInterval(() => {\n        dateString.textContent = getDateString(_translatedNames__WEBPACK_IMPORTED_MODULE_0__.namesOfDaysEn, _translatedNames__WEBPACK_IMPORTED_MODULE_0__.monthsNamesEn, weatherData.timezone);\n      }, 1000);\n    }\n\n    changeLanguage();\n    localStorage.setItem('language', language);\n    removeLanguageButtons();\n  });\n});\nsearchButton.addEventListener('click', () => {\n  printInformation();\n});\nwindow.addEventListener('keypress', e => {\n  if (e.key === 'Enter') {\n    printInformation();\n  }\n});\n\n//# sourceURL=webpack://fancy-weather/./script.js?");

/***/ }),

/***/ "./translatedNames.js":
/*!****************************!*\
  !*** ./translatedNames.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"namesOfDaysEn\": () => /* binding */ namesOfDaysEn,\n/* harmony export */   \"namesOfDaysRu\": () => /* binding */ namesOfDaysRu,\n/* harmony export */   \"monthsNamesEn\": () => /* binding */ monthsNamesEn,\n/* harmony export */   \"monthsNamesRu\": () => /* binding */ monthsNamesRu,\n/* harmony export */   \"coordinateNames\": () => /* binding */ coordinateNames,\n/* harmony export */   \"weatherDescriptionRu\": () => /* binding */ weatherDescriptionRu,\n/* harmony export */   \"weatherDescriptionEn\": () => /* binding */ weatherDescriptionEn\n/* harmony export */ });\nconst namesOfDaysEn = {\n  0: 'Sunday',\n  1: 'Monday',\n  2: 'Tuesday',\n  3: 'Wednesday',\n  4: 'Thursday',\n  5: 'Friday',\n  6: 'Saturday'\n};\nconst namesOfDaysRu = {\n  0: ['Воскресенье', 'Вс'],\n  1: ['Понедельник', 'Пн'],\n  2: ['Вторник', 'Вт'],\n  3: ['Среда', 'Ср'],\n  4: ['Четверг', 'Чт'],\n  5: ['Пятница', 'Пт'],\n  6: ['Суббота', 'Сб']\n};\nconst monthsNamesEn = {\n  0: 'January',\n  1: 'February',\n  2: 'March',\n  3: 'April',\n  4: 'May',\n  5: 'June',\n  6: 'July',\n  7: 'August',\n  8: 'September',\n  9: 'October',\n  10: 'November',\n  11: 'December'\n};\nconst monthsNamesRu = {\n  0: 'Январь',\n  1: 'Февраль',\n  2: 'Март',\n  3: 'Апрель',\n  4: 'Май',\n  5: 'Июнь',\n  6: 'Июль',\n  7: 'Август',\n  8: 'Сентябрь',\n  9: 'Октябрь',\n  10: 'Ноябрь',\n  11: 'Декабрь'\n};\nconst coordinateNames = {\n  latitudeRu: 'Широта',\n  latitudeEn: 'Latitude',\n  longitudeRu: 'Долгота',\n  longitudeEn: 'Longitude'\n};\nconst weatherDescriptionRu = {\n  feelsStr: 'ощущается',\n  windStr: 'ветер',\n  windSpeedStr: 'м/с',\n  humidityStr: 'влажность'\n};\nconst weatherDescriptionEn = {\n  feelsStr: 'feels like',\n  windStr: 'wind',\n  windSpeedStr: 'm/s',\n  humidityStr: 'humidity'\n};\n\n//# sourceURL=webpack://fancy-weather/./translatedNames.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./script.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;