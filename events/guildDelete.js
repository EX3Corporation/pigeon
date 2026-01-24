const { updateActivity } = require('../utils');

module.exports = {
    name: 'guildDelete',
    execute(guild, bot) {
        updateActivity(bot);
    }
};
