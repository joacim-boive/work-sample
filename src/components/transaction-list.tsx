'use client';
import { ErrorBoundary } from '@/components/error-boundary';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Transaction } from '@/types';
import React, { useEffect, useState } from 'react';

function TransactionList({
  existingTransactions,
}: {
  existingTransactions: Transaction[];
}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setTransactions(existingTransactions);
  }, [existingTransactions]);

  const formatAccountId = (accountId: string) => {
    if (accountId.length > 10) {
      return accountId.slice(0, 10) + '...';
    }
    return accountId;
  };

  return (
    <ErrorBoundary fallback={<p>There was an error showing transactions</p>}>
      <Table>
        <TableCaption>A list of your recent transactions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Account</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="text-right">Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map(
            ({ accountId, amount, newBalance, action, timestamp }) => {
              return (
                <TableRow
                  key={`${accountId}-${timestamp}`}
                  data-type="transaction"
                  data-account-id={accountId}
                  data-amount={amount}
                  data-balance={newBalance}
                >
                  <TableCell className="font-medium">
                    <span title={accountId}>{formatAccountId(accountId)}</span>
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
            }
          )}
        </TableBody>
      </Table>
    </ErrorBoundary>
  );
}

export default TransactionList;
