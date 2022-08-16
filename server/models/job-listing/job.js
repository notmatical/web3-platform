import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const jobSchema = new Schema(
    {
        company: {
            type: ObjectId,
            ref: 'Company'
        },
        category: String,
        title: String,
        location: String,
        jobType: [{
            type: String
        }],
        payRange: [{
            type: String
        }],
        rate: String,
        offers: [{
            type: String
        }],
        description: String,
        status: String
    },
    {
        timestamps: true
    }
);

const Job = model('Job', jobSchema);

export default Job;