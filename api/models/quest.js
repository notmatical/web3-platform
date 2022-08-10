import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const questSchema = new Schema(
    {
        name: {
            type: String,
            unique: true
        },
        description: String,
        expiresAt: String,
        cooldownDays: {
            type: Number,
            default: 0
        },
        rewardedXp: {
            type: Number,
            default: 100
        },
        rewardedPoints: {
            type: Number,
            default: 25
        },
        requiredLevel: {
            type: Number,
            default: 0
        },
        isClaimable: {
            type: Boolean,
            default: false
        },
        isCompletable: {
            type: Boolean,
            default: false
        },
        isCompletableAt: String,
        isExpired: {
            type: Boolean,
            default: false
        },
        isOneOff: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Quest = model('Quest', questSchema);

export default Quest;