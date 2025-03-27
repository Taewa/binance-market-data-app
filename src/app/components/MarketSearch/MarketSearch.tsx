import AssetPairForm from "../AssetPair/AssetPairForm";
import RecentTrades from "../RecentTrades/RecentTrades";
import Ticker24h from "../Ticker24h/Ticker24h";

const MarketSearch = () => {
  return <>
    <section>
      <AssetPairForm className="mb-8" />
      <Ticker24h />
    </section>
    <RecentTrades />
  </>
}

export default MarketSearch;