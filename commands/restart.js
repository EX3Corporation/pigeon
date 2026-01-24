module.exports = {
    name: 'restart',
    description: 'Restart the bot (owner only)',
    async execute(interaction, bot) {
        if (interaction.user.id === '683100147512770602' || interaction.user.id === '972907501127344179') {
            await interaction.reply(":white_check_mark: Restarting...");
            console.log("Exiting.......");
            bot.destroy();
            process.exit();
        } else {
            await interaction.reply("no");
        }
    }
};