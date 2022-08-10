import { Space } from '../../models/models';

export default {
    Query: {
        // TODO: projection, pagination, sanitization
        spaces: (root, args, context, info) => Space.find({}),
        space: async (root, { symbol }) => {
            const space = await Space.findOne({ symbol: symbol });
            return space;
        }
    },
    Mutation: {
        addSpace: async (root, args) => {
            const space = await Space.create(args);
            await space.updateOne({ members: args.author });
            return space;
        },
        addMember: async (args, { _id, member }) => {
            const space = await Space.findOneAndUpdate({ _id }, { $addToSet: { members: member } });
            return space;
        }
    }
};