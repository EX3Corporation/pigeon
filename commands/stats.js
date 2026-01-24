const { loadStats } = require('../utils');
const Discord = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const { MessageEmbed } = require('discord.js');
const os = require('os');


module.exports = {
    name: 'stats',
    description: 'Self-explanatory',
    async execute(interaction) {
        const bot = interaction.client;
        const uptime = bot.uptime;
        const days = Math.floor(uptime / 86400000);
        const hours = Math.floor(uptime / 3600000) % 24;
        const minutes = Math.floor(uptime / 60000) % 60;
        const seconds = Math.floor(uptime / 1000) % 60;
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        const memory = Math.round(used * 100) / 100;
        const ping = bot.ws.ping;
        const servers = bot.guilds.cache.size;
        const userId = interaction.user.id;
        const stats = loadStats();

        let totalMessages = 0;
        let totalClears = 0;
        for (const user in stats) {
            totalMessages += stats[user].messages;
            totalClears += stats[user].clears;
        }

        const userStats = stats[userId] || { messages: 0, clears: 0 };


        const usage = process.cpuUsage();
        const user = usage.user / 1000000;
        const system = usage.system / 1000000;
        const total = (user + system) / 1000;

        const load = os.loadavg();

        const embed = await new MessageEmbed()
            .setColor('#5700B9')
            .setTitle('System stats')
            .addField('Uptime', `${days}d ${hours}h ${minutes}m ${seconds}s`, true)
            .addField('Memory usage', `${memory} MB`, true)
            .addField('Ping', `${ping} ms`, true)
            .addField('Servers', `${servers}`, true)
            .addFields(
                { name: "CPU", value: `${os.cpus()[0].model}`, inline: true },
                { name: "CPU Usage", value: `${total.toFixed(2)} s` },
                { name: "Server time", value: `${new Date().toLocaleString() || "N/A"}`, inline: true },
                { name: 'Node.js version', value: `${process.version}`, inline: true },
                { name: 'Discord.js version', value: `${Discord.version}`, inline: true },
                { name: 'Operating system', value: `${os.platform()} ${os.release()}`, inline: true },
                { name: 'Bot version', value: `v2 nightly`, inline: true },
                { name: 'Host', value: `ex3.lol`, inline: true },
                { name: 'Cached', value: `Members: ${bot.users.cache.size.toLocaleString()}\nChannels: ${bot.channels.cache.size.toLocaleString()}`, inline: true },
                { name: 'Load average', value: `${load.map(avg => avg.toFixed(2)).join(' ')}` }
            );


        await interaction.reply({ embeds: [embed] });
    }
};
