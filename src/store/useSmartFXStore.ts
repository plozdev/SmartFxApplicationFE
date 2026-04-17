import { create } from 'zustand';

interface ExchangeResult {
  fromCurrency: string;
  toCurrency: string;
  originalAmount: number;
  convertedAmount: number;
  effectiveRate: number;
  path: string[];
}

interface SmartFXState {
  currencies: string[];
  lastResult: ExchangeResult | null;
  isLoading: boolean;
  error: string | null;
  arbitrageDetected: string | null;
  
  setCurrencies: (currencies: string[]) => void;
  setLastResult: (result: ExchangeResult | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setArbitrageDetected: (msg: string | null) => void;
}

export const useSmartFXStore = create<SmartFXState>((set) => ({
  currencies: [],
  lastResult: null,
  isLoading: false,
  error: null,
  arbitrageDetected: null,

  setCurrencies: (currencies) => set({ currencies }),
  setLastResult: (result) => set({ lastResult: result, error: null }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, lastResult: null }),
  setArbitrageDetected: (msg) => set({ arbitrageDetected: msg, lastResult: null, error: null }),
}));
