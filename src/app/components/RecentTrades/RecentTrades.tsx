"use client";

import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { Trade } from '@/app/types/biance';
import { useRecentTradesStore } from '@/app/store/recentTradesStore';
import { Title, Transition } from '@mantine/core';
import { cutByPage, formatDate, formatNumber } from '@/app/utils/util';
import GradientBg from '../GradientBg/GradientBg';

const PAGE_SIZE = 15;

const RecentTrades = () => {
  const [visible, setVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Trade>>({
    columnAccessor: 'name',
    direction: 'asc',
  });
  const tradeData = useRecentTradesStore((state) => state.trades);
  const [records, setRecords] = useState(sortBy(tradeData, 'id').slice(0, PAGE_SIZE));

  useEffect(() => {
    const { from, to, record } = sortTable(tradeData, sortStatus, PAGE_SIZE);
    setRecords(record.slice(from, to));
  }, [sortStatus, tradeData]);

  useEffect(() => {
    if (!tradeData) return;
    const { from, to } = cutByPage(page, PAGE_SIZE);
    setRecords(tradeData.slice(from, to));
  }, [page]);

  useEffect(() => {
    if (tradeData && tradeData.length > 0) {
      setVisible(true);
    }
  }, [tradeData]);

  const sortTable = (_tradeData: typeof tradeData, _sortStatus: typeof sortStatus, pageSize: number) => {
    const data = sortBy(tradeData, sortStatus.columnAccessor);
    const { from, to } = cutByPage(1, pageSize);
    const record = sortStatus.direction === 'desc' ? data.reverse() : data
    return { from, to, record }
  }

  return (
    <Transition mounted={visible} transition="fade" duration={300} timingFunction="ease-out">
    {
      (styles) =>
        <section className='w-full max-w-2xl'>
          <Title order={3} className='pb-6'>Recent Trades</Title>
          <GradientBg>
            <DataTable
              style={styles}
              className='bg-zinc-950'
              records={records}
              withTableBorder
              withColumnBorders
              striped
              borderRadius="md"
              highlightOnHover
              totalRecords={tradeData.length}
              recordsPerPage={PAGE_SIZE}
              page={page}
              paginationActiveBackgroundColor="black"
              rowClassName={() => 'bg-zinc-950'}
              onPageChange={(p) => setPage(p)}
              sortStatus={sortStatus}
              onSortStatusChange={setSortStatus}
              columns={[
                { 
                  accessor: 'id', 
                  sortable: true,
                  visibleMediaQuery: (theme) => `(min-width: ${theme.breakpoints.sm})`,
                },
                { 
                  accessor: 'price', 
                  sortable: true, 
                  render: ({price}) => {
                    return formatNumber(price)
                  }
                },
                { 
                  accessor: 'qty', 
                  sortable: true ,
                  render: ({qty}) => {
                    return formatNumber(qty)
                  }
                },
                { 
                  accessor: 'quoteQty', 
                  sortable: true,
                  render: ({quoteQty}) => {
                    return formatNumber(quoteQty)
                  }
                },
                { accessor: 'time', 
                  title: 'Date', 
                  sortable: true,
                  render: ({time}) => formatDate(time) 
                },
                { accessor: 'isBuyerMaker', 
                  title: 'Maker?', 
                  textAlign: 'center',
                  sortable: true,
                  visibleMediaQuery: (theme) => `(min-width: ${theme.breakpoints.sm})`,
                  render: ({isBuyerMaker}) => {
                    return isBuyerMaker ? <span>Yes</span> : <span>No</span>
                  }
                },
                { accessor: 'isBestMatch', 
                  title: 'Best match?', 
                  textAlign: 'center',
                  sortable: true,
                  visibleMediaQuery: (theme) => `(min-width: ${theme.breakpoints.xs})`,
                  render: ({isBestMatch}) => {
                    return isBestMatch ? <span>Yes</span> : <span>No</span>
                  }
                },
              ]}
            />
          </GradientBg>
        </section>
    }
    </Transition>
  );
}

export default RecentTrades;