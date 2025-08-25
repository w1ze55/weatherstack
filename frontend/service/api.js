import axios from 'axios';
 
const WEATHERSTACK_API_KEY = 'SUA_CHAVE_API_AQUI'; // Substitua pela sua chave da API
const WEATHERSTACK_BASE_URL = 'http://api.weatherstack.com/current';
 
// Configuração do axios
const weatherAPI = axios.create({
  baseURL: WEATHERSTACK_BASE_URL,
  timeout: 10000, // 10 segundos
});
 
export const getWeatherByCity = async (city) => {
  try {
    const response = await weatherAPI.get('', {
      params: {
        access_key: WEATHERSTACK_API_KEY,
        query: `${city.name},${city.country}`,
        units: 'm' // métrico
      }
    });
 
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados meteorológicos:', error);
    // Retorna dados mock em caso de erro
    return createMockWeatherData(city);
  }
};
 
export const getWeatherByCityName = async (cityName) => {
  try {
    const response = await weatherAPI.get('', {
      params: {
        access_key: WEATHERSTACK_API_KEY,
        query: cityName,
        units: 'm' // métrico
      }
    });
 
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados meteorológicos:', error);
    // Retorna dados mock em caso de erro
    return createMockWeatherDataForCity(cityName);
  }
};
 
// Função para criar dados mock em caso de erro na API
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
      temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
      weather_code: 116,
      weather_icons: ["https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png"],
      weather_descriptions: ["Parcialmente nublado"],
      wind_speed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
      wind_degree: Math.floor(Math.random() * 360),
      wind_dir: "NE",
      pressure: Math.floor(Math.random() * 50) + 1000, // 1000-1050 hPa
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      cloudcover: Math.floor(Math.random() * 100),
      feelslike: Math.floor(Math.random() * 15) + 22, // 22-37°C
      uv_index: Math.floor(Math.random() * 11),
      visibility: Math.floor(Math.random() * 10) + 10, // 10-20 km
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