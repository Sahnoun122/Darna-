// src/socket/index.ts
import http from 'http';
import { Server } from 'socket.io';
import { socketAuth } from './auth';
// import { chatHandlers } from './chat.handlers';

export function initSocket(server: http.Server) {
	const io = new Server(server, {
		cors: {
			origin: process.env.CLIENT_URL || '*',
			methods: ['GET', 'POST'],
		},
		pingInterval: 10000,
		pingTimeout: 5000,
	});

	io.use(socketAuth);

	io.on('connection', (socket) => {
		const user = (socket.data as any).user;
		console.log(`🔌 Socket connected: ${socket.id} user:${user?.id}`);

		if (user?.id) socket.join(`user:${user.id}`);

		// chatHandlers(io, socket);

		socket.on('disconnect', (reason) => {
			console.log(`🔌 Socket disconnected: ${socket.id} reason:${reason}`);
		});
	});

	return io;
}
