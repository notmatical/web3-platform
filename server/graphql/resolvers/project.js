import { UserInputError, ApolloError } from 'apollo-server-express';
import { Project, Collab, User } from '../../models/models';

export default {
    Query: {
        // TODO: projection, pagination, sanitization
        projects: (root, args, context, info) => Project.find({}),
        project: async (root, args, context, info) => {
            return Project.findOne({ guildId: args.guildId });
        }
    },
    Project: {
        collabs: (args) => {
            return Collab.find({ toGuild: args.guildId });
        },
        managers: (args) => {
            return User.find({ _id: args.managers });
        }
    },
    Mutation: {
        addProject: async (root, args, context, info) => {
            console.log(args);
            const project = await Project.create(args);
            return project;
        },
        disableCollabs: async (root, args, context, info) => {
            const project = await Project.findOne({ id: args.id });
            if (!project) {
                throw new ApolloError('Project Not Found');
            }

            const res = await Project.updateOne({ isActive: args.isActive });
            return !!res;
        }
    }
};