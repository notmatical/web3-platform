import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const walletSchema = new Schema(
	{
		project: {
			type: String,
			unique: true,
		},
		secretKey: {
			type: String,
			unique: true,
		},
		owner: {
			type: ObjectId,
			ref: 'User'
		}
	},
	{
		timestamps: true
	}
);

const Wallet = model('Wallet', walletSchema);

export default Wallet;