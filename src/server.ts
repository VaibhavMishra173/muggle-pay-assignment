import express from 'express';
import dotenv from 'dotenv';
import webhookRoute from './routes/webhook';
import queryRoute from './routes/query';


dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (_req, res) => {
  res.send('MugglePay Backend is up!');
});

app.use('/webhook', webhookRoute);

app.use('/query', queryRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
