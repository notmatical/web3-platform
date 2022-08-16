import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const claimerSchema = new Schema(
    {
        project: String,
        name: String,
        method: String,
        amount: String,
        wallet: String,
        period: String,
        transactionHash: [
            {
                date: String,
                txHash: String
            }
        ],
        time: String
    },
    {
        timestamps: true
    }
);

const Claimer = model('Claimer', claimerSchema);

export default Claimer;