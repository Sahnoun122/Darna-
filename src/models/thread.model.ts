import mongoose, { Document } from 'mongoose';

export interface IThread extends Document {
	property?: mongoose.Types.ObjectId;
	participants: mongoose.Types.ObjectId[];
	lastMessage?: mongoose.Types.ObjectId;
	createdBy?: mongoose.Types.ObjectId;
	unreadCounts?: Map<string, number>;
}

const ThreadSchema = new mongoose.Schema<IThread>(
	{
		property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
		participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
		createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		unreadCounts: { type: Map, of: Number, default: {} },
	},
	{ timestamps: true }
);

ThreadSchema.index({ participants: 1 });

export default mongoose.model<IThread>('Thread', ThreadSchema);
