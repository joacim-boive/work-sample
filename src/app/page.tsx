'use client';
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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';

const queryClient = new QueryClient();

function Page(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-w-screen-lg mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Transaction handler</CardTitle>
            <CardDescription>
              Handles creations of accounts and updates to account balances
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-10 gap-4">
            <NewTransactionCard />
            <TransactionListCard />
          </CardContent>
        </Card>
      </div>
      <Toaster />
      {/*  <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}

export default Page;
