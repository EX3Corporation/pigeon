const { updateActivity } = require('../utils');

module.exports = {
    name: 'ready',
    once: true,
    execute(bot, channelSettings, userMessageHistory, ignoreTimes) {
        console.log(`Logged in: ${bot.user.tag}`);
        bot.channels.resolve("1399308455239614525").send('bot restarted');
        updateActivity(bot);
        bot.user.setActivity("exerinity.com/pigeon", {type:"STREAMING", url: "https://twitch.tv/a"})
    }
};