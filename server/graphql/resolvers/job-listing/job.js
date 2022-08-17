import { Company, Job, User } from '../../../models/models';

export default {
    Query: {
        getJobs: () => Job.find({}),
        getJob: async (root, { id }) => {
            return await Job.findOne({ _id: id });
        },
        getJobsByCompany: async (root, { company }) => {
            return await Job.find({ company: company });
        },
        getRecentJobListings: async (root, { limit }) => {
            return Job.find().sort({ createdAt: 'desc' }).limit(limit);
        }
    },
    Mutation: {
        createJob: async (root, args) => {
            try {
                const job = args;
                const res = await Job.create({ ...job });

                const company = await Company.findOne({ _id: job.company });
                await company.updateOne({ $addToSet: { jobs: res }});

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