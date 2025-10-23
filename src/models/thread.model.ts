import mongoose, { Document, Schema } from 'mongoose';

export interface IThread extends Document {
	propertyId?: string;
	participants: string[];
	lastMessage?: string;
	createdAt?: Date;
}

const ThreadSchema = new Schema<IThread>(
	{
		propertyId: String,
		participants: [{ type: String, required: true }],
		lastMessage: String,
	},
	{ timestamps: true }
);

export const ThreadModel = mongoose.model<IThread>('Thread', ThreadSchema);
