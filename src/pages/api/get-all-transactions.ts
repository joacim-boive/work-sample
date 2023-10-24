import { connectDb } from '@/utils/database';
import { NextApiRequest, NextApiResponse } from 'next';
import { Database } from 'sqlite';
import sqlite3 from 'sqlite3';

export default async function getAllTransactions(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  let db: Database<sqlite3.Database, sqlite3.Statement> | undefined;

  try {
    db = await connectDb();
  } catch (error) {
    console.error(
      'getAllTransactions - unable to connect to the database:',
      error,
    );
    return res
      .status(500)
      .json({ message: 'Internal Server Error in getAllTransactions' });
  }

  try {
    const {
      limit = 10,
      cursor = Date.now(),
    }: { limit?: number; cursor?: number } = req.query;

    const limitPlusOne = limit + 1;

    let nextCursor: number | undefined;
    let query = `
      SELECT *
      FROM transactions
      WHERE timestamp < $cursor
      ORDER BY timestamp DESC
      LIMIT $limitPlusOne
    `;

    const transactions = await db.all(query, {
      $limitPlusOne: limitPlusOne,
      $cursor: cursor,
    });

    // Check if extra item exists to determine if we have a nextCursor for paging
    const hasNextPage = transactions.length === limitPlusOne;
    // Remove extra item if it exists
    if (hasNextPage) {
      transactions.pop();
      nextCursor = transactions[transactions.length - 1]?.timestamp;
    }

    res.status(200).json({
      success: true,
      transactions,
      nextCursor,
    });
  } catch (error) {
    console.error('getAllTransactions - error:', error);
    return res.status(400).json({
      success: false,
      message: 'Error in getAllTransactions',
      error: error.message,
    });
  }
}
