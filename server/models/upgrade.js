import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const upgradeSchema = new Schema(
    {
        mintKey: {
            type: String,
            unique: true
        },
        metadata: [{
            uri: {
                type: String
            },
            image: {
                type: String
            }
        }]
    },
    {
        timestamps: true
    }
);

const Upgrade = model('Upgrade', upgradeSchema);

export default Upgrade;