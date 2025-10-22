import { User, IUserDocument } from "../models/user.model.js";
import { signAccessToken } from "../config/jwt.js";

export class AuthServiceError extends Error {
	public statusCode: number;

	constructor(message: string, statusCode = 400) {
		super(message);
		this.name = "AuthServiceError";
		this.statusCode = statusCode;
	}
}

export interface RegisterInput {
	username: string;
	email: string;
	password: string;
	plan: string;
}

export interface LoginInput {
	email: string;
	password: string;
}

export interface AuthenticatedUser {
	id: string;
	username: string;
	email: string;
	plan: string;
	createdAt: string;
	updatedAt: string;
}

export interface AuthResponse {
	user: AuthenticatedUser;
	accessToken: string;
}

const sanitizeUser = (user: IUserDocument): AuthenticatedUser => {
	const plain = user.toJSON() as unknown as {
		id: string;
		username: string;
		email: string;
		plan: string;
		createdAt: Date;
		updatedAt: Date;
	};

	const toIso = (value: Date | string): string =>
		value instanceof Date ? value.toISOString() : new Date(value).toISOString();

	return {
		id: plain.id,
		username: plain.username,
		email: plain.email,
		plan: plain.plan,
		createdAt: toIso(plain.createdAt),
		updatedAt: toIso(plain.updatedAt),
	};
};

class AuthService {
	async register(data: RegisterInput): Promise<AuthResponse> {
		const email = data.email.trim().toLowerCase();
		const existingUser = await User.findOne({ email });

		if (existingUser) {
			throw new AuthServiceError("Email already registered", 409);
		}

		const user = new User({
			username: data.username.trim(),
			email,
			password: data.password,
			plan: data.plan.trim() || "basic",
		});

		await user.save();

		const accessToken = signAccessToken({ userId: user.id });
		return {
			user: sanitizeUser(user),
			accessToken,
		};
	}

	async login(data: LoginInput): Promise<AuthResponse> {
		const email = data.email.trim().toLowerCase();
		const user = await User.findOne({ email });

		if (!user) {
			throw new AuthServiceError("Invalid credentials", 401);
		}

		const isPasswordValid = await user.comparePassword(data.password);
		if (!isPasswordValid) {
			throw new AuthServiceError("Invalid credentials", 401);
		}

		const accessToken = signAccessToken({ userId: user.id });
		return {
			user: sanitizeUser(user),
			accessToken,
		};
	}
}

export const authService = new AuthService();
