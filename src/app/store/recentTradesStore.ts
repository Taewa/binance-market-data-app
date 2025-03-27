import { create } from 'zustand'
import { Trade } from '../types/biance';

type TradesState = {
  trades: Trade[] | null;
  setTrades: (trades: Trade[]) => void;
}

export const useRecentTradesStore = create<TradesState>((set) => ({
  trades: [],
  setTrades: (trades: Trade[]) => set({trades}),
}))