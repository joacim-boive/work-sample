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
import { apiAllAccountIds } from '@/urls';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchAccountIds = async () => {
  const response = await axios.get(apiAllAccountIds);
  return response.data.accountIds;
};

export default function NewTransactionCard() {
  const {
    data: accountIds = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: [apiAllAccountIds],
    queryFn: fetchAccountIds,
    staleTime: Infinity,
  });

  return (
    <Card className="mb-4 sm:mr-4 md:self-start md:w-1/3">
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
