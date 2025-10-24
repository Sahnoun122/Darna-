import { Server, Socket } from 'socket.io';
import Thread from '../models/thread.model';
import Message from '../models/message.model';
import Notification from '../models/notification.model'; // optional
import mongoose from 'mongoose';

/**
 * onlineUsers: Map<userId, Set<socketId>>
 */
const onlineUsers = new Map<string, Set<string>>();

export default function socketHandler(io: Server) {
	io.on('connection', (socket: Socket) => {
		const user = socket.data.user;
		if (!user) {
			socket.disconnect();
			return;
		}
		const userId = String(user._id);

		// add socket id to onlineUsers
		const set = onlineUsers.get(userId) || new Set<string>();
		set.add(socket.id);
		onlineUsers.set(userId, set);

		// join user room
		socket.join(`user:${userId}`);

		// broadcast presence (you can optimize to only friends)
		io.emit('user:presence', { userId, online: true });

		// join a thread room
		socket.on('thread:join', async ({ threadId }: { threadId: string }) => {
			socket.join(`thread:${threadId}`);
			// Optionally mark delivered/read logic
		});

		// send message
		socket.on('message:send', async (payload: any, ack?: Function) => {
			try {
				const { threadId, text, attachments = [], to } = payload;
				// validate thread
				const thread = await Thread.findById(threadId);
				if (!thread) throw new Error('Thread not found');

				const recipients =
					to && to.length ? to : thread.participants.map((p: any) => String(p));
				// convert recipients to ObjectId
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

				// deliver to thread room
				io.to(`thread:${threadId}`).emit('message:new', { message });

				// per-recipient offline notification
				for (const r of recipients) {
					const sockets = onlineUsers.get(String(r));
					if (sockets && sockets.size > 0) {
						// mark delivered locally (we update message.deliveredTo)
						message.deliveredTo.push(new mongoose.Types.ObjectId(r));
					} else {
						// create persistent notification (optional)
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

		// read receipts
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

		// typing
		socket.on('typing', ({ threadId, isTyping }: { threadId: string; isTyping: boolean }) => {
			socket.to(`thread:${threadId}`).emit('typing', { userId, isTyping });
		});

		// lead:create -> create thread if not exists (example)
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
							createdBy: new mongoose.Types.ObjectId(userId),
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

		// disconnect
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
