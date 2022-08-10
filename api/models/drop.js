import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const dropSchema = new Schema(
    {
        time: String,
        title: {
            type: String,
            unique: true
        },
        price: String,
        twitter: String
    },
    {
        timestamps: true
    }
);

const Drop = model('Drop', dropSchema);

export default Drop;