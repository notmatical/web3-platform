import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const proposalSchema = new Schema(
    {
        author: String,
        title: {
            type: String,
            unique: true
        },
        body: String,
        discussion: String,
        state: {
            type: String,
            default: 'active'
        },
        choices: [{
            type: String,
            default: ['For', 'Against', 'Abstain']
        }],
        forVotes: [{
            type: String
        }],
        againstVotes: [{
            type: String
        }],
        abstainVotes: [{
            type: String
        }],
        postedIn: {
            type: ObjectId,
            ref: 'Space'
        },
        endsAt: String
    },
    {
        timestamps: true
    }
);

const Proposal = model('Proposal', proposalSchema);

export default Proposal;