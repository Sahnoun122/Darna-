import { Request, Response, NextFunction } from 'express';
import { ThreadModel } from '../models/thread.model';
import { IMessage } from '../models/message.model';

export const createThread = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { participants, propertyId } = req.body;
		if (!Array.isArray(participants) || participants.length < 1) {
			return res.status(400).json({ ok: false, error: 'participants required' });
		}
		const thread = await ThreadModel.create({ participants, propertyId });
		return res.json({ ok: true, thread });
	} catch (err) {
		next(err);
	}
};

export const getThreadMessages = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { threadId } = req.params;
		const messages = await IMessage.find({ threadId }).sort({ createdAt: 1 }).limit(500);
		return res.json({ ok: true, messages });
	} catch (err) {
		next(err);
	}
};
