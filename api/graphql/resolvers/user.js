import { User, Social } from '../../models/models';
import * as Auth from '../../helpers/auth';

export default {
    Query: {
        // TODO: projection, pagination, sanitization
        users: (root, args, context, info) => User.find({}),
        user: async (root, args, context, info) => {
            return User.findOne({ wallet: args.wallet });
        }
    },
    User: {
        socialStats: (args) => {
            return Social.findOne({ wallet: args.wallet });
        },
        followed: () => {
            return User.find({});
        },
        followers: () => {
            return User.find({});
        }
    },
    Mutation: {
        login: async (root, args, context, info) => {
            const user = await Auth.attemptLogIn(args.wallet);
            return user;
        },
        signup: async (root, args, context, info) => {
            const user = await Auth.signUp(args.wallet, args.vanity);
            return user;
        },
        updateAvatar: async (root, args, context, info) => {
            const user = await User.findOne({ wallet: args.wallet });
            await user.updateOne({ avatarURI: args.avatar });
            return user;
        },
        follow: async (root, args, context, info) => {
            if (args.userAddress === args.userAddressToFollow) return;
            const user = await User.findOne({ wallet: args.userAddress });
            const userSocial = await Social.findOne({ wallet: args.userAddress });
            const userBeingFollowed = await User.findOne({ wallet: args.userAddressToFollow });
            const userBeingFollowedSocial = await Social.findOne({ wallet: args.userAddressToFollow });
            if (user && userBeingFollowed) {
                if (userBeingFollowed.followers.includes(user.id)) return;
                await user.updateOne({ $addToSet: { followed: userBeingFollowed }});
                await userSocial.updateOne({ $inc: { followedCount: 1 }});

                await userBeingFollowed.updateOne({ $addToSet: { followers: user } });
                await userBeingFollowedSocial.updateOne({ $inc: { followersCount: 1 }});

                return user;
            }
        },
        unfollow: async (root, args, context, info) => {
            if (args.userAddress === args.userAddressToUnfollow) return;
            const user = await User.findOne({ wallet: args.userAddress });
            const userSocial = await Social.findOne({ wallet: args.userAddress });
            const userBeingUnfollowed = await User.findOne({ wallet: args.userAddressToUnfollow });
            const userBeingUnfollowedSocial = await Social.findOne({ wallet: args.userAddressToUnfollow });
            if (user && userBeingUnfollowed) {
                if (!userBeingUnfollowed.followers.includes(user.id)) return;
                await user.updateOne({ $pull: { followed: userBeingUnfollowed.id } });
                await userSocial.updateOne({ $inc: { followedCount: -1 }});

                await userBeingUnfollowed.updateOne({ $pull: { followers: user.id } });
                await userBeingUnfollowedSocial.updateOne({ $inc: { followersCount: -1 }});

                return user;
            }
        },
        changeUsername: async (root, args, context, info) => {
            return 'test';
        }
    }
};