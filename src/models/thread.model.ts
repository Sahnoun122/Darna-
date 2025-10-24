import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IThread {
	participants: Types.ObjectId[];
	property?: Types.ObjectId;
	lastMessage?: Types.ObjectId;
	createdBy: Types.ObjectId;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface IThreadDocument extends IThread, Document {}
export interface IThreadModel extends Model<IThreadDocument> {}

const threadSchema = new Schema<IThreadDocument>(
	{
		participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
		property: { type: Schema.Types.ObjectId, ref: 'Property' },
		lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
		createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	},
	{ timestamps: true }
);

export default mongoose.model<IThreadDocument, IThreadModel>('Thread', threadSchema);
