import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const projectSchema = new Schema(
    {
        guildId: {
            type: String,
            unique: true
        },
        name: {
            type: String,
            unique: true
        },
        description: String,
        template: String,
        spots: Number,
        holderRole: String,
        winningRole: String,
        category: String,
        channel: String,
        price: Number,
        iconHash: String,
        mintPrice: String,
        mintDate: String,
        mintSupply: String,
        discord: String,
        twitter: String,
        managers: [{
            type: ObjectId,
            ref: 'User'
        }],
        collabs: [{
            type: ObjectId,
            ref: 'Collab'
        }],
        isPostMint: Boolean,
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

projectSchema.statics.doesntExist = async function(options) {
    return (await this.where(options).countDocuments()) === 0;
};

const Project = model('Project', projectSchema);

export default Project;