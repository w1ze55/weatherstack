import { expect, test } from 'vitest'
import { getExchangeRate } from '../../service/api'

test('should get exchange rate between two currencies', async () => {
    const fromCurrency = 'USD'
    const toCurrency = 'EUR'
    const amount = 1
    
    const result = await getExchangeRate(fromCurrency, toCurrency, amount)
    
    expect(result).toBeDefined()
    expect(result.success).toBe(true)
    expect(result.base).toBe(fromCurrency)
    expect(result.target).toBe(toCurrency)
    expect(result.amount).toBe(amount)
    expect(result.rate).toBeTypeOf('number')
    expect(result.convertedAmount).toBeTypeOf('number')
    expect(result.lastUpdate).toBeDefined()
    expect(result.timestamp).toBeDefined()
})