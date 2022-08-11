import Joi from 'joi';

import { Social, User } from '../../models/models';

export default {
    Query: {
        socials: (root, args, context, info) => Social.find({}),
        social: async (root, args, context, info) => {
            return await Social.findOne({ wallet: args.wallet });
        },
        leaderboard: async (root, args, context, info) => {
            return Social.find().sort({ followersCount: 'desc' }).limit(args.first);
        },
        trending: (root, args, context, info) => {
            return Social.find({})
        }
    },
    Social: {
        user: (args) => {
            return User.findOne({ wallet: args.wallet });
        }
    }
};