import { useState, useEffect } from 'react'
import { useTickerStore } from '../store/tickerStore'
import { useRecentTradesStore } from '../store/recentTradesStore'
import { useTicker24hStore } from '../store/ticker24hStore'
import API from '../utils/endpoints'

export type MarketData = {
  assets: string[],
  symbols: string[],
}

export const useMarketData = () => {
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [isMarketDataLoading, setIsMarketDataLoading] = useState(false);
  const [isMarketDataLoaded, setIsMarketDataLoaded] = useState(false);
  const [isTickerLoading, setIsTickerLoading] = useState(false);
  const [isTicker24hLoading, setIsTicker24hLoading] = useState(false);
  const [isRecentTradesLoading, setIsRecentTradesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setTicker = useTickerStore((state) => state.setTicker);
  const setTicker24h = useTicker24hStore((state) => state.setTicker24h);
  const setTrades = useRecentTradesStore((state) => state.setTrades);
  
  const getMarketData = async () => {
    try {
      setIsMarketDataLoading(true)
      setError(null)
      const response = await fetch(API.marketData)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      setMarketData(result)
      setIsMarketDataLoaded(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch market data')
    } finally {
      setIsMarketDataLoading(false)
    }
  }

  const getTicker = async (symbol: string, baseAsset: string, quoteAsset: string) => {
    if(!symbol) {
      throw Error('Failed to fetch ticker data since given symbol is wrong');
    }

    try {
      setIsTickerLoading(true)
      setError(null)
      const response = await fetch(API.ticker(symbol))
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json();
      const ticker = {...result, ...{baseAsset, quoteAsset}};
      
      setTicker(ticker);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ticker data')
    } finally {
      setIsTickerLoading(false)
    }
  }

  const get24hTicker = async (symbol: string) => {
    if(!symbol) {
      throw Error('Failed to fetch ticker data since given symbol is wrong');
    }

    try {
      setIsTicker24hLoading(true)
      setError(null)
      const response = await fetch(API.tickr24(symbol))
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setTicker24h(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ticker data')
    } finally {
      setIsTicker24hLoading(false)
    }
  }

  const getRecentTrades = async (symbol: string) => {
    if(!symbol) {
      throw Error('Failed to fetch ticker data since given symbol is wrong');
    }

    try {
      setIsRecentTradesLoading(true)
      setError(null)
      const response = await fetch(API.recentTrades(symbol))
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setTrades(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ticker data')
    } finally {
      setIsRecentTradesLoading(false)
    }
  }

  const hasSymbol = (symbol: string, list: string[]): boolean => {
    return list.includes(symbol);
  }

  useEffect(() => {
    getMarketData();
  }, [])

  return { 
    marketData, 
    isMarketDataLoading, 
    isMarketDataLoaded,
    isTickerLoading,
    isTicker24hLoading,
    isRecentTradesLoading,
    error, 
    getMarketData, 
    getTicker, 
    get24hTicker, 
    getRecentTrades,
    hasSymbol,
  }
}