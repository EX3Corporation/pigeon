const { updateActivity } = require('../utils');

module.exports = {
    name: 'guildCreate',
    execute(guild, bot) {
        updateActivity(bot);
    }
};
