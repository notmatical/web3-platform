import { Company, Job, User } from '../../../models/models';

export default {
    Query: {
        getJobs: () => Job.find({}),
        getJob: async (root, { id }) => {
            return await Job.findOne({ _id: id });
        },
        getJobsByCompany: async (root, { company }) => {
            return await Job.find({ company: company });
        }
    },
    Mutation: {
        createJob: async (root, args) => {
            try {
                const job = args;
                const res = await Job.create({ ...job });
                return res;
            } catch (err) {
                console.error(err.message);
            }
        }
    },
    Job: {
        company: (args) => {
            return Company.findOne({ _id: args.company });
        }
    }
};