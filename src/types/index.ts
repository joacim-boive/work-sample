export interface Transaction {
  id: number;
  accountId: string;
  amount: number;
  timestamp: number;
  action: string;
  newBalance: number;
}
