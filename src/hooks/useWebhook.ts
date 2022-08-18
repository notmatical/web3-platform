import VAPORIZE_LOGO from 'assets/images/logo.png';

const webhook = require('webhook-discord');
// import { Webhook, MessageBuilder } from 'discord-webhook-node';

// const Hook = new Webhook(
//     'https://discord.com/api/webhooks/969524099300872202/MKqDp6_L60qtCgGt-RadI-v5CwxU8v1SI9KxcbkT9VoCv4r_-trF12Hh2DEWz76AWQZS'
// );

const PublicWebhook = new webhook.Webhook(
    'https://discord.com/api/webhooks/982456777553637376/SurdJKOc9I_WWrKf-7X5F3X5QZ3wfW8wGpAkirLERNDX9eeUJ7jQzOjSfAZZzXIunKWZ'
);

// const publicWebhook = 'https://discord.com/api/webhooks/974825373005131776/SAtvWfFRuJxj2iez3-u8fRo0Xz-I-zNun4_7d6-BEjrA0-o6KQq8MWxkGfRCNB-7_-J9';
// const staffWebhook = 'https://discord.com/api/webhooks/982456777553637376/SurdJKOc9I_WWrKf-7X5F3X5QZ3wfW8wGpAkirLERNDX9eeUJ7jQzOjSfAZZzXIunKWZ';

// export const useWebhook = () => {

// }

// export const useStaffWebhook = () => {
//     const
// }

// export default { useWebhook, useStaffWebhook };

export const useWebhook = () => {
    const sendSuccessEmbed = async (title: string, author: string = 'Minx Labs', description: string) => {
        const embed = new webhook.MessageBuilder()
            .setName('Minx Labs')
            .setAuthor(author)
            .setTitle(`Minx Labs - ${title}`)
            .setURL('https://minxlabs.io')
            .setColor('#198754')
            .setDescription(description)
            .setThumbnail(VAPORIZE_LOGO);

        await PublicWebhook.send(embed);
    };

    // const sendErrorEmbed = (title: string, author: string = 'Minx Labs', description: string) => {
    //     const embed = new MessageBuilder()
    //         .setName('Minx Labs')
    //         .setTitle(`Minx Labs - ${title}`)
    //         .setURL('https://minxlabs.io')
    //         .setAuthor(author)
    //         .setColor('#d4425b')
    //         .setDescription(description)
    //         .setThumbnail(VAPORIZE_LOGO);

    //     Hook.send(embed);
    // };

    // const sendWarningEmbed = (title: string, author: string = 'Minx Labs', description: string) => {
    //     const embed = new MessageBuilder()
    //         .setName('Minx Labs')
    //         .setTitle(`Minx Labs - ${title}`)
    //         .setURL('https://minxlabs.io')
    //         .setAuthor(author)
    //         .setColor('#ec9c3d')
    //         .setDescription(description)
    //         .setThumbnail(VAPORIZE_LOGO);

    //     Hook.send(embed);
    // };

    // const sendInfoEmbed = (title: string, author: string = 'Minx Labs', description: string) => {
    //     // const embed = new MessageBuilder()
    //     //     .setName('Minx Labs')
    //     //     .setTitle(`Minx Labs - ${title}`)
    //     //     .setURL('https://minxlabs.io')
    //     //     .setColor('#0288d1')
    //     //     .setDescription(description)
    //     //     .setThumbnail(VAPORIZE_LOGO);

    //     Hook.info('Minx Labs', 'Hooking Test');
    // };

    return {
        sendSuccessEmbed
    };
};

export default useWebhook;
