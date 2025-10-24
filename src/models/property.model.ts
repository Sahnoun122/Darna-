import { Schema, model, Document } from 'mongoose';

export interface IProperty extends Document {
	title: string;
	description: string;
	transactionType: 'vente' | 'location_journalière' | 'location_mensuelle' | 'location_longue';
	price: number;
	availability: boolean;
	location: {
		address: string;
		city: string;
		latitude: number;
		longitude: number;
	};
	characteristics: {
		surface: number;
		rooms: number;
		bedrooms: number;
		bathrooms: number;
		equipment: string[];
		rules: string[];
		energyRating?: string;
	};
	owner: Schema.Types.ObjectId;
	media: {
		images: string[];
		videos?: string[];
	};
	createdAt: Date;
	updatedAt: Date;
}
