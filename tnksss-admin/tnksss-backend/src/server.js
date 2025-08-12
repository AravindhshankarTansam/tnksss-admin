import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import adminRoutes from './routes/admin.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
