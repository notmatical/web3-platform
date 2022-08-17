import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const companySchema = new Schema(
    {
        name: {
            type: String,
            unique: true
        },
        bio: String,
        logoURI: String,
        website: String,
        twitter: String,
        size: {
            type: String,
            enum: ['SMALL', 'MEDIUM', 'LARGE'],
            default: 'SMALL'
        },
        locations: [{
            type: String
        }],
        team: [{
            type: ObjectId,
            ref: 'User'
        }],
        jobs: [{
            type: ObjectId,
            ref: 'Job'
        }],
        verified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Company = model('Company', companySchema);

export default Company;