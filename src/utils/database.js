// Initialize SQLite database
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

export const connectDb = async () => {
  try {
    return await open({
      filename: './mydb.sqlite',
      driver: sqlite3.Database,
    });
  } catch (error) {
    console.error("Couldn't connect to the database:", error);
    throw new Error('Database connection failed');
  }
};

export const setupDatabase = async () => {
  const db = await connectDb();

  await db.exec(`CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    accountId TEXT UNIQUE, 
    balance REAL,
    action TEXT,
    timestamp INTEGER
  )`);

  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_accountId ON accounts (accountId COLLATE NOCASE ASC);`,
  );

  await db.exec(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    accountId TEXT, 
    amount REAL, 
    timestamp INTEGER,
    action TEXT,
    newBalance REAL,
    FOREIGN KEY(accountId) REFERENCES accounts(accountId)
  )`);

  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_timestamp ON transactions (timestamp DESC);`,
  );
};
