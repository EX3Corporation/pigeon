const fs = require('fs');
const path = require('path');
const { logError } = require('../utils/errorLogger');

module.exports = {
    name: 'error',
    execute(error, bot, channelSettings, userMessageHistory, ignoreTimes) {
        const errorMessage = `Client error: ${error.message || error}`;
        logError(errorMessage, {
            stack: error.stack,
            type: 'client_error'
        });

        if (error.message.includes('TOKEN_INVALID')) {
            console.error('Invalid token detected lol');
            bot.destroy();
            process.exit(1);
        } else if (error.message.includes('Ratelimit')) {
            console.warn('Rate limit hit, retarding operation...');
        } else {
            console.error(`Unhandled client error: ${error.message}`);
        }
    }
};