import NewTransactionCard from '@/components/new-transaction-card';
import TransactionListCard from '@/components/transaction-list-card';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Toaster } from '@/components/ui/toaster';
import { RefreshProvider } from '@/context/refresh-context';
import React from 'react';

function Page(): JSX.Element {
  return (
    <RefreshProvider>
      <div className="max-w-screen-lg mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Transaction handler</CardTitle>
            <CardDescription>
              Handles creations of accounts and updates to account balances
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row">
            <NewTransactionCard />
            <TransactionListCard />
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </RefreshProvider>
  );
}

export default Page;
