import { connectDb } from '@/utils/database';
import { NextApiRequest, NextApiResponse } from 'next';
import { Database } from 'sqlite';
import sqlite3 from 'sqlite3';

export default async function getAllAccountIds(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let db: Database<sqlite3.Database, sqlite3.Statement> | undefined;

  try {
    db = await connectDb();
  } catch (error) {
    console.error(
      'getAllAccountIds - unable to connect to the database:',
      error
    );
    return res
      .status(500)
      .json({ message: 'Internal Server Error in getAllAccountIds' });
  }

  try {
    const data = await db?.all(
      'SELECT accountId FROM accounts ORDER BY accountId COLLATE NOCASE ASC LIMIT 1000'
    );
    const accountIds = data?.map((account) => account.accountId);
    return res.status(200).json({ success: true, accountIds });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: 'Error in getAllAccountIds', error });
  }
}
