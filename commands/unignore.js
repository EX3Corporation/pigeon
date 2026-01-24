module.exports = {
    name: 'unignore',
    description: 'Stop ignoring the user early',
    async execute(interaction, bot, channelSettings, userMessageHistory, ignoreTimes) {
        const userId = interaction.user.id;
        if (!ignoreTimes) {
            return interaction.reply({ content: ':x: Internal error! not initialized!', ephemeral: true });
        }

        if (!ignoreTimes[userId] || Date.now() >= ignoreTimes[userId]) {
            return interaction.reply({ content: `:x: I am not ignoring you!`, ephemeral: true });
        }

        delete ignoreTimes[userId];

        await interaction.reply({
            content: `:white_check_mark: Messages are being processed again`,
            ephemeral: false
        });
    }
};
