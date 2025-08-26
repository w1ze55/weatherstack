import { useState, useEffect } from 'react'
import { cities, searchCities, getCityById } from '../data/cities'
import { getWeatherByCity } from '../service/api'
import './App.css'

function App() {
  const [filteredCities, setFilteredCities] = useState([])
  const [selectedCityId, setSelectedCityId] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState(1)
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState(null)

  const periodOptions = [
    { value: 1, label: '1 dia' },
    { value: 2, label: '2 dias' },
    { value: 3, label: '3 dias' },
    { value: 4, label: '4 dias' },
    { value: 5, label: '5 dias' },
    { value: 6, label: '6 dias' },
    { value: 7, label: '7 dias' }
  ]

  useEffect(() => {
    setFilteredCities(cities)
  }, [])

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    const filtered = searchCities(value)
    setFilteredCities(filtered)
    
    if (selectedCityId && !filtered.find(city => city.id === parseInt(selectedCityId))) {
      setSelectedCityId('')
    }
  }

  const getWeather = async () => {
    if (!selectedCityId) {
      setError('Por favor, selecione uma cidade')
      return
    }

    const selectedCity = getCityById(selectedCityId)
    if (!selectedCity) {
      setError('Cidade não encontrada')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const data = await getWeatherByCity(selectedCity, selectedPeriod)
      
      if (data.error) {
        throw new Error(data.error.info || 'Erro na API do Weatherstack')
      }
      
      setWeatherData(data)
    } catch (error) {
      console.error('Erro ao buscar dados meteorológicos:', error)
      setError(`Erro ao buscar dados meteorológicos: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const clearResults = () => {
    setWeatherData(null)
    setError(null)
    setSelectedCityId('')
    setSelectedPeriod(1)
    setSearchTerm('')
    setFilteredCities(cities)
  }
  return (
    <div className="container">
      <h1>Weather Stack</h1>
      <div className="input-container">
        <div className="search-section">
          <h3>Buscar Cidades</h3>
          <input
            type="text"
            placeholder='Digite o nome da cidade...'
            value={searchTerm}
            onChange={handleSearchChange}
            className='search-input'
          />
        </div>

        <div className="select-section">
          <h3>Cidade</h3>
          <select
            value={selectedCityId}
            onChange={(e) => setSelectedCityId(e.target.value)}
            className='city-select'
          >
            <option value="">Selecione uma cidade</option>
            {filteredCities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}, {city.state} - {city.country}
              </option>
            ))}
          </select>
        </div>

        <div className="period-section">
          <h3>Período de previsão</h3>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
            className='period-select'
          >
            {periodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="button-section">
          <button
            onClick={getWeather}
            disabled={loading || !selectedCityId}
            className='weather-btn primary'
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>

          {(weatherData || error) && (
            <button
              onClick={clearResults}
              className='weather-btn secondary'
            >
              Limpar
            </button>
          )}
        </div>
      </div>
      {error && (
        <div className="error-message">
          <h3>Erro ao buscar dados</h3>
          <p>{error}</p>
        </div>
      )}

      {weatherData && !error && (
        <div className="weather-result">
          <h2>📍 Clima em {weatherData.location?.name || 'Cidade'}</h2>
          <p className="forecast-period">Previsão para {selectedPeriod} {selectedPeriod === 1 ? 'dia' : 'dias'}</p>

          {/* Dados atuais */}
          {weatherData.current && (
            <div className="weather-info">
              <div className="weather-main">
                <div className="temperature">
                  <h3>{weatherData.current.temperature}°C</h3>
                  <p className="feels-like">Sensação: {weatherData.current.feelslike}°C</p>
                </div>
                <div className="weather-description">
                  {weatherData.current.weather_icons && weatherData.current.weather_icons[0] && (
                    <img
                      src={weatherData.current.weather_icons[0]}
                      alt="Ícone do clima"
                      className="weather-icon"
                    />
                  )}
                  <p>{weatherData.current.weather_descriptions?.[0] || 'N/A'}</p>
                </div>
              </div>

              <div className="weather-details">
                <div className="detail-item">
                  <span className="detail-label">💧 Umidade</span>
                  <span className="detail-value">{weatherData.current.humidity}%</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">💨 Vento</span>
                  <span className="detail-value">{weatherData.current.wind_speed} km/h {weatherData.current.wind_dir}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">🌡️ Pressão</span>
                  <span className="detail-value">{weatherData.current.pressure} hPa</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">☁️ Nuvens</span>
                  <span className="detail-value">{weatherData.current.cloudcover}%</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">👁️ Visibilidade</span>
                  <span className="detail-value">{weatherData.current.visibility} km</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">☀️ Índice UV</span>
                  <span className="detail-value">{weatherData.current.uv_index}</span>
                </div>
              </div>
            </div>
          )}

          {/* Previsão para múltiplos dias */}
          {weatherData.forecast && weatherData.forecast.forecastday && (
            <div className="forecast-section">
              <h3>📊 Previsão Detalhada</h3>
              <div className="forecast-grid">
                {weatherData.forecast.forecastday.slice(0, selectedPeriod).map((day, index) => (
                  <div key={index} className="forecast-day">
                    <h4>{new Date(day.date).toLocaleDateString('pt-BR', {
                      weekday: 'short',
                      day: '2-digit',
                      month: '2-digit'
                    })}</h4>
                    <div className="forecast-temps">
                      <span className="max-temp">{day.day.maxtemp_c}°</span>
                      <span className="min-temp">{day.day.mintemp_c}°</span>
                    </div>
                    {day.day.condition && day.day.condition.icon && (
                      <img
                        src={`https:${day.day.condition.icon}`}
                        alt={day.day.condition.text}
                        className="forecast-icon"
                      />
                    )}
                    <p className="forecast-condition">{day.day.condition?.text || 'N/A'}</p>
                    <div className="forecast-details">
                      <small>💧 {day.day.avghumidity}%</small>
                      <small>💨 {day.day.maxwind_kph} km/h</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {weatherData.location && (
            <div className="location-info">
              <h4>📍 Informações da Localização</h4>
              <div className="location-details">
                <p><strong>Localização:</strong> {weatherData.location.name}, {weatherData.location.region} - {weatherData.location.country}</p>
                <p><strong>Coordenadas:</strong> {weatherData.location.lat}, {weatherData.location.lon}</p>
                <p><strong>Hora local:</strong> {weatherData.location.localtime}</p>
                {weatherData.location.timezone_id && (
                  <p><strong>Fuso horário:</strong> {weatherData.location.timezone_id} (UTC {weatherData.location.utc_offset})</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="info-section">
        <h4>ℹ️ Informações</h4>
        <p>
          Este aplicativo utiliza a API do <strong>Weatherstack</strong> para obter dados meteorológicos em tempo real.
          {filteredCities.length} cidades disponíveis para consulta.
        </p>
        <p>
          Selecione o período desejado (1 a 7 dias) para obter previsões mais detalhadas.
        </p>
      </div>
    </div>
  )
}

export default App