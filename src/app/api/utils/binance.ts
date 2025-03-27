import { RestMarketTypes, Spot } from "@binance/connector-typescript";
import { NextResponse } from "next/server";
import {BinanceSymbolStatus, ExchangeInformationSymbols, RecentTradesListResponse, Ticker24hrResponse} from  "../../types/biance"

// Singleton Spot instance
let spotInstance: Spot | null = null;
const getSpotClient = (): Spot => {
  const API_KEY = '';
  const API_SECRET = '';
  const BASE_URL = 'https://api.binance.com';

  if (!spotInstance) {
      spotInstance = new Spot(API_KEY, API_SECRET, { baseURL: BASE_URL });
  }
  return spotInstance;
}

/**
 * get exchangeInformation from Binance and return refined & filtered data
 * @param status is used for filtering market data. By default 'TRADING'
 */
export const getExchangeInfo = async(status: BinanceSymbolStatus = 'TRADING'): Promise<NextResponse> => {
  const client = getSpotClient();
  
  try {
    const res = await client.exchangeInformation();
    const filteredInfo = res.symbols.filter((item) => item.status as BinanceSymbolStatus === status)
    const assets = getAssets(filteredInfo);
    const symbols = extractSymbols(filteredInfo);
    const response = NextResponse.json({ 
      assets,
      symbols,
      // data: filteredInfo  // This is not currently used on frontend. Uncomment when it's necessary
    });

    // 5min caching. If the 'exchangeInformation' doesn't update much, incease more.
    response.headers.set("Cache-Control", "s-maxage=300, stale-while-revalidate=60");
    
    return response;

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

/**
 * returns available assets (ex: ETH, BNB, BTC)
 */
export const getAssets = (assets: ExchangeInformationSymbols[]): string[] => {
  const baseAssets: string[] = assets.map(asset => asset.baseAsset);

  return Array.from(new Set(baseAssets));
}

/**
 * returns available symbols (ex: ETHBNB, BNBBTC)
 */
export const extractSymbols = (assets: ExchangeInformationSymbols[]) => {
  return assets.map(asset => asset.symbol)
}

/**
 * returns ticker info. It contains only price and symbol
 */
export const getTicker = async (symbol: string): Promise<{price: string, symbol: string}> => {
  const client = getSpotClient();
  
  return client.makeRequest('GET', `/api/v3/ticker/price?symbol=${symbol}`,)
}

/**
 * returns ticker24h info.
 */
export const get24hTicker = async (symbol: string): Promise<Ticker24hrResponse | Ticker24hrResponse[]> => {
  if(!symbol) {
    throw new Error(`get24hTicker: No valid symbol`);
  }

  const client = getSpotClient();
  const options: RestMarketTypes.ticker24hrOptions = {
    symbol: symbol,
  };
  
  return client.ticker24hr(options);
}

/**
 * returns recent trades data.
 */
export const recentTrades = async (symbol: string): Promise<RecentTradesListResponse[]> => {
  if(!symbol) {
    throw new Error(`recentTrades: No valid symbol`);
  }

  const client = getSpotClient();
  
  return client.recentTradesList(symbol);
}