import { Upgrade } from '../../models/models';

export default {
    Query: {
        // TODO: projection, pagination, sanitization
        artSwitchers: (root, args, context, info) => Upgrade.find({}),
        artSwitcher: async (root, args, context, info) => {
            return Upgrade.findOne({ mintKey: args.mintKey });
        }
    },
    Mutation: {
        createArtSwitcher: async (root, args, context, info) => {
            const upgrade = await Upgrade.create(args);
            return upgrade;
        }
    }
};