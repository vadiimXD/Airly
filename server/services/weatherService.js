const puppeteer = require("puppeteer");
const API_KEY = '1337';
const axios = require('axios');

exports.getFullWeather = async (city) => {
    try {

        const geoResponse = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
            params: {
                name: city,
                count: 1,
                language: 'bg'
            },
            timeout: 10000
        });

        if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
            return { success: false, error: 'Град не намерен' };
        }

        const location = geoResponse.data.results[0];
        const { latitude, longitude, name, country } = location;


        const weatherResponse = await axios.get('https://api.open-meteo.com/v1/forecast', {
            params: {
                latitude: latitude,
                longitude: longitude,
                current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,dew_point_2m,visibility',
                hourly: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation',
                daily: 'weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation_sum,uv_index_max',
                timezone: 'Europe/Sofia'
            },
            timeout: 10000
        });

        // Air Quality отделен запит
        const aqResponse = await axios.get('https://air-quality-api.open-meteo.com/v1/air-quality', {
            params: {
                latitude: latitude,
                longitude: longitude,
                current: 'us_aqi,pm10,pm2_5'
            },
            timeout: 10000
        });

        const current = weatherResponse.data.current;
        const hourly = weatherResponse.data.hourly;
        const daily = weatherResponse.data.daily;
        const airQuality = aqResponse.data.current;
        const now = new Date(current.time);

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = now.toLocaleDateString('bg-BG', options);

        console.log("Full weather data is taked successfully for city: " + name);
        return {
            date: formattedDate,
            city: name,
            country: country,
            current: {
                temperature: current.temperature_2m,
                feelsLike: current.apparent_temperature,
                humidity: current.relative_humidity_2m,
                dewPoint: current.dew_point_2m,
                windSpeed: current.wind_speed_10m,
                pressure: current.pressure_msl,
                visibility: current.visibility / 1000,
                weather: getWeatherDescription(current.weather_code),
                highTemp: daily.temperature_2m_max[0],
                lowTemp: daily.temperature_2m_min[0],
                aqi: airQuality.us_aqi,
                aiqiLabel: getAQILabel(airQuality.us_aqi),
                pm10: airQuality.pm10,
                pm25: airQuality.pm2_5,
                uvIndex: daily.uv_index_max[0],
                comfortLevel: getComfortLevel(current.temperature_2m, current.relative_humidity_2m),
            },
            hourlyForecast: hourly.time.slice(0, 12).map((time, index) => {
                const date = new Date(time);
                const formattedTime = date.toLocaleString('bg-BG', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                return {
                    time: formattedTime,
                    temperature: hourly.temperature_2m[index],
                    weatherIcon: getWeatherIcon(hourly.weather_code[index], time),
                };
            }),
            forecast7Day: daily.time.slice(0, 7).map((date, index) => {
                const dateObj = new Date(date);
                const dayName = dateObj.toLocaleDateString('bg-BG', { weekday: 'short' });
                return {
                    day: dayName,
                    maxTemp: daily.temperature_2m_max[index],
                    minTemp: daily.temperature_2m_min[index],
                    weatherIcon: getWeatherIcon(daily.weather_code[index], date),
                };
            }),
            success: true
        };

    } catch (error) {
        console.error('Error fetching weather data for ' + city + ':', error.message);
        return {
            success: false,
            error: error.message
        };
    }
};

function getAQILabel(aqi) {
    if (aqi <= 50) return 'Добро';
    if (aqi <= 100) return 'Умерено';
    if (aqi <= 150) return 'Нехаразмо за уязвими групи';
    if (aqi <= 200) return 'Нехаразмо';
    if (aqi <= 300) return 'Много нехаразмо';
    return 'Опасно';
};

function getWeatherDescription(code) {
    const weatherCodes = {
        0: 'Ясно',
        1: 'Главно ясно',
        2: 'Частично облачно',
        3: 'Облачно',
        45: 'Мъгла',
        48: 'Мъгла с лед',
        51: 'Лека роса',
        53: 'Умерена роса',
        55: 'Интензивна роса',
        61: 'Слаб дъжд',
        63: 'Умерен дъжд',
        65: 'Интензивен дъжд',
        71: 'Слаб сняг',
        73: 'Умерен сняг',
        75: 'Интензивен сняг',
        77: 'Зърнист сняг',
        80: 'Слаби дъждовни пориви',
        81: 'Умерени дъждовни пориви',
        82: 'Интензивни дъждовни пориви',
        85: 'Слаби снежни пориви',
        86: 'Интензивни снежни пориви',
        95: 'Гръмотевица',
        96: 'Гръмотевица със слаб градушка',
        99: 'Гръмотевица с градyшка'
    };
    return weatherCodes[code] || 'Неизвестно';
};

function getComfortLevel(temp, humidity) {
    if (temp < 10) {
        return 'Студено';
    } else if (temp < 15) {
        return 'Хладно';
    } else if (temp < 20) {
        return 'Прохладно';
    } else if (temp < 25) {
        return 'Приятно';
    } else {
        const c1 = -42.379;
        const c2 = 2.04901523;
        const c3 = 10.14333127;
        const c4 = -0.22475541;
        const c5 = -0.00683783;
        const c6 = -0.05481717;
        const c7 = 0.00122874;
        const c8 = 0.00085282;
        const c9 = -0.00000199;

        const T = temp;
        const RH = humidity;

        const hi = c1 + (c2 * T) + (c3 * RH) + (c4 * T * RH) +
            (c5 * T * T) + (c6 * RH * RH) + (c7 * T * T * RH) +
            (c8 * T * RH * RH) + (c9 * T * T * RH * RH);

        if (hi < 27) return 'Топло';
        if (hi < 32) return 'Горещо';
        if (hi < 41) return 'Горещо и влажно';
        if (hi < 54) return 'Много горещо';
        return 'Опасно горещо';
    }

};

function getWeatherIcon(code, time) {
    const date = new Date(time);
    const hour = date.getHours();
    const isNight = hour < 5 || hour >= 20; // нощ е между 20:00 и 05:00

    const weatherIcons = {
        0: isNight ? '🌙' : '☀️',
        1: isNight ? '🌙' : '🌤️',
        2: isNight ? '🌙' : '⛅',
        3: '☁️',
        45: '🌫️',
        48: '🌫️',
        51: '🌧️',
        53: '🌧️',
        55: '🌧️',
        61: '🌧️',
        63: '🌧️',
        65: '⛈️',
        71: '❄️',
        73: '❄️',
        75: '❄️',
        77: '❄️',
        80: '🌧️',
        81: '🌧️',
        82: '⛈️',
        85: '❄️',
        86: '❄️',
        95: '⛈️',
        96: '⛈️',
        99: '⛈️'
    };
    return weatherIcons[code] || '🌤️';
};