import { Company, Job, User } from '../../../models/models';

export default {
    CompanySize: {
        SMALL: '1-50',
        MEDIUM: '50-100',
        LARGE: '100-500'
    },
    Query: {
        getCompanies: () => Company.find({}),
        getCompany: async (root, { company }) => {
            return await Company.findOne({ name: company });
        }
    },
    Mutation: {
        createCompany: async (root, args) => {
            try {
                const company = args;
                const res = await Company.create({ ...company });
                return res;
            } catch (err) {
                console.error(err.message);
            }
        }
    },
    Company: {
        team: (args) => {
            return User.find({ wallet: args.wallet });
        },
        jobs: (args) => {
            return Job.find({});
        }
    }
};