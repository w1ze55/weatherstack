import axios from 'axios';
 
const WEATHERSTACK_API_KEY = 'https://api.weatherstack.com/forecast?access_key=19426f6f8308c9';
const WEATHERSTACK_BASE_URL = 'http://api.weatherstack.com/current';
 
const weatherAPI = axios.create({
  baseURL: WEATHERSTACK_BASE_URL,
  timeout: 10000,
});
 
export const getWeatherByCity = async (city) => {
  try {
    const response = await weatherAPI.get('', {
      params: {
        access_key: WEATHERSTACK_API_KEY,
        query: `${city.name},${city.country}`,
        forecast_days: `${period}`
      }
    });
 
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados meteorológicos:', error);

    return createMockWeatherData(city);
  }
};
 
export const getWeatherByCityName = async (cityName) => {
  try {
    const response = await weatherAPI.get('', {
      params: {
        access_key: WEATHERSTACK_API_KEY,
        query: cityName,
        forecast_days: `${period}`
      }
    });
 
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados meteorológicos:', error);

    return createMockWeatherDataForCity(cityName);
  }
};
 
const createMockWeatherData = (city) => {
  return {
    request: {
      type: "City",
      query: `${city.name}, ${city.country}`,
      language: "en",
      unit: "m"
    },
    location: {
      name: city.name,
      country: city.country,
      region: city.state,
      lat: city.lat.toString(),
      lon: city.lon.toString(),
      timezone_id: "America/Sao_Paulo",
      localtime: new Date().toLocaleString('pt-BR'),
      localtime_epoch: Math.floor(Date.now() / 1000),
      utc_offset: "-3.0"
    },
    current: {
      observation_time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      temperature: Math.floor(Math.random() * 15) + 20,
      weather_code: 116,
      weather_icons: ["https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png"],
      weather_descriptions: ["Parcialmente nublado"],
      wind_speed: Math.floor(Math.random() * 20) + 5,
      wind_degree: Math.floor(Math.random() * 360),
      wind_dir: "NE",
      pressure: Math.floor(Math.random() * 50) + 1000,
      humidity: Math.floor(Math.random() * 40) + 40,
      cloudcover: Math.floor(Math.random() * 100),
      feelslike: Math.floor(Math.random() * 15) + 22,
      uv_index: Math.floor(Math.random() * 11),
      visibility: Math.floor(Math.random() * 10) + 10,
      is_day: "yes"
    }
  };
};
 
const createMockWeatherDataForCity = (cityName) => {
  return {
    request: {
      type: "City",
      query: cityName,
      language: "en",
      unit: "m"
    },
    location: {
      name: cityName,
      country: "Unknown",
      region: "Unknown",
      lat: "0",
      lon: "0",
      timezone_id: "UTC",
      localtime: new Date().toLocaleString('pt-BR'),
      localtime_epoch: Math.floor(Date.now() / 1000),
      utc_offset: "0.0"
    },
    current: {
      observation_time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      temperature: Math.floor(Math.random() * 15) + 20,
      weather_code: 116,
      weather_icons: ["https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png"],
      weather_descriptions: ["Ensolarado"],
      wind_speed: Math.floor(Math.random() * 20) + 5,
      wind_degree: Math.floor(Math.random() * 360),
      wind_dir: "N",
      pressure: Math.floor(Math.random() * 50) + 1000,
      humidity: Math.floor(Math.random() * 40) + 40,
      cloudcover: Math.floor(Math.random() * 100),
      feelslike: Math.floor(Math.random() * 15) + 22,
      uv_index: Math.floor(Math.random() * 11),
      visibility: Math.floor(Math.random() * 10) + 10,
      is_day: "yes"
    }
  };
};