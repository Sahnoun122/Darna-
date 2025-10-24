import http from 'http';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './config/db.js';
import { setupChatSocket } from './socket/chat.socket.js';
import { Server } from 'socket.io';

import authRoutes from './routes/auth.routes.js';

dotenv.config();

await connectDB();

export const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
});

setupChatSocket(io);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
