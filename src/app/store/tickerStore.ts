import { create } from 'zustand'
import { Ticker } from '../types/biance';

type TickerState = {
  ticker: Ticker | null;
  setTicker: (ticker: Ticker) => void;
}

export const useTickerStore = create<TickerState>((set) => ({
  ticker: null,
  setTicker: (ticker) => set({ ticker }),
}))