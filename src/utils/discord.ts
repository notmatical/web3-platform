import axios from 'axios';
import Placeholder from 'assets/images/placeholder.png';

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_API = 'http://discord.com/api/v6';

// Helper Displays
const displayUserAvatar = (id: string, avatarHash: string) => `https://cdn.discordapp.com/avatars/${id}/${avatarHash}.png`;
const displayGuildIcon = (id: string, iconHash: string | null) => {
    if (!iconHash) return Placeholder;

    return `https://cdn.discordapp.com/icons/${id}/${iconHash}.png?size=1024`;
};

// API calls
const getUserDetails = () => axios.get('http://localhost:8080/api/v1/auth/discord');

const getGuildIcon = async (id: string) => {
    const response = await axios.get(`http://localhost:8080/api/v1/discord/guilds/${id}/avatar`, { withCredentials: true });
    return response;
};

const getGuildName = async (id: string) => {
    const response = await axios.get(`http://localhost:8080/api/v1/discord/guilds/${id}/name`, { withCredentials: true });
    return response;
};

export { getUserDetails, displayUserAvatar, displayGuildIcon, getGuildIcon, getGuildName };
