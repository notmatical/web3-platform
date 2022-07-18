import { AuthenticationError } from 'apollo-server-express';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { hash } from 'bcryptjs';
import { User, Social } from '../models/models';

const loggedIn = req => req.session.userId;
const Authorized = req => req.session.userRole;

export const attemptLogIn = async (wallet) => {
    let user = await User.findOne({ wallet });
    let socialStats = await Social.findOne({ wallet });

    if (!user) {
        if (!socialStats) {
            await Social.create({ wallet });
        }
        user = await User.create({ wallet });
    }

    return user;
};

export const signUp = async (wallet, username) => {
    let user = await User.findOne({ wallet });
    if (user) {
        if (!username) {
            if (!user.registered) {
                await user.updateOne({ registered: true });
            }
        } else {
            await user.updateOne({ vanity: username, registered: true });
        }
        return user;
    }

    user = await User.create({ wallet, vanity: username });
    await user.updateOne({ registered: true });
    return user;
}

export const linkDiscord = async (address, id, name, avatar) => {
    let user = await User.findOne({ address });

    if (!user) {
        console.log('[API] Account wasn\'t found while linking Discord');
        user = await User.create({
            address
        });
    }

    console.log('[API] Account found, updating discord info.');
    user = await User.findOneAndUpdate({
        discordId: id,
        discordName: name,
        discordAvatar: avatar,
        isDiscordLinked: true
    });

    return user;
}

export const LogOut = (req, res) =>
    new Promise((resolve, reject) => {
        req.session.destroy(err => {
            if (err) reject(err);

            res.clearCookie('sid');

            resolve(true);
        });
    });

export const verifyPasswordChange = async (req, password, newPassword) => {
    let message = 'Same password used. Please choose a new one.';

    const user = await User.findOne({ _id: loggedIn(req) });

    if (password === newPassword) {
        throw new AuthenticationError(message);
    }

    if (!user || !(await user.matchesPassword(password))) {
        message = 'Incorrect password. Please try again.';
        throw new AuthenticationError(message);
    }

    newPassword = await hash(newPassword, 12);

    return newPassword;
};

export const ensureLoggedIn = req => {
    if (!loggedIn(req)) {
        throw new AuthenticationError('You must be logged in.');
    }
};

export const ensureLoggedOut = req => {
    if (loggedIn(req)) {
        throw new AuthenticationError('You are already logged in.');
    }
};

export const ensureAuthorized = (req, requiredRole) => {
    if (Authorized(req) !== requiredRole) {
        throw new AuthenticationError('You are not Authorized.');
    }
};