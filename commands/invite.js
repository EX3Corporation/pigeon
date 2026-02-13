module.exports = {
    name: 'invite',
    description: 'Invite pigeon to your server',
    async execute(interaction, bot) {
        await interaction.reply("https://exerinity.com/pigeon/invite");
    }
};