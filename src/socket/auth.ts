// src/socket/auth.ts
import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
// import { UserModel } from '../models/user.model';
// import { JWT_SECRET } from '../config/jwt';

export async function socketAuth(socket: Socket, next: (err?: any) => void) {
	try {
		const auth = socket.handshake.auth as any;
		let token = auth?.token as string | undefined;

		if (!token && socket.handshake.headers?.authorization) {
			const header = socket.handshake.headers.authorization as string;
			if (header.startsWith('Bearer ')) token = header.split(' ')[1];
		}

		if (!token) return next(new Error('No token'));

		// const decoded = jwt.verify(token, JWT_SECRET as string) as any;
		// const user = await UserModel.findById(decoded.id).select('-password');
		// if (!user) return next(new Error('Unauthorized'));

		socket.data.user = { id: user._id.toString(), role: user.role, name: user.name };
		return next();
	} catch (err) {
		console.error('socketAuth error:', err);
		return next(new Error('Unauthorized'));
	}
}
