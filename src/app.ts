import express from 'express';
import dotenv from 'dotenv';
import { registerUser } from './controllers/users.controller';
import { closeReport, createReport } from './controllers/reports.controller';

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  return res.json({ message: 'Yoooooooooooooo' });
});

app.post('/auth/users/register', (req, res) => {
  return res.json({ message: 'ROute working' });
});

app.post('/auth/users/register', registerUser);
app.post('/reports/create', createReport);
app.post('/reports/close', closeReport);

export default app;
