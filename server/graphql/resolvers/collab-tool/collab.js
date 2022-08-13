import { UserInputError, ApolloError } from 'apollo-server-express';
import { Collab, Project, User } from '../../../models/models';

export default {
    Query: {
        // TODO: projection, pagination, sanitization
        collabs: (root, args, context, info) => Collab.find({ toGuild: args.guildId }),
        collab: async (root, args, context, info) => {
            return Collab.findById(args.id);
        }
    },
    Collab: {
        project: (args) => {
            return Project.findById(args.project);
        },
        requester: (args) => {
            return User.findById(args.requester);
        }
    },
    Mutation: {
        requestCollab: async (root, args, context, info) => {
            const project = await Project.findOne({ discordId: args.discordId });
            console.log(project);

            const collab = await Collab.create(args);
            return collab;
        },
        approveCollab: async (root, args, context, info) => {
            const collab = await Collab.findById(args.id);
            const project = await Project.findOne({ guildId: collab.toGuild });
            await project.updateOne({ spots: project.spots - args.spots });
            const res = await collab.updateOne({ isAccepted: true, status: 'pending' });
            return !!res;
        },
        rejectCollab: async (root, args, context, info) => {
            const collab = await Collab.findById(args.id);
            const res = await collab.delete();
            return !!res;
        }
    }
};