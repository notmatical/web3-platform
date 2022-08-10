import fetch from 'node-fetch';

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_API = "http://discord.com/api/v6";

const getGuildName = async (guildId) => {
    const response = await fetch(`${DISCORD_API}/guilds/${guildId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bot OTY2ODgxMTUxNDUxMDA1MDE5.YmIMPg.NG0yKY24O1AEQYsg5eASzvpPLco`
        }
    }).then((res) => res.json());

    return response.name;
};

const getGuildAvatar = async (guildId) => {
    const response = await fetch(`${DISCORD_API}/guilds/${guildId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bot OTY2ODgxMTUxNDUxMDA1MDE5.YmIMPg.NG0yKY24O1AEQYsg5eASzvpPLco`
        }
    }).then((res) => res.json());

    return response.icon;
};

export { getGuildName, getGuildAvatar };