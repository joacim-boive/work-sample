'use client';

import TransactionList from '@/components/transaction-list';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Spinner from '@/components/ui/spinner';
import { Transaction } from '@/types';
import { apiAllTransactions } from '@/urls';
import { QueryObserverResult, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
const fetchTransactions = async () => {
  const response = await axios.get(apiAllTransactions);
  return response.data.transactions;
};

interface CustomError extends Error {
  message: string;
}

export default function TransactionListCard() {
  const {
    data: transactions = [],
    error,
    isLoading,
  }: QueryObserverResult<Transaction[], CustomError> = useQuery({
    queryKey: [apiAllTransactions],
    queryFn: fetchTransactions,
    staleTime: Infinity,
  });

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Transaction history</CardTitle>
        <CardDescription>
          Lists transactions in descending order
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <Spinner />
            Loading transactions...
          </>
        ) : error ? (
          <div>Error fetching transactions: {error?.message}</div>
        ) : (
          <TransactionList existingTransactions={transactions} />
        )}
      </CardContent>
    </Card>
  );
}
