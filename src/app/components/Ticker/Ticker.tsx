import { useTickerStore } from "@/app/store/tickerStore"
import { formatNumber } from "@/app/utils/util";
import { Text } from "@mantine/core";

const Ticker = () => {
  const ticker = useTickerStore((state) => state.ticker);

  if (!ticker) return <div></div>
  
  return (
    <>
      <section className="flex items-center">
        <Text className="text-sm pr-2">
          1 {ticker.baseAsset} is 
          <span className="ml-1">{formatNumber(ticker.price)} {ticker.quoteAsset}</span>
        </Text>
      </section>
    </>
  )
}

export default Ticker