const { MessageEmbed } = require('discord.js');
const os = require('os');

module.exports = {
    name: 'uptime',
    description: 'Get the bot uptime and server uptime',
    async execute(interaction, bot) {
        const botuptime = bot.uptime;
        const days = Math.floor(botuptime / 86400000);
        const hours = Math.floor(botuptime / 3600000) % 24;
        const minutes = Math.floor(botuptime / 60000) % 60;
        const seconds = Math.floor(botuptime / 1000) % 60;
        const sysuptime = os.uptime();
        const sysdays = Math.floor(sysuptime / 86400);
        const syshours = Math.floor(sysuptime / 3600) % 24;
        const sysminutes = Math.floor(sysuptime / 60) % 60;
        const sysseconds = Math.floor(sysuptime) % 60;
        const load = os.loadavg();

        const embed = new MessageEmbed()
            .setColor('#0000f6')
            .addField('Bot uptime', `${days}d ${hours}h ${minutes}m ${seconds}s`)
            .addField('System uptime', `${sysdays}d ${syshours}h ${sysminutes}m ${sysseconds}s`)
            .setFooter(`Load average: ${load.map(avg => avg.toFixed(2)).join(' ')}\nBot uptime = How long since the bot process was restarted\nSystem uptime = How long the computer running this bot has been on for`)
        interaction.reply({ embeds: [embed] });
    }
};