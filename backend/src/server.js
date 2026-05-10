import 'dotenv/config';

import app from './app.js';
import { verifyDatabaseConnection } from './db/pool.js';

const port = process.env.PORT || 5000;

async function startServer() {
  try {
    await verifyDatabaseConnection();

    app.listen(port, () => {
      console.log(`Fuel My Chai API listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
