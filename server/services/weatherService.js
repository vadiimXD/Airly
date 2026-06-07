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
                current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,dew_point_2m',
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
                highTemp: daily.temperature_2m_max[0],
                lowTemp: daily.temperature_2m_min[0],
                aqi: airQuality.us_aqi,
                aiqiLabel: getAQILabel(airQuality.us_aqi),
                pm10: airQuality.pm10,
                pm2_5: airQuality.pm2_5
            },
            hourlyForecast: hourly.time.slice(0, 12).map((time, index) => ({
                time: time,
                temperature: hourly.temperature_2m[index],
                humidity: hourly.relative_humidity_2m[index],
                windSpeed: hourly.wind_speed_10m[index],
                precipitation: hourly.precipitation[index]
            })),
            forecast7Day: daily.time.slice(0, 7).map((date, index) => ({
                date: date,
                maxTemp: daily.temperature_2m_max[index],
                minTemp: daily.temperature_2m_min[index],
                windSpeed: daily.wind_speed_10m_max[index],
                precipitation: daily.precipitation_sum[index],
                uvIndex: daily.uv_index_max[index]
            })),
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

 function getAQILabel  (aqi)  {
    if (aqi <= 50) return 'Добро';
    if (aqi <= 100) return 'Умерено';
    if (aqi <= 150) return 'Нехаразмо за уязвими групи';
    if (aqi <= 200) return 'Нехаразмо';
    if (aqi <= 300) return 'Много нехаразмо';
    return 'Опасно';
};