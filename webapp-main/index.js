import 'dotenv/config';

import express from 'express';
const app = express();

import customResponses from './utils/index.js';

import sequelize from './database.js';
import userRoutes from './controllers/user.js';

const port = 3000;
app.use(express.json());
app.use(customResponses);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const version = 'v1'
app.use(`/${version}/user`, userRoutes);

app.get(`/${version}/healthz`, async (req, res) => {
  if (Object.keys(req.body).length > 0 || Object.keys(req.query).length > 0) {
    return res.status(400).end();
  }
  try {
    await sequelize.authenticate();
    res.set('Cache-Control', 'no-cache');
    res.status(200).end();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(503).end();
  }
});

app.all(`/${version}/healthz`, async (req, res) => {
  res.status(405).end();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// comment
export default app;