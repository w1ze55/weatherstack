import axios from 'axios';
 
const EXCHANGE_API_KEY = 'baf452609858215d255d234df5659ab4';
 
export const getExchangeRate = async (fromCurrency, toCurrency, amount = 1) => {
  try {
    console.log(`Buscando cotação de ${fromCurrency} para ${toCurrency}...`);
 
    let response;
    try {
      response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
     
      if (response.data && response.data.rates) {
        const rates = response.data.rates;
       
        if (!rates[toCurrency]) {
          throw new Error(`Moeda de destino ${toCurrency} não encontrada`);
        }
 
        const exchangeRate = rates[toCurrency];
        const convertedAmount = amount * exchangeRate;
 
        console.log('Cotação obtida com sucesso (API gratuita)!');
       
        return {
          success: true,
          base: fromCurrency,
          target: toCurrency,
          rate: exchangeRate,
          amount: amount,
          convertedAmount: convertedAmount,
          lastUpdate: response.data.date || new Date().toISOString().split('T')[0],
          timestamp: new Date().toISOString()
        };
      }
    } catch (freeApiError) {
      console.log('API gratuita falhou, tentando com sua chave...', freeApiError.message);
     
      try {
        response = await axios.get(`https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/${fromCurrency}`);
       
        if (response.data && response.data.result === 'success') {
          const rates = response.data.conversion_rates;
         
          if (!rates[toCurrency]) {
            throw new Error(`Moeda de destino ${toCurrency} não encontrada`);
          }
 
          const exchangeRate = rates[toCurrency];
          const convertedAmount = amount * exchangeRate;
 
          console.log('Cotação obtida com sucesso (API com chave)!');
         
          return {
            success: true,
            base: fromCurrency,
            target: toCurrency,
            rate: exchangeRate,
            amount: amount,
            convertedAmount: convertedAmount,
            lastUpdate: response.data.time_last_update_utc,
            timestamp: new Date().toISOString()
          };
        }
      } catch (keyApiError) {
        console.log('API com chave também falhou, tentando alternativa...', keyApiError.message);
       
        // Terceira tentativa: API alternativa
        response = await axios.get(`https://api.fixer.io/latest?access_key=${EXCHANGE_API_KEY}&base=${fromCurrency}&symbols=${toCurrency}`);
       
        if (response.data && response.data.success) {
          const rates = response.data.rates;
         
          if (!rates[toCurrency]) {
            throw new Error(`Moeda de destino ${toCurrency} não encontrada`);
          }
 
          const exchangeRate = rates[toCurrency];
          const convertedAmount = amount * exchangeRate;
 
          console.log('Cotação obtida com sucesso (Fixer API)!');
         
          return {
            success: true,
            base: fromCurrency,
            target: toCurrency,
            rate: exchangeRate,
            amount: amount,
            convertedAmount: convertedAmount,
            lastUpdate: response.data.date,
            timestamp: new Date().toISOString()
          };
        }
      }
    }
   
    throw new Error('Todas as APIs falharam');
 
  } catch (error) {
    console.error('Erro ao buscar cotação:', error);
   
    if (error.response?.status === 404) {
      throw new Error(`Moeda de origem ${fromCurrency} não encontrada`);
    }
   
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('Chave da API inválida, expirada ou sem permissão. Usando dados de exemplo.');
    }
   
    if (error.response?.status >= 500) {
      throw new Error('Serviço de cotação temporariamente indisponível. Tente novamente em alguns minutos.');
    }
   
    return {
      success: true,
      base: fromCurrency,
      target: toCurrency,
      rate: mockRate,
      amount: amount,
      convertedAmount: amount * mockRate,
      lastUpdate: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      isMock: true
    };
  }
};
 
export const getSupportedCurrencies = async () => {
  try {
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
   
    if (response.data && response.data.rates) {
      const currencies = Object.keys(response.data.rates);
      currencies.push('USD');
      return currencies.sort();
    }
 
  } catch (error) {
    console.error('Erro ao buscar moedas suportadas:', error);
  }
  return [
    'AED', 'ARS', 'AUD', 'BGN', 'BRL', 'BSD', 'CAD', 'CHF', 'CLP', 'CNY',
    'COP', 'CZK', 'DKK', 'DOP', 'EGP', 'EUR', 'FJD', 'GBP', 'GTQ', 'HKD',
    'HRK', 'HUF', 'IDR', 'ILS', 'INR', 'ISK', 'JPY', 'KRW', 'KZT', 'MXN',
    'MYR', 'NOK', 'NZD', 'PAB', 'PEN', 'PHP', 'PKR', 'PLN', 'PYG', 'RON',
    'RUB', 'SAR', 'SEK', 'SGD', 'THB', 'TRY', 'TWD', 'UAH', 'USD', 'UYU',
    'VND', 'ZAR'
  ];
};
 
export const isCurrencySupported = async (currency) => {
  try {
    const supportedCurrencies = await getSupportedCurrencies();
    return supportedCurrencies.includes(currency.toUpperCase());
  } catch (error) {
    console.error('Erro ao validar moeda:', error);
    return false;
  }
};