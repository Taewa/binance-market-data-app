import { getExchangeInfo } from '../utils/binance';
 
export async function GET() {
  return await getExchangeInfo();
}