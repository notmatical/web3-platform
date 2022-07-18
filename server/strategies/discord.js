import passport from 'passport';
import DiscordStrategy from 'passport-discord';
import User from '../models/user';

import * as Auth from '../helpers/auth';

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser(async(discordId, done) => {
    try {
        const user = await User.findOne({ discordId });
        return user ? done(null, user) : done(null, null);
    } catch (err) {
        console.log(err);
        done(err, null);
    }
});

passport.use(
    new DiscordStrategy({
        clientID: '966881151451005019',
        clientSecret: 'eJb7UqaMGVCSIilQLv1WJYYjCatpwiGt',
        callbackURL: '/api/v1/auth/redirect',
        scope: ['identify', 'guilds', 'guilds.members.read'],
        passReqToCallback: true,
        state: true
    }, async(req, accessToken, refreshToken, profile, done) => {
        const { id, username, avatar } = profile;

        try {
            const user = await User.findOneAndUpdate({ address: req.query.state }, {
                discordId: id,
                discordName: `${username}`,
                isDiscordLinked: true,
                discordAvatar: avatar,
            }, { new: true });
    
            if (user) {
                console.log('USERS EXISTS', user);
                return done(null, user);
            } else {
                user = await User.create({
                    address,
                    discordId: id,
                    discordName: `${username}`,
                    isDiscordLinked: true,
                    discordAvatar: avatar,
                });
    
                console.log('DONE(NULL, USER)');
                return done(null, user);
            }
        } catch (err) {
            console.log('ERROR');
            console.log(err);
            return done(err, null);
        }
    })
);