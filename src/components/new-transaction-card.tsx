'use client';

import NewTransactionForm from '@/components/new-transaction-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Spinner from '@/components/ui/spinner';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function NewTransactionCard() {
  const [accountIds, setAccountIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    axios
      .get('/api/get-all-account-ids')
      .then((response) => {
        const { success, accountIds } = response.data;
        if (success) {
          setAccountIds(accountIds);
          setIsError(false);
        } else {
          setIsError(true);
        }
      })
      .catch((error) => {
        setIsError(true);
        console.error('/api/get-all-account-ids error:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <Card className="col-span-3 mb-4">
      <CardHeader>
        <CardTitle>Submit new transaction</CardTitle>
        <CardDescription>
          Make a withdrawal by entering a negative amount
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <p>
            <Spinner />
            Loading existing accounts...
          </p>
        )}
        {isError && <p>There was an error loading account IDs</p>}
        {!isLoading && !isError && (
          <NewTransactionForm existingAccountIds={accountIds} />
        )}
      </CardContent>
    </Card>
  );
}
