import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
	threadId: string;
	senderId: string;
	text?: string;
	attachments?: { url: string; mime?: string; name?: string; size?: number }[];
	readBy?: string[];
	createdAt?: Date;
}

const MessageSchema = new Schema<IMessage>(
	{
		threadId: { type: String, required: true, index: true },
		senderId: { type: String, required: true, index: true },
		text: { type: String, default: '' },
		attachments: [{ url: String, mime: String, name: String, size: Number }],
		readBy: [{ type: String }],
	},
	{ timestamps: { createdAt: true, updatedAt: false } }
);

export const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);
