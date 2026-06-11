import express from 'express';
import cors from 'cors';
import studentRoutes from './routes/studentRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import backupRoutes from './routes/backupRoutes.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/students', studentRoutes);
app.use('/paymentHistory', paymentRoutes);
app.use('/backup', backupRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Library Management Server running on http://localhost:${PORT}`);
});
