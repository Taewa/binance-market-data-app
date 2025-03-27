const PREFIX = '/api/';

const API = {
  marketData: `${PREFIX}market`,
  ticker: (symbol: string) => `${PREFIX}ticker?symbol=${symbol}`,
  tickr24: (symbol: string) => `${PREFIX}24h-ticker?symbol=${symbol}`,
  recentTrades: (symbol: string) => `${PREFIX}recent-trades?symbol=${symbol}`,
}

export default API