"use client";

import { useTicker24hStore } from "@/app/store/ticker24hStore";
import { formatNumber } from "@/app/utils/util";
import GradientBg from "../GradientBg/GradientBg";
import { useEffect, useState } from "react";
import { Transition } from "@mantine/core";

const Ticker24h = () => {
  const [visible, setVisible] = useState(false);
  const ticker24h = useTicker24hStore((state) => state.ticker24h);
  const priceChange = parseFloat(ticker24h?.priceChangePercent!);
  const isPositive = priceChange >= 0;
  
  useEffect(() => {
    if(ticker24h) {
      setVisible(true);
    }
  }, [ticker24h])
  
  if(!ticker24h) return;

  return (
    <Transition mounted={visible} transition="fade" duration={300} timingFunction="ease-out">
      {
        (styles) =>
          <section style={styles}>
            <GradientBg>
              <div className="w-full max-w-lg p-6 bg-zinc-950 rounded-lg">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-2xl font-bold">{ticker24h.symbol}</h1>
                  </div>
                  <div className={`text-xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {formatNumber(ticker24h.lastPrice)}
                    <span className="ml-2">
                      ({isPositive ? '+' : ''}{priceChange.toFixed(2)}%)
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-3 border rounded">
                    <div className="text-sm">Open Price</div>
                    <div className="font-medium">{formatNumber(ticker24h.openPrice)}</div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="text-sm">High Price</div>
                    <div className="font-medium">{formatNumber(ticker24h.highPrice)}</div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="text-sm">Low Price</div>
                    <div className="font-medium">{formatNumber(ticker24h.lowPrice)}</div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="text-sm">Price Change</div>
                    <div className={`font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {formatNumber(ticker24h.priceChange)}
                    </div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="text-sm">Volume</div>
                    <div className="font-medium">{parseFloat(ticker24h.volume).toLocaleString()}</div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="text-sm">Quote Volume</div>
                    <div className="font-medium">{parseFloat(ticker24h.quoteVolume).toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded">
                    <h3 className="text-lg font-semibold mb-2">Bid</h3>
                    <div className="flex justify-between">
                      <div className="text-sm">Bid Price</div>
                      <div className="font-medium">{formatNumber(ticker24h.bidPrice)}</div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-sm">Bid Qty</div>
                      <div className="font-medium">{parseFloat(ticker24h.bidQty).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="p-3 border rounded">
                    <h3 className="text-lg font-semibold mb-2">Ask</h3>
                    <div className="flex justify-between">
                      <div className="text-sm">Ask Price</div>
                      <div className="font-medium">{formatNumber(ticker24h.askPrice)}</div>
                    </div>
                    <div className="flex justify-between">
                      <div className="text-sm">Ask Qty</div>
                      <div className="font-medium">{parseFloat(ticker24h.askQty).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500 pt-2 text-right">
                  {new Date(ticker24h.openTime).toLocaleString()} - {new Date(ticker24h.closeTime).toLocaleString()}
                </div>
              </div>
            </GradientBg>
          </section>
      }
    </Transition>
  );
}

export default Ticker24h;