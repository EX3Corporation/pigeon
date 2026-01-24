const fs = require('fs');
const config = require('../config');

module.exports = {
    name: 'remove',
    description: 'Remove the chat channel',
    async execute(interaction, bot, channelSettings) {
        if (!interaction.member.permissions.has("MANAGE_GUILD")) {
            return interaction.reply({ content: ":x: You don't have the Manage Server permission. Nice try though.", ephemeral: true });
        }

        if (channelSettings[interaction.guild.id]) {
            delete channelSettings[interaction.guild.id];
            try {
                fs.writeFileSync(config.DATA_FILE, JSON.stringify(channelSettings, null, 2));
                await interaction.reply(':white_check_mark: Removed! I am no longer listening, and will not respond to messages in this channel.');
            } catch (e) {
                console.error(e);
                await interaction.reply(':x: Failed to remove channel settings');
            }
        } else {
            await interaction.reply({ content: ':x: No channel is set!', ephemeral: true });
        }
    }
};