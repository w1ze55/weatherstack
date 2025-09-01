import { useState, useEffect } from 'react'
import { currencies, searchCurrencies, getCurrencyById } from '../data/currencies'
import { getExchangeRate } from '../service/api'
import './App.css'

function App() {
  const [filteredFromCurrencies, setFilteredFromCurrencies] = useState([])
  const [filteredToCurrencies, setFilteredToCurrencies] = useState([])
  const [selectedFromCurrencyId, setSelectedFromCurrencyId] = useState('')
  const [selectedToCurrencyId, setSelectedToCurrencyId] = useState('')
  const [amount, setAmount] = useState(1)
  const [exchangeData, setExchangeData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fromSearchTerm, setFromSearchTerm] = useState('')
  const [toSearchTerm, setToSearchTerm] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    setFilteredFromCurrencies(currencies)
    setFilteredToCurrencies(currencies)
  }, [])

  const handleFromSearchChange = (e) => {
    const value = e.target.value
    setFromSearchTerm(value)
    const filtered = searchCurrencies(value)
    setFilteredFromCurrencies(filtered)
    
    if (selectedFromCurrencyId && !filtered.find(currency => currency.id === parseInt(selectedFromCurrencyId))) {
      setSelectedFromCurrencyId('')
    }
  }

  const handleToSearchChange = (e) => {
    const value = e.target.value
    setToSearchTerm(value)
    const filtered = searchCurrencies(value)
    setFilteredToCurrencies(filtered)
    
    if (selectedToCurrencyId && !filtered.find(currency => currency.id === parseInt(selectedToCurrencyId))) {
      setSelectedToCurrencyId('')
    }
  }

  const handleAmountChange = (e) => {
    const value = e.target.value
    if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
      setAmount(value === '' ? '' : parseFloat(value))
    }
  }

  const getExchange = async () => {
    if (!selectedFromCurrencyId) {
      setError('Por favor, selecione a moeda de origem')
      return
    }

    if (!selectedToCurrencyId) {
      setError('Por favor, selecione a moeda de destino')
      return
    }

    if (selectedFromCurrencyId === selectedToCurrencyId) {
      setError('Por favor, selecione moedas diferentes')
      return
    }

    const fromCurrency = getCurrencyById(selectedFromCurrencyId)
    const toCurrency = getCurrencyById(selectedToCurrencyId)
    
    if (!fromCurrency || !toCurrency) {
      setError('Moeda não encontrada')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const data = await getExchangeRate(fromCurrency.code, toCurrency.code, amount || 1)
      setExchangeData(data)
    } catch (error) {
      console.error('Erro ao buscar cotação:', error)
      setError(`Erro ao buscar cotação: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const swapCurrencies = () => {
    const tempId = selectedFromCurrencyId
    const tempSearch = fromSearchTerm
    const tempFiltered = filteredFromCurrencies

    setSelectedFromCurrencyId(selectedToCurrencyId)
    setFromSearchTerm(toSearchTerm)
    setFilteredFromCurrencies(filteredToCurrencies)

    setSelectedToCurrencyId(tempId)
    setToSearchTerm(tempSearch)
    setFilteredToCurrencies(tempFiltered)
  }

  const clearResults = () => {
    setExchangeData(null)
    setError(null)
    setSelectedFromCurrencyId('')
    setSelectedToCurrencyId('')
    setAmount(1)
    setFromSearchTerm('')
    setToSearchTerm('')
    setFilteredFromCurrencies(currencies)
    setFilteredToCurrencies(currencies)
  }
  return (
    <div className="container">
      <h1>💰 Conversor de Moedas</h1>
      <div className="input-container">
        <div className="amount-section">
          <h3>Valor a Converter</h3>
          <input
            type="number"
            placeholder="Digite o valor..."
            value={amount}
            onChange={handleAmountChange}
            className="amount-input"
            min="0"
            step="0.01"
          />
        </div>

        <div className="currency-row">
          <div className="currency-section from-currency">
            <h3>Moeda de Origem</h3>
            <div className="search-section">
              <input
                type="text"
                placeholder="Buscar moeda..."
                value={fromSearchTerm}
                onChange={handleFromSearchChange}
                className="search-input"
              />
            </div>
            <select
              value={selectedFromCurrencyId}
              onChange={(e) => setSelectedFromCurrencyId(e.target.value)}
              className="currency-select"
            >
              <option value="">Selecione a moeda de origem</option>
              {filteredFromCurrencies.map((currency) => (
                <option key={currency.id} value={currency.id}>
                  {currency.flag} {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          <div className="swap-section">
            <button
              onClick={swapCurrencies}
              className="swap-btn"
              disabled={loading}
              title="Trocar moedas"
            >
              🔄
            </button>
          </div>

          <div className="currency-section to-currency">
            <h3>Moeda de Destino</h3>
            <div className="search-section">
              <input
                type="text"
                placeholder="Buscar moeda..."
                value={toSearchTerm}
                onChange={handleToSearchChange}
                className="search-input"
              />
            </div>
            <select
              value={selectedToCurrencyId}
              onChange={(e) => setSelectedToCurrencyId(e.target.value)}
              className="currency-select"
            >
              <option value="">Selecione a moeda de destino</option>
              {filteredToCurrencies.map((currency) => (
                <option key={currency.id} value={currency.id}>
                  {currency.flag} {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="button-section">
          <button
            onClick={getExchange}
            disabled={loading || !selectedFromCurrencyId || !selectedToCurrencyId}
            className="exchange-btn primary"
          >
            {loading ? 'Convertendo...' : 'Converter'}
          </button>

          {(exchangeData || error) && (
            <button
              onClick={clearResults}
              className="exchange-btn secondary"
            >
              Limpar
            </button>
          )}
        </div>
      </div>
      {error && (
        <div className="error-message">
          <h3>❌ Erro ao buscar cotação</h3>
          <p>{error}</p>
        </div>
      )}

      {exchangeData && !error && (
        <div className="exchange-result">
          <h2>💱 Resultado da Conversão</h2>
          
          <div className="conversion-main">
            <div className="conversion-display">
              <div className="from-amount">
                <span className="amount-label">Valor Original:</span>
                <span className="amount-value">
                  {getCurrencyById(selectedFromCurrencyId)?.symbol} {exchangeData.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="currency-info">
                  {getCurrencyById(selectedFromCurrencyId)?.flag} {exchangeData.base}
                </span>
              </div>
              
              <div className="conversion-arrow">
                ➡️
              </div>
              
              <div className="to-amount">
                <span className="amount-label">Valor Convertido:</span>
                <span className="amount-value converted">
                  {getCurrencyById(selectedToCurrencyId)?.symbol} {exchangeData.convertedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="currency-info">
                  {getCurrencyById(selectedToCurrencyId)?.flag} {exchangeData.target}
                </span>
              </div>
            </div>
          </div>

          <div className="exchange-details">
            <div className="rate-info">
              <h3>📊 Detalhes da Cotação</h3>
              <div className="rate-display">
                <div className="rate-item">
                  <span className="rate-label">Taxa de Câmbio:</span>
                  <span className="rate-value">
                    1 {exchangeData.base} = {exchangeData.rate.toLocaleString('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} {exchangeData.target}
                  </span>
                </div>
                <div className="rate-item">
                  <span className="rate-label">Taxa Inversa:</span>
                  <span className="rate-value">
                    1 {exchangeData.target} = {(1 / exchangeData.rate).toLocaleString('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} {exchangeData.base}
                  </span>
                </div>
              </div>
            </div>

                      <div className="update-info">
            <h4>🕒 Informações de Atualização</h4>
            <div className="update-details">
              <p><strong>Última atualização:</strong> {exchangeData.lastUpdate}</p>
              <p><strong>Consulta realizada em:</strong> {new Date(exchangeData.timestamp).toLocaleString('pt-BR')}</p>
              {exchangeData.isMock && (
                <p style={{color: '#e74c3c', fontWeight: 'bold'}}>
                  ⚠️ <strong>Atenção:</strong> Usando dados simulados para demonstração
                </p>
              )}
            </div>
          </div>
          </div>

          <div className="quick-amounts">
            <h4>💡 Conversões Rápidas</h4>
            <div className="quick-grid">
              {[1, 10, 100, 1000].map((quickAmount) => (
                <div key={quickAmount} className="quick-item">
                  <span className="quick-from">
                    {getCurrencyById(selectedFromCurrencyId)?.symbol} {quickAmount.toLocaleString('pt-BR')}
                  </span>
                  <span className="quick-equals">=</span>
                  <span className="quick-to">
                    {getCurrencyById(selectedToCurrencyId)?.symbol} {(quickAmount * exchangeData.rate).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="info-section">
        <h4>ℹ️ Informações</h4>
        <p>
          Este aplicativo utiliza a <strong>ExchangeRate API</strong> para obter cotações de moedas em tempo real.
          {currencies.length} moedas disponíveis para conversão.
        </p>
        <p>
          As cotações são atualizadas regularmente e podem variar conforme o mercado financeiro.
        </p>
      </div>
    </div>
  )
}

export default App