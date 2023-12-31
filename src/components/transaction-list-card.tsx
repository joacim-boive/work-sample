'use client';

import TransactionList from '@/components/transaction-list';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function TransactionListCard() {
  return (
    <div className="col-span-7">
      <Card>
        <CardHeader>
          <CardTitle>Transaction history</CardTitle>
          <CardDescription>
            Lists transactions in descending order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionList />
        </CardContent>
      </Card>
    </div>
  );
}
