import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import twoFARoutes from './routes/twoFA.routes.js';

dotenv.config();

await connectDB();

export const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/2fa', twoFARoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
