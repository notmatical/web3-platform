import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const collabSchema = new Schema(
    {
        project: {
            type: ObjectId,
            ref: 'Project'
        },
        requester: {
            type: ObjectId,
            ref: 'User'
        },
        offerType: Boolean,
        type: Boolean,
        runTime: Number,
        fromGuild: String,
        toGuild: String,
        holderRole: String,
        winningRole: String,
        category: String,
        channel: String,
        template: String,
        spots: Number,
        spotsFilled: Number,
        status: String,
        isAccepted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Collab = model('Collab', collabSchema);

export default Collab;