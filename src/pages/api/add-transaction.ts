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

  const { accountId, amount } = req.body;
  const timestamp = Date.now(); // Server's time

  const parsed = addTransactionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: 'Invalid data' });
  }

  try {
    await db?.run(
      'INSERT INTO transactions (accountId, amount, timestamp) VALUES (?, ?, ?)',
      [accountId, amount, timestamp],
    );
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
}
