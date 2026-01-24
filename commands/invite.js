module.exports = {
    name: 'invite',
    description: 'Invite pigeon to your server',
    async execute(interaction, bot) {
        const link = `https://discord.com/oauth2/authorize?client_id=${bot.user.id}`;
        const button = {
            type: 1,
            components: [
                {
                    type: 2,
                    label: 'Invite',
                    style: 5,
                    url: link,
                },
            ],
        };
        const link2 = `https://exerinity.com/pigeon-invite`;
        const button2 = {
            type: 1,
            components: [
                {
                    type: 2,
                    label: 'Shortcut',
                    style: 5,
                    url: link2,
                },
            ],
        };
        await interaction.reply({ content: `Press one of these to invite. The first is a direct Discord link, and the second is a shortcut, for spreading the word, or just quick access. If you do not see these buttons, [click here](${link}).`, components: [button,button2], ephemeral: false });
    }
};