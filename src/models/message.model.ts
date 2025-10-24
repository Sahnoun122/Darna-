import mongoose, { Document } from 'mongoose';

export interface IMessage extends Document {
	threadId: mongoose.Types.ObjectId;
	from: mongoose.Types.ObjectId;
	to: mongoose.Types.ObjectId[];
	text?: string;
	attachments?: { url: string; filename?: string }[];
	readBy: mongoose.Types.ObjectId[];
	deliveredTo: mongoose.Types.ObjectId[];
	isSystem?: boolean;
}

const AttachmentSchema = new mongoose.Schema({
	url: { type: String, required: true },
	filename: { type: String },
});

const MessageSchema = new mongoose.Schema<IMessage>(
	{
		threadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true },
		from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		to: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		text: { type: String },
		attachments: [AttachmentSchema],
		readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		deliveredTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		isSystem: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

MessageSchema.index({ threadId: 1, createdAt: -1 });

export default mongoose.model<IMessage>('Message', MessageSchema);
