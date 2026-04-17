import axios from 'axios';

// @ts-ignore - Vite will replace this due to define config
const backendUrl = process.env.VITE_BACKEND_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${backendUrl}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const smartFXApi = {
  getCurrencies: async () => {
    const response = await api.get('/currencies');
    return response.data;
  },
  
  exchange: async (from: string, to: string, amount: number) => {
    try {
      const response = await api.get(`/exchange?from=${from}&to=${to}&amount=${amount}`);
      return response.data;
    } catch (error: any) {
      console.log('Exchange Error Response:', error.response);
      
      // Check if ArbitrageFoundException by response status and message
      if (error.response?.status === 400) {
        const message = error.response?.data?.message || '';
        const details = error.response?.data?.details || {};
        const arbitrageCycle = details?.arbitrageCycle || '';
        
        console.log('Message:', message);
        console.log('Details:', details);
        console.log('Cycle:', arbitrageCycle);
        
        if (message.includes('Arbitrage') || arbitrageCycle) {
          throw { 
            type: 'ArbitrageFoundException', 
            message: message,
            cycle: arbitrageCycle 
          };
        }
        
        if (message.includes('not supported') || message.includes('not found')) {
          throw { 
            type: 'InvalidCurrencyException', 
            message: message 
          };
        }
      }
      throw error;
    }
  },
  
  resetDemo: async () => {
    const response = await api.post('/demo/reset');
    return response.data;
  },
  
  injectArbitrage: async (from: string, to: string, rate: number) => {
    const response = await api.post(`/demo/inject-arbitrage?fromCurrency=${from}&toCurrency=${to}&injectedRate=${rate}`);
    return response.data;
  }
};
