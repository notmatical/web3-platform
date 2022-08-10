import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const spaceSchema = new Schema(
    {
        owner: String,
        name: {
            type: String,
            unique: true,
        },
        creatorWallet: String,
        members: [{
            type: String
        }],
        proposals: [{
            type: ObjectId,
            ref: 'Proposal'
        }],
        symbol: {
            type: String,
            unique: true,
        },
        description: String,
        avatar: String,
        discord: String,
        twitter: String,
        website: String,
        isPartnered: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Space = model('Space', spaceSchema);

export default Space;