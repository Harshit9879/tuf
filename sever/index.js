import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.js';

import { port } from './constants.js';
import { syncModels } from './utils/connectDb.js';

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

// Routes
app.use('/', userRoutes);

// Sync models with the database
syncModels();

// Home route
app.get('/', (req, res) => {
  res.send(` Backend is running on port number ${port}`);
});

// Start the Express server
app.listen(port, () => {
  console.log(` Backend is listening on port  ${port}`);
});
