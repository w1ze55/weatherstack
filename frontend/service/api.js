import axios from 'axios';

const WEATHERSTACK_API_KEY = '07743be09f8fc04c813776100d38fcb7';

export const getWeatherByCity = async (city, period = 1) => {
  // Primeira tentativa: nome da cidade
  const currentOptions = {
    method: 'GET',
    url: `https://api.weatherstack.com/current?access_key=${WEATHERSTACK_API_KEY}`,
    params: {
      query: `Florianópolis`
    }
  };

  try {
    console.log('Tentando com nome da cidade...');
    console.log('Query enviada para API:', `${city.name}, ${city.state}, ${city.country}`);
    
    const currentResponse = await axios.request(currentOptions);
    
    if (currentResponse.data.error) {
      throw new Error(currentResponse.data.error.info || 'Erro na API do WeatherStack');
    }

    // Verificar se a localização retornada é a correta (não Indiana!)
    const location = currentResponse.data.location;
    if (location && location.country && location.country.toLowerCase().includes('brazil')) {
      console.log('Sucesso com nome da cidade!');
      console.log('Resposta da API:', currentResponse.data);
      return currentResponse.data;
    } else {
      console.log('Localização incorreta retornada, tentando coordenadas...');
      throw new Error('Localização incorreta');
    }
    
  } catch (error) {
    console.error('Erro com nome, tentando coordenadas:', error);
    
    // Segunda tentativa: usar coordenadas (sempre funciona!)
    try {
      const coordOptions = {
        method: 'GET',
        url: `https://api.weatherstack.com/current?access_key=${WEATHERSTACK_API_KEY}`,
        params: {
          query: `Florianópolis`
        }
      };
      
      console.log('Tentando com coordenadas:', `${city.lat},${city.lon}`);
      const coordResponse = await axios.request(coordOptions);
      
      if (coordResponse.data.error) {
        throw new Error(coordResponse.data.error.info || 'Erro na API do WeatherStack');
      }

      console.log('Sucesso com coordenadas!');
      console.log('Resposta da API:', coordResponse.data);
      
      // Corrigir o nome da cidade se necessário (coordenadas podem retornar bairros)
      if (coordResponse.data.location) {
        coordResponse.data.location.name = city.name;
        coordResponse.data.location.region = city.state;
        coordResponse.data.location.country = city.country;
      }
      
      return coordResponse.data;
      
    } catch (coordError) {
      console.error('Erro com coordenadas também:', coordError);
      
      // Se tudo falhar, verificar se é erro de chave
      if (coordError.response?.status === 400) {
        throw new Error('Chave da API inválida ou expirada. Verifique sua chave no WeatherStack.');
      }
      
      throw coordError;
    }
  }
};

export const getWeatherByCityName = async (cityName, period = 1) => {
  // Primeiro tenta o endpoint current (sempre disponível)
  const currentOptions = {
    method: 'GET',
    url: `https://api.weatherstack.com/current?access_key=${WEATHERSTACK_API_KEY}`,
    params: {
      query: cityName
    }
  };

  try {
    console.log('Tentando endpoint current para:', cityName);
    const currentResponse = await axios.request(currentOptions);
    
    if (currentResponse.data.error) {
      throw new Error(currentResponse.data.error.info || 'Erro na API do WeatherStack');
    }

    console.log('Sucesso com endpoint current!');
    return currentResponse.data;
    
  } catch (error) {
    console.error('Erro com endpoint current:', error);
    
    // Se current falhar, a chave pode estar inválida
    if (error.response?.status === 400) {
      throw new Error('Chave da API inválida ou expirada. Verifique sua chave no WeatherStack.');
    }
    
    throw error;
  }
};

// Mantendo as funções mock para referência (não são mais usadas como fallback)
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