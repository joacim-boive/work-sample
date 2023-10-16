import { connectDb } from '@/utils/database';
import { NextApiRequest, NextApiResponse } from 'next';
import { Database } from 'sqlite';
import sqlite3 from 'sqlite3';

export default async function getAllTransactions(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let db: Database<sqlite3.Database, sqlite3.Statement> | undefined;

  try {
    db = await connectDb();
  } catch (error) {
    console.error(
      'getAllTransactions - unable to connect to the database:',
      error
    );
    return res
      .status(500)
      .json({ message: 'Internal Server Error in getAllTransactions' });
  }

  try {
    const transactions = await db.all(
      'SELECT * FROM transactions ORDER BY timestamp DESC LIMIT 1000'
    );
    return res.status(200).json({ success: true, transactions });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: 'Error in getAllTransactions', error });
  }
}
