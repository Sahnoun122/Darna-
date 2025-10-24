import { Property, IProperty } from '../models/property.model.js';

export class PropertyService {
	async createProperty(data: Partial<IProperty>) {
		const property = new Property(data);
		return await property.save();
	}
	async getAllProperties(filters = {}) {
		return await Property.find(filters).populate('owner', 'name email');
	}
}
