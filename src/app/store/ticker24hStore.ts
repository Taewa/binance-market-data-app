import { create } from 'zustand'
import { Ticker24h } from '../types/biance';

type Ticker24hState = {
  ticker24h: Ticker24h | null;
  setTicker24h: (trades: Ticker24h) => void;
}

export const useTicker24hStore = create<Ticker24hState>((set) => ({
  ticker24h: null,
  setTicker24h: (ticker24h: Ticker24h) => set({ticker24h}),
}))