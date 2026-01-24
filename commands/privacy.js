module.exports = {
    name: 'privacy',
    description: 'Privacy policy',
    async execute(interaction) {
        return interaction.reply(
        {
            content: "See https://pigeon.exerinity.com/privacy", ephemeral: true
        })
    }
};