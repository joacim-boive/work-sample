'use client';
import { ErrorBoundary } from '@/components/error-boundary';
import Spinner from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { formatAccountId, formatCurrency, formatDate } from '@/lib/utils';
import type { Transaction } from '@/types';
import { apiAllTransactions } from '@/urls';
import {
  InfiniteQueryObserverResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface CustomError extends Error {
  message: string;
}

interface TransactionData {
  pages: {
    transactions: Transaction[];
  }[];
}

const fetchTransactions = async ({ pageParam }) => {
  const url = !!pageParam
    ? apiAllTransactions + `?cursor=${pageParam}`
    : apiAllTransactions;

  const response = await axios.get(url);
  return response.data;
};

export default function TransactionList() {
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  }: InfiniteQueryObserverResult<TransactionData> = useInfiniteQuery({
    queryKey: [apiAllTransactions],
    queryFn: fetchTransactions,
    staleTime: Infinity,
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
  const { ref, inView } = useInView();
  const { toast } = useToast();

  useEffect(() => {
    if (inView) {
      console.log('inview');
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  useEffect(() => {
    if (!isFetchingNextPage && !hasNextPage) {
      toast({
        title: 'No more transactions',
        description: 'This was the last of your transactions',
      });
    }
  }, [isFetchingNextPage, hasNextPage, toast]);

  return (
    <ErrorBoundary fallback={<p>There was an error showing transactions</p>}>
      <Table>
        <TableCaption>A list of your recent transactions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px] sticky top-0">Account</TableHead>
            <TableHead className="sticky top-0">Date</TableHead>
            <TableHead className="sticky top-0">Action</TableHead>
            <TableHead className="sticky top-0">Amount</TableHead>
            <TableHead className="sticky top-0 text-right">Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.pages?.map(
            (page) =>
              page?.transactions?.map(
                ({
                  accountId,
                  amount,
                  newBalance,
                  action,
                  timestamp,
                }: Transaction) => {
                  return (
                    <TableRow
                      key={`${accountId}-${timestamp}`}
                      data-type="transaction"
                      data-account-id={accountId}
                      data-amount={amount}
                      data-balance={newBalance}
                    >
                      <TableCell className="font-medium">
                        <span title={accountId}>
                          {formatAccountId(accountId)}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatDate(timestamp)}
                      </TableCell>
                      <TableCell>{action}</TableCell>
                      <TableCell>{formatCurrency(amount)}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(newBalance)}
                      </TableCell>
                    </TableRow>
                  );
                },
              ),
          )}
        </TableBody>
      </Table>
      <button
        ref={ref}
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage || isFetching}
      >
        {isFetchingNextPage ||
          (isFetching && (
            <>
              <Spinner />
              {'Loading...'}
            </>
          ))}
        {!isFetchingNextPage &&
          hasNextPage &&
          'Load older transactions - inView: ' + inView}
      </button>
    </ErrorBoundary>
  );
}
