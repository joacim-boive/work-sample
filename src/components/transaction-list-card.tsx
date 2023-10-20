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
import { useRefresh } from '@/context/refresh-context';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function TransactionListCard() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { refreshKey } = useRefresh();

  useEffect(() => {
    axios
      .get('/api/get-all-transactions')
      .then((response) => {
        const { success, transactions } = response.data;
        if (success) {
          setTransactions(transactions);
          setIsError(false);
        } else {
          setIsError(true);
        }
      })
      .catch((error) => {
        setIsError(true);
        console.error('/api/get-all-transactions error:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [refreshKey]);

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Transaction history</CardTitle>
        <CardDescription>
          Lists transactions in descending order
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <p>
            <Spinner /> Loading transactions...
          </p>
        )}
        {isError && <p>There was an error loading transactions</p>}
        {!isLoading && !isError && (
          <TransactionList existingTransactions={transactions} />
        )}
      </CardContent>
    </Card>
  );
}
