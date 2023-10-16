import { setupDatabase } from './database.js';

const init = async () => {
  try {
    await setupDatabase();
    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
};

init();
