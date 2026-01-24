module.exports = {
    name: 'about',
    description: 'About pigeon',
    async execute(interaction) {
        interaction.reply({
            content: "See https://exerinity.com/pigeon",
            ephemeral: true
        });
    }
};
