import bcrypt from 'bcryptjs';
import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IUser {
	username: string;
	email: string;
	password: string;
	plan?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {
	_id: Types.ObjectId;
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
			default: 'basic',
		},
	},
	{
		timestamps: true,
	}
);

userSchema.pre<IUserDocument>('save', async function (next) {
	if (!this.isModified('password')) return next();

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error as Error);
	}
});

userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
	return bcrypt.compare(candidate, this.password);
};

userSchema.set('toJSON', {
	transform: (_document, returned: any) => {
		returned.id = returned._id instanceof Types.ObjectId ? returned._id.toString() : returned._id;
		delete returned._id;
		delete returned.__v;
		delete returned.password;
		return returned;
	},
});

export const User = model<IUserDocument, IUserModel>('User', userSchema);
