import { User } from '../models/models';

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