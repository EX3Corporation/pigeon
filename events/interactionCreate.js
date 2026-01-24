require('dotenv').config();
const commands = require('../commands');

const BLOCKED_IDS = [
    process.env.DICKHEADS
];

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, bot, channelSettings, userMessageHistory, ignoreTimes) {

        if (interaction.user && BLOCKED_IDS.includes(interaction.user.id)) {
            return;
        }

        await commands.execute(interaction, bot, channelSettings, userMessageHistory, ignoreTimes);
    }
};
