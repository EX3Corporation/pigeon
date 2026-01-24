const fs = require('fs');
const config = require('../config');

module.exports = {
    name: 'chat',
    description: 'Set or get the chat channel',
    options: [
        {
            name: 'channel',
            type: 7,
            description: 'The channel to listen to',
            required: false
        }
    ],
    async execute(interaction, bot, channelSettings) {
        if (!interaction.guild) {
            return interaction.reply({
                content: 'no',
                ephemeral: true
            });
        }

        const channel = interaction.options.getChannel('channel');

        if (!channel) {
            const savedChannelId = channelSettings[interaction.guild.id];
            if (!savedChannelId) {
                return interaction.reply({ content: ':x: There is no channel set! To set one, run this command again and provide a channel.', ephemeral: true });
            }
            return interaction.reply(`:information_source: I am currently listening to <#${savedChannelId}>. To stop, run </remove:1350395728479911943>`);
        }

        if (!interaction.member.permissions.has('MANAGE_GUILD')) {
            return interaction.reply({ content: 'no', ephemeral: false });
        }

        if (channel.type !== 'GUILD_TEXT') {
            return interaction.reply({ content: ':x: Invalid or unreachable channel', ephemeral: true });
        }

        channelSettings[interaction.guild.id] = channel.id;
        try {
            fs.writeFileSync(config.DATA_FILE, JSON.stringify(channelSettings, null, 2));
            channel.send('I am now listening to this channel :wave:');
            await interaction.reply(`:white_check_mark: Now listening to <#${channel.id}>. I will reply to all messages sent there. To stop, run </remove:1350395728479911943>.`);
        } catch (e) {
            console.error(e);
            await interaction.reply({ content: ':x: Could not write to database', ephemeral: true });
        }
    }
};