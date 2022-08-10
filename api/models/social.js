import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const socialSchema = new Schema(
    {
        wallet: {
            type: String,
            unique: true
        },
        user: {
            type: ObjectId,
            ref: 'User'
        },
        followedCount: {
            type: Number,
            default: 0
        },
        followersCount: {
            type: Number,
            default: 0
        },
        followersRank: Number
    }
);

const Social = model('Social', socialSchema);

export default Social;