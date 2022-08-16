import { ApolloError } from 'apollo-server-express';
import { Proposal, Space } from '../../../models/models';

export default {
    Query: {
        // TODO: projection, pagination, sanitization
        // proposals: (root, args, context, info) => Proposal.find({}),
        proposals: async (root, args, context, info) => {
            console.log(args);
            const space = await Space.find({ symbol: args.space });
            console.log(space);
            const proposals = await Proposal.find({ state: args.state });
            console.log(proposals);
        },
        proposalsBy: async (root, { author }) => {
            const proposals = await Proposal.find({ author: author });
            return proposals;
        },
        proposalsIn: async (root, { id }) => {
            const proposals = await Proposal.find({ postedIn: id });
            return proposals;
        },
        proposal: async (root, { id }) => {
            const proposal = await Proposal.findById(id);
            return proposal;
        }
    },
    Mutation: {
        createProposal: async (root, args, { postedIn }) => {
            const space = await Space.findOne({ id: postedIn });
            const proposal = await Proposal.create(args);
            await space.updateOne({ proposals: proposal });

            return proposal;
        },
        closeProposal: async (root, { _id }) => {
            const proposal = await Proposal.findOne({ id: _id });
            if (!proposal) {
                throw new ApolloError('Proposal Not Found');
            }
            console.log(proposal);

            const res = await proposal.updateOne({ status: false });
            console.log(!!res);
            return !!res;
        },
        deleteProposal: async (root, { _id }) => {
            const proposal = await Proposal.findOne({ id: _id });
            if (!proposal) {
                throw new ApolloError('Proposal Not Found');
            }

            console.log(proposal);

            const res = await proposal.delete();
            console.log(!!res);
            return !!res;
        },
        voteProposal: async (root, { _id, type, wallet }) => {
            console.log(_id, type, wallet);
            switch (type) {
                case 'for': {
                    const proposal = await Proposal.findOne({ id: _id });
                    if (!proposal) {
                        throw new ApolloError('Proposal Not Found');
                    }

                    await proposal.updateOne({ $addToSet: { forVotes: wallet } });

                    return proposal;
                }

                case 'against': {
                    const proposal = await Proposal.findOne({ id: _id });
                    if (!proposal) {
                        throw new ApolloError('Proposal Not Found');
                    }

                    await proposal.updateOne({ $addToSet: { againstVotes: wallet } });

                    return proposal;
                }

                case 'abstain': {
                    const proposal = await Proposal.findOne({ id: _id });
                    if (!proposal) {
                        throw new ApolloError('Proposal Not Found');
                    }

                    await proposal.updateOne({ $addToSet: { abstainVotes: wallet } });

                    return proposal;
                }

                default: {
                    const proposal = await Proposal.findOne({ id: _id });
                    if (!proposal) {
                        throw new ApolloError('Proposal Not Found');
                    }

                    await proposal.updateOne({ $addToSet: { forVotes: wallet } });

                    return proposal;
                }
            }
        }
    }
};