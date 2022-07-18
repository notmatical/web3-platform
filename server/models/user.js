import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const userSchema = new Schema(
    {
        wallet: {
            type: String,
            unique: true
        },
        vanity: {
            type: String,
            index: { unique: true, sparse: true }
        },
        bio: String,
        avatarURI: String,
        level: {
            type: Number,
            default: 1
        },
        levelUpXpRequired: {
            type: Number,
            default: 500
        },
        xp: {
            type: Number,
            default: 0
        },
        badges: [{
            type: String
        }],
        followed: [{
            type: ObjectId,
            ref: 'User'
        }],
        followers: [{
            type: ObjectId,
            ref: 'User'
        }],
        socialStats: {
            type: ObjectId,
            ref: 'Social'
        },
        registered: {
            type: Boolean,
            default: false
        },
        isStaff: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

userSchema.statics.doesntExist = async function(options) {
    return (await this.where(options).countDocuments()) === 0;
};

const User = model('User', userSchema);

export default User;