import { addTransactionSchema } from '@/schemas/transaction-schema';
import { connectDb } from '@/utils/database';
import { NextApiRequest, NextApiResponse } from 'next';
import { Database } from 'sqlite';
import sqlite3 from 'sqlite3';

export default async function addTransaction(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let db: Database<sqlite3.Database, sqlite3.Statement> | undefined;

  try {
    db = await connectDb();
  } catch (error) {
    console.error('addTransaction - unable to connect to the database:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }

  const parsed = addTransactionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: 'Invalid data' });
  }

  const timestamp = Date.now(); // Server's time
  const { accountId, amount } = req.body;
  const action = amount < 0 ? 'withdrawal' : 'deposit';
  const parsedAmount = parseFloat(amount);

  let newBalance = 0;

  // Check if the account exists
  let account = await db?.get('SELECT * FROM accounts WHERE accountId = ?', [
    accountId,
  ]);

  if (!account) {
    if (parsedAmount < 0) {
      return res
        .status(400)
        .json({ message: 'Cannot initialize account with negative balance' });
    }

    newBalance = parsedAmount;
    await db?.run(
      'INSERT INTO accounts (accountId, balance, action, timestamp) VALUES (?, ?, ?, ?)',
      [accountId, parsedAmount, 'created', timestamp],
    );
  } else {
    // Perform the transaction and update the balance
    newBalance = account.balance + parsedAmount;
    await db?.run(
      'UPDATE accounts SET balance = ?, action = ?, timestamp = ? WHERE accountId = ?',
      [newBalance, action, timestamp, accountId],
    );
  }

  // Insert the transaction details into the transactions table
  await db?.run(
    'INSERT INTO transactions (accountId, amount, timestamp, action, newBalance) VALUES (?, ?, ?, ?, ?)',
    [accountId, amount, timestamp, action, newBalance],
  );

  res.status(201).json({ message: 'Transaction added successfully' });
  await db?.close();
}
