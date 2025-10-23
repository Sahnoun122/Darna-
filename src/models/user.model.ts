import bcrypt from 'bcryptjs';
import { Schema, model, Document, Model } from 'mongoose';

export interface IUser {
	username: string;
	email: string;
	password: string;
	plan: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
	comparePassword(candidate: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument> {}

const userSchema = new Schema<IUserDocument, IUserModel>(
	{
		username: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		plan: {
			type: String,
			required: true,
			default: 'basic',
		},
	},
	{
		timestamps: true,
	}
);

userSchema.pre('save', async function hashPassword(next) {
	if (!this.isModified('password')) {
		return next();
	}

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		return next();
	} catch (error) {
		return next(error as Error);
	}
});

userSchema.methods.comparePassword = function comparePassword(candidate: string): Promise<boolean> {
	return bcrypt.compare(candidate, this.password);
};

userSchema.set('toJSON', {
	transform: (_document, returned: any) => {
		returned.id = returned._id.toString();
		delete returned._id;
		delete (returned as { __v?: number }).__v;
		delete (returned as { password?: string }).password;
		return returned;
	},
});

export const User = model<IUserDocument, IUserModel>('User', userSchema);
