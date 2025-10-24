import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';
import { User } from '../models/user.model';

export const verifySocketJWT = async (socket: Socket) => {
	const token =
		socket.handshake.auth?.token ||
		(socket.handshake.headers?.authorization || '').replace('Bearer ', '');

	if (!token) throw new Error('No token provided');

	try {
		const payload: any = jwt.verify(token, jwtConfig.secret);
		const userId = payload.sub || payload.id;
		if (!userId) throw new Error('Invalid token payload');

		const user = await User.findById(userId).select('-password');
		if (!user) throw new Error('User not found');

		socket.data.user = user;
	} catch (err) {
		throw new Error('Authentication error');
	}
};
