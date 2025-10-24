import { Server, Socket } from 'socket.io';
import Thread from '../models/thread.model.js';
import Message from '../models/message.model.js';
import Notification from '../models/notification.model.js';
import mongoose from 'mongoose';

const onlineUsers = new Map<string, Set<string>>();

export default function socketHandler(io: Server) {
	io.on('connection', (socket: Socket) => {
		const user = socket.data.user;
		if (!user) {
			socket.disconnect();
			return;
		}
		const userId = String(user._id);

		const set = onlineUsers.get(userId) || new Set<string>();
		set.add(socket.id);
		onlineUsers.set(userId, set);

		socket.join(`user:${userId}`);

		io.emit('user:presence', { userId, online: true });

		socket.on('thread:join', async ({ threadId }: { threadId: string }) => {
			socket.join(`thread:${threadId}`);
		});

		socket.on('message:send', async (payload: any, ack?: Function) => {
			try {
				const { threadId, text, attachments = [], to } = payload;
				const thread = await Thread.findById(threadId);
				if (!thread) throw new Error('Thread not found');

				const recipients =
					to && to.length ? to : thread.participants.map((p: any) => String(p));
				const recObjIds = recipients.map((r: string) => new mongoose.Types.ObjectId(r));

				const message = await Message.create({
					threadId: new mongoose.Types.ObjectId(threadId),
					from: new mongoose.Types.ObjectId(userId),
					to: recObjIds,
					text,
					attachments,
				});

				thread.lastMessage = message._id as mongoose.Types.ObjectId;
				await thread.save();

				io.to(`thread:${threadId}`).emit('message:new', { message });

				for (const r of recipients) {
					const sockets = onlineUsers.get(String(r));
					if (sockets && sockets.size > 0) {
						message.deliveredTo.push(new mongoose.Types.ObjectId(r));
					} else {
						await Notification.create({
							user: r,
							type: 'new_message',
							payload: { threadId, from: userId, messageId: message._id },
						});
					}
				}
				await message.save();

				if (ack) ack({ status: 'ok', message });
			} catch (err: any) {
				if (ack) ack({ status: 'error', message: err.message });
			}
		});

		socket.on(
			'message:read',
			async ({ threadId, messageIds }: { threadId: string; messageIds: string[] }) => {
				try {
					const objIds = messageIds.map((id) => new mongoose.Types.ObjectId(id));
					await Message.updateMany(
						{ _id: { $in: objIds } },
						{ $addToSet: { readBy: new mongoose.Types.ObjectId(userId) } }
					);
					io.to(`thread:${threadId}`).emit('message:read:update', {
						threadId,
						messageIds,
						userId,
					});
				} catch (err) {
					console.error('message:read error', err);
				}
			}
		);

		socket.on('typing', ({ threadId, isTyping }: { threadId: string; isTyping: boolean }) => {
			socket.to(`thread:${threadId}`).emit('typing', { userId, isTyping });
		});

		socket.on(
			'lead:create',
			async ({ propertyId, sellerId }: { propertyId: string; sellerId: string }) => {
				try {
					let thread = await Thread.findOne({
						property: propertyId,
						participants: {
							$all: [
								new mongoose.Types.ObjectId(userId),
								new mongoose.Types.ObjectId(sellerId),
							],
						},
					});
					if (!thread) {
						thread = await Thread.create({
							property: propertyId ? new mongoose.Types.ObjectId(propertyId) : undefined,
							participants: [
								new mongoose.Types.ObjectId(userId),
								new mongoose.Types.ObjectId(sellerId),
							],
							createBy: new mongoose.Types.ObjectId(userId),
						});
					}
					const sysMsg = await Message.create({
						threadId: thread._id,
						from: new mongoose.Types.ObjectId(userId),
						to: [new mongoose.Types.ObjectId(sellerId)],
						text: 'Lead created',
						isSystem: true,
					});
					io.to(`user:${sellerId}`).emit('lead:new', { thread, sysMsg });
				} catch (err) {
					console.error('lead:create error', err);
				}
			}
		);

		socket.on('disconnect', () => {
			const s = onlineUsers.get(userId);
			if (s) {
				s.delete(socket.id);
				if (s.size === 0) {
					onlineUsers.delete(userId);
					io.emit('user:presence', { userId, online: false });
				} else {
					onlineUsers.set(userId, s);
				}
			}
		});
	});
}
