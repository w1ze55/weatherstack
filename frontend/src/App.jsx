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
  const [showFromSuggestions, setShowFromSuggestions] = useState(false)
  const [showToSuggestions, setShowToSuggestions] = useState(false)
  const [selectedFromSuggestion, setSelectedFromSuggestion] = useState(-1)
  const [selectedToSuggestion, setSelectedToSuggestion] = useState(-1)

  useEffect(() => {
    setFilteredFromCurrencies(currencies)
    setFilteredToCurrencies(currencies)
  }, [])

  const handleFromSearchChange = (e) => {
    const value = e.target.value
    setFromSearchTerm(value)
    const filtered = searchCurrencies(value)
    setFilteredFromCurrencies(filtered)
    setShowFromSuggestions(value.length > 0 && filtered.length > 0)
    setSelectedFromSuggestion(-1)
    
    if (selectedFromCurrencyId && !filtered.find(currency => currency.id === parseInt(selectedFromCurrencyId))) {
      setSelectedFromCurrencyId('')
    }
  }

  const handleToSearchChange = (e) => {
    const value = e.target.value
    setToSearchTerm(value)
    const filtered = searchCurrencies(value)
    setFilteredToCurrencies(filtered)
    setShowToSuggestions(value.length > 0 && filtered.length > 0)
    setSelectedToSuggestion(-1)
    
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

  const selectFromSuggestion = (currency) => {
    setSelectedFromCurrencyId(currency.id.toString())
    setFromSearchTerm(`${currency.flag} ${currency.code} - ${currency.name}`)
    setShowFromSuggestions(false)
    setSelectedFromSuggestion(-1)
  }

  const selectToSuggestion = (currency) => {
    setSelectedToCurrencyId(currency.id.toString())
    setToSearchTerm(`${currency.flag} ${currency.code} - ${currency.name}`)
    setShowToSuggestions(false)
    setSelectedToSuggestion(-1)
  }

  const handleFromKeyDown = (e) => {
    if (!showFromSuggestions) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedFromSuggestion(prev => 
          prev < filteredFromCurrencies.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedFromSuggestion(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedFromSuggestion >= 0) {
          selectFromSuggestion(filteredFromCurrencies[selectedFromSuggestion])
        }
        break
      case 'Escape':
        setShowFromSuggestions(false)
        setSelectedFromSuggestion(-1)
        break
    }
  }

  const handleToKeyDown = (e) => {
    if (!showToSuggestions) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedToSuggestion(prev => 
          prev < filteredToCurrencies.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedToSuggestion(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedToSuggestion >= 0) {
          selectToSuggestion(filteredToCurrencies[selectedToSuggestion])
        }
        break
      case 'Escape':
        setShowToSuggestions(false)
        setSelectedToSuggestion(-1)
        break
    }
  }
  return (
    <div className="container">
      <h1>Conversor de Moedas</h1>
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
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Buscar moeda..."
                  value={fromSearchTerm}
                  onChange={handleFromSearchChange}
                  onKeyDown={handleFromKeyDown}
                  onFocus={() => fromSearchTerm && setShowFromSuggestions(filteredFromCurrencies.length > 0)}
                  onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
                  className="search-input"
                />
                {showFromSuggestions && (
                  <div className="suggestions-dropdown">
                    {filteredFromCurrencies.slice(0, 8).map((currency, index) => (
                      <div
                        key={currency.id}
                        className={`suggestion-item ${index === selectedFromSuggestion ? 'selected' : ''}`}
                        onClick={() => selectFromSuggestion(currency)}
                      >
                        <span className="currency-flag">{currency.flag}</span>
                        <span className="currency-code">{currency.code}</span>
                        <span className="currency-name">{currency.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
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
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Buscar moeda..."
                  value={toSearchTerm}
                  onChange={handleToSearchChange}
                  onKeyDown={handleToKeyDown}
                  onFocus={() => toSearchTerm && setShowToSuggestions(filteredToCurrencies.length > 0)}
                  onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
                  className="search-input"
                />
                {showToSuggestions && (
                  <div className="suggestions-dropdown">
                    {filteredToCurrencies.slice(0, 8).map((currency, index) => (
                      <div
                        key={currency.id}
                        className={`suggestion-item ${index === selectedToSuggestion ? 'selected' : ''}`}
                        onClick={() => selectToSuggestion(currency)}
                      >
                        <span className="currency-flag">{currency.flag}</span>
                        <span className="currency-code">{currency.code}</span>
                        <span className="currency-name">{currency.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
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
          <h2>Resultado da Conversão</h2>
          
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
                →
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
    </div>
  )
}

export default App