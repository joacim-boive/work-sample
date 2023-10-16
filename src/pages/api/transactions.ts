import 'server-only';

import { connectDb } from '@/utils/database';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Database } from 'sqlite';
import sqlite3 from 'sqlite3';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let db: Database<sqlite3.Database, sqlite3.Statement> | undefined;

  try {
    db = await connectDb();
  } catch (error) {
    console.error('transactions - unable to connect to the database:', error);
    return res
      .status(500)
      .json({ message: 'Internal Server Error in transactions' });
  }
  const timestamp = Date.now();

  if (req.method === 'POST') {
    handlePostRequest(req, res);
  } else if (req.method === 'GET') {
    handleGetRequest(req, res);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
    await db?.close();
  }

  async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
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

  async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
    // Handle GET request to fetch all transactions
    const transactions = await db?.all('SELECT * FROM transactions');
    res.status(200).json(transactions);
    await db?.close();
  }
};
