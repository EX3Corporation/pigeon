const { loadStats } = require('../utils');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'usage',
    description: 'See how many messages pigeon has processed',
    async execute(interaction, bot, channelSettings) {
        const stats = loadStats();
        const userId = interaction.user.id;

        let totalMessages = 0;
        let totalClears = 0;
        for (const user in stats) {
            totalMessages += stats[user].messages;
            totalClears += stats[user].clears;
        }

        const uniqueUsers = Object.keys(stats).length;

        const configuredServers = channelSettings && typeof channelSettings === 'object'
            ? Object.keys(channelSettings).filter(k => channelSettings[k]).length
            : 0;

        let activeServers = 0;
        if (configuredServers > 0) {
            for (const gid of Object.keys(channelSettings)) {
                if (channelSettings[gid] && bot.guilds.cache.has(gid)) activeServers++;
            }
        }

        if (activeServers === 0 && bot.guilds.cache.size > 0 && configuredServers > 0) {
            activeServers = configuredServers;
        }

        const pembed = new MessageEmbed()
            .setColor('#a8a89f')
            .setTitle('Messages and clears')
            .addField('People who have used pigeon', `${uniqueUsers.toLocaleString()}`, true)
            .addField('Servers subscribed', `${configuredServers.toLocaleString()}`, true)
            .addField('Active servers (in guild cache)', `${activeServers.toLocaleString()}`, true)
            .addField('Total messages', `${totalMessages.toLocaleString()}`, true)
            .addField('Total clears', `${totalClears.toLocaleString()}`, true);

        if (stats[userId]) {
            pembed.addField('Your messages', `${stats[userId].messages.toLocaleString()}`, true)
                .addField('Your clears', `${stats[userId].clears.toLocaleString()}`, true);
        }

        await interaction.reply({ embeds: [pembed] });
    }
};
