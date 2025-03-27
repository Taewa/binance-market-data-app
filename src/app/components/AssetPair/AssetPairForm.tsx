"use client";

import { MarketData, useMarketData } from "@/app/hooks/MarketData";
import { MarketSearchType } from "@/app/types/biance";
import { Button, Select, Title, Text, Transition, Loader } from "@mantine/core";
import { useForm } from "@mantine/form"
import Ticker from "../Ticker/Ticker";
import { useEffect, useState } from "react";
import GradientBg from "../GradientBg/GradientBg";

type MarketSearchFormValues = {
  baseAsset: string;
  quoteAsset: string;
  searchType: MarketSearchType;
};

const AssetPairForm = ({ className }: {className?: string}) => {
  const [formError, setFormError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const {marketData, isMarketDataLoading, isTicker24hLoading, isMarketDataLoaded, getTicker, get24hTicker, getRecentTrades, hasSymbol} = useMarketData();
  const form = useForm<
    MarketSearchFormValues,
    (values: MarketSearchFormValues) => MarketSearchFormValues & { symbol: string }
    >({
    initialValues: {
      baseAsset: '',
      quoteAsset: '',
      searchType: 'Ticker' as MarketSearchType,
    },
    transformValues: (values) => ({
      ...values,
      symbol: `${values.baseAsset}${values.quoteAsset}`,
    }),
  });

  useEffect(() => {
    const { baseAsset, quoteAsset } = form.values;
    
    fetchTicker(baseAsset, quoteAsset, marketData);
    
  }, [form.values.baseAsset, form.values.quoteAsset]);

  useEffect(() => {
    if(isMarketDataLoaded) {
      setVisible(true);
    }
  }, [isMarketDataLoaded])

  const fetchTicker = (baseAsset: string, quoteAsset: string, marketData: MarketData | null) => {
    if (!baseAsset || !quoteAsset || !marketData) return;

    const symbol = `${baseAsset}${quoteAsset}`;
    const isSymbolAvailable = hasSymbol(symbol, marketData.symbols);

    if (!isSymbolAvailable) {
      setFormError(`Given "${symbol}" is not available.`)
      return;
    }
    
    getTicker(symbol, baseAsset, quoteAsset);
    setFormError(null);
  }

  // Better receiving form as param for simpler test
  const submit = async (_form: typeof form) => {
    if (!_form) return;

    const {symbol} = _form.getTransformedValues();

    await get24hTicker(symbol);
    await getRecentTrades(symbol);
  }

  return <>
    <Transition mounted={visible} transition="fade-down" duration={500} timingFunction="ease-out">
      {(styles) => (
        <section style={styles}>
          <GradientBg className={`${className}`}>
            <form className="w-full max-w-lg p-10 bg-zinc-950 rounded-lg">
              <Title order={2} className="pb-4 text-center">Search Assets</Title>
              <section className="flex justify-between gap-2">
                <Select
                  data={marketData?.assets}
                  searchable
                  label='Select base asset'
                  placeholder="Type or click asset"
                  disabled={isMarketDataLoading}
                  key={form.key('baseAsset')}
                  {...form.getInputProps('baseAsset')}>
                </Select>

                <Select
                  data={marketData?.assets}
                  searchable
                  label='Select quote asset'
                  placeholder="Type or click asset"
                  disabled={isMarketDataLoading}
                  key={form.key('quoteAsset')}
                  {...form.getInputProps('quoteAsset')}>
                </Select>
              </section>

              <section className="flex justify-between items-center pt-4">
                {
                  formError ?
                  <Text size="sm" className="text-red-500">{formError}</Text>
                  :
                  <Ticker />
                }
                <Button
                  onClick={() => submit(form)}
                  disabled={isMarketDataLoading || !!formError}
                  loading={isTicker24hLoading}
                  variant="gradient" 
                  gradient={{ from: 'grape', to: 'blue', deg: 90 }}
                >
                  Check Detail
                </Button>
              </section>
            </form>
          </GradientBg>
        </section>
      )
    }
    </Transition>

    {
      !visible && <Loader color="grape" />
    }
    
  </>
}

export default AssetPairForm