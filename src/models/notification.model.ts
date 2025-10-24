import mongoose, { Document } from 'mongoose';

export interface INotification extends Document {
	user: mongoose.Types.ObjectId;
	type: string;
	payload: any;
	read: boolean;
}

const NotificationSchema = new mongoose.Schema<INotification>(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		type: { type: String, required: true },
		payload: { type: Object },
		read: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

export default mongoose.model<INotification>('Notification', NotificationSchema);
