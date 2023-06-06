import mongoose from 'mongoose';

import { app } from './app';

const port = 3000;

app.listen(port, () => {
  console.log(`[Server]: I am running at http://localhost:${port}`);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT. Exiting...');
  mongoose
    .disconnect()
    .then((res) => process.exit(0))
    .catch((err) => process.exit(0));
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Exiting...');
  mongoose
    .disconnect()
    .then((res) => process.exit(0))
    .catch((err) => process.exit(0));
});
