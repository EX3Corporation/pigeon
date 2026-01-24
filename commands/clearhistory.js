const { addClear } = require('../utils');

module.exports = {
    name: 'clearhistory',
    description: 'Clear your chat history',
    async execute(interaction, bot, channelSettings, userMessageHistory, ignoreTimes) {
        const isDM = !interaction.guild;
        const guildId = interaction.guildId;
        const userId = interaction.user.id;

        const historyKey = isDM ? `dm-${userId}` : guildId;

        try {
            if (!userMessageHistory) {
                console.error(`userMessageHistory is undefined for user ${userId}`);
                return interaction.reply({ content: 'History not initialized :x:', ephemeral: true });
            }

            if (!userMessageHistory[historyKey]) {
                userMessageHistory[historyKey] = {};
            }

            if (userMessageHistory[historyKey][userId] && userMessageHistory[historyKey][userId].length > 0) {
                console.log(`Clearing history for user ${userId} in ${isDM ? 'DM' : 'guild ' + guildId}. History length: ${userMessageHistory[historyKey][userId].length}`);
                delete userMessageHistory[historyKey][userId];

                try {
                    addClear(userId);
                    console.log(`Updated clear stats for user ${userId}`);
                    await interaction.reply({
                        content: ':white_check_mark: Cleared this chat, all messages have been forgotten.',
                        ephemeral: false
                    });
                } catch (error) {
                    console.error(`Failed to update clear stats for user ${userId}: ${error}`);
                    await interaction.reply({
                        content: ':white_check_mark: Cleared, but failed to update stats...',
                        ephemeral: false
                    });
                }
            } else {
                console.log(`No history found for user ${userId} in ${isDM ? 'DM' : 'guild ' + guildId}`);
                await interaction.reply({ content: ':x: You have no history!', ephemeral: true });
            }
        } catch (e) {
            console.error(e);
            await interaction.reply({ content: ':x: Failed to clear history', ephemeral: true });
        }
    }
};
